import Expense from '../models/Expense.js';

/**
 * Builds the resolved approver chain for an expense submission.
 * @param {Object} expense - The expense claim metadata.
 * @param {Object} approvalRule - The applicable approval rule.
 * @param {Object} employee - The employee model submitting the claim.
 * @returns {Array} List of User ObjectIds.
 */
export const buildChain = (expense, approvalRule, employee) => {
  let chain = [];

  // 1. Manager-first check
  if (approvalRule.isManagerApproverFirst && employee.managerId) {
    chain.push(employee.managerId.toString());
  }

  // 2. Add rule approvers in sequence
  if (approvalRule.approvers && approvalRule.approvers.length > 0) {
    const sortedApprovers = [...approvalRule.approvers].sort((a, b) => a.sequence - b.sequence);
    sortedApprovers.forEach(approver => {
      const id = approver.userId.toString();
      if (!chain.includes(id)) {
        chain.push(id);
      }
    });
  }

  return chain;
};

/**
 * Checks if conditional approval thresholds are met.
 * @param {Object} expense - The expense document with logs.
 * @param {Object} approvalRule - The rule configuration.
 * @returns {Boolean} True if condition met.
 */
export const checkConditionalApproval = (expense, approvalRule) => {
  const { conditionType, percentageThreshold, specificApproverId } = approvalRule;
  const { approvalLog, resolvedApproverChain } = expense;
  
  const approvedLog = approvalLog.filter(log => log.action === 'approved');
  const approvedCount = approvedLog.length;
  const totalApprovers = resolvedApproverChain.length;

  switch (conditionType) {
    case 'none':
      return false;

    case 'percentage':
      if (totalApprovers === 0) return false;
      return (approvedCount / totalApprovers) * 100 >= (percentageThreshold || 100);

    case 'specific':
      if (!specificApproverId) return false;
      return approvedLog.some(log => log.approverId.toString() === specificApproverId.toString());

    case 'hybrid':
      // Percentage OR Specific
      const isPercentMet = totalApprovers > 0 && (approvedCount / totalApprovers) * 100 >= (percentageThreshold || 100);
      const isSpecificMet = specificApproverId && approvedLog.some(log => log.approverId.toString() === specificApproverId.toString());
      return isPercentMet || isSpecificMet;

    default:
      return false;
  }
};

/**
 * Processes an approval action from a manager.
 * @returns {Object} Updated expense.
 */
export const processAction = async (expenseId, approverId, action, comment, approvalRule) => {
  const expense = await Expense.findById(expenseId);
  if (!expense) throw new Error('Expense not found');

  const { resolvedApproverChain, currentApproverIndex } = expense;

  // 1. Validate if this user is the current active approver
  if (resolvedApproverChain[currentApproverIndex].toString() !== approverId.toString()) {
    throw new Error('You are not the current authorized approver for this claim');
  }

  // 2. Update logs
  expense.approvalLog.push({
    approverId,
    action,
    comment,
    timestamp: new Date(),
  });

  // 3. Handle action
  if (action === 'rejected') {
    expense.status = 'rejected';
  } else if (action === 'approved') {
    // Check if conditional logic finishes the chain early
    const isAutoApproved = checkConditionalApproval(expense, approvalRule);

    if (isAutoApproved) {
      expense.status = 'approved';
    } else {
      // Step to next approver
      expense.currentApproverIndex += 1;
      
      // If at end of chain, finish
      if (expense.currentApproverIndex >= resolvedApproverChain.length) {
        expense.status = 'approved';
      } else {
        expense.status = 'in_review';
      }
    }
  }

  await expense.save();
  return expense;
};

export default {
  buildChain,
  processAction,
  checkConditionalApproval,
};
