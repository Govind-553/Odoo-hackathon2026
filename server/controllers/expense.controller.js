import Expense from '../models/Expense.js';
import Company from '../models/Company.js';
import User from '../models/User.js';
import ApprovalRule from '../models/ApprovalRule.js';
import { convertCurrency } from '../services/currencyService.js';
import { buildChain, processAction } from '../services/approvalEngine.js';

// @desc    Submit new expense claim
// @route   POST /api/expenses
// @access  Employee
export const submitExpense = async (req, res, next) => {
  try {
    const { amount, currency, category, description, date, receiptUrl } = req.body;
    const employee = await User.findById(req.user.userId);
    const company = await Company.findById(req.user.companyId);

    if (!company) {
      res.status(404);
      throw new Error('Company not found');
    }

    // 1. Currency Conversion
    const { convertedAmount, rate } = await convertCurrency(amount, currency, company.defaultCurrency);

    // 2. Select Approval Rule (Default to first available rule for company)
    let rule = await ApprovalRule.findOne({ companyId: req.user.companyId }).sort({ createdAt: 1 });
    
    // 3. Build Approver Chain via Workflow Engine
    let chain = [];
    if (rule) {
      chain = buildChain(req.body, rule, employee);
    } else {
      // Fallback: If no rule, use manager if exists
      if (employee.managerId) chain = [employee.managerId.toString()];
    }

    // 4. Create Expense
    const expense = await Expense.create({
      employeeId: req.user.userId,
      companyId: req.user.companyId,
      amount,
      currency,
      amountInCompanyCurrency: convertedAmount,
      exchangeRate: rate,
      category,
      description,
      date,
      receiptUrl,
      status: chain.length > 0 ? 'in_review' : 'approved', // Auto-approve if no chain
      approvalRuleId: rule ? rule._id : null,
      resolvedApproverChain: chain,
      currentApproverIndex: 0,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve expense
// @route   PATCH /api/expenses/:id/approve
// @access  Manager/Admin
export const approveExpense = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const expense = await Expense.findById(req.params.id);
    if (!expense) throw new Error('Expense not found');

    const rule = await ApprovalRule.findById(expense.approvalRuleId);
    
    const updatedExpense = await processAction(
      expense._id,
      req.user.userId,
      'approved',
      comment,
      rule
    );

    res.json({ success: true, data: updatedExpense });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject expense
// @route   PATCH /api/expenses/:id/reject
// @access  Manager/Admin
export const rejectExpense = async (req, res, next) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      res.status(400);
      throw new Error('Comment is required for rejection');
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) throw new Error('Expense not found');

    const rule = await ApprovalRule.findById(expense.approvalRuleId);

    const updatedExpense = await processAction(
      expense._id,
      req.user.userId,
      'rejected',
      comment,
      rule
    );

    res.json({ success: true, data: updatedExpense });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending approvals for manager
// @route   GET /api/expenses/pending
// @access  Manager
export const getPendingApprovals = async (req, res, next) => {
  try {
    // Expense where current active approver in the chain is the current user
    const expenses = await Expense.find({
      companyId: req.user.companyId,
      status: 'in_review',
    }).populate('employeeId', 'name email');

    const pending = expenses.filter(exp => 
      exp.resolvedApproverChain[exp.currentApproverIndex]?.toString() === req.user.userId.toString()
    );

    res.json({ success: true, data: pending });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin override
// @route   PATCH /api/expenses/:id/override
// @access  Admin
export const adminOverride = async (req, res, next) => {
  try {
    const { action, comment } = req.body; // approved or rejected
    
    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      companyId: req.user.companyId 
    });

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    expense.status = action;
    expense.approvalLog.push({
      approverId: req.user.userId,
      action: 'overridden',
      comment: `Admin Override to ${action}: ${comment}`,
      timestamp: new Date()
    });

    await expense.save();
    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all company expenses
// @route   GET /api/expenses
// @access  Admin
export const getAllExpenses = async (req, res, next) => {
  try {
    const { status, category, employeeId } = req.query;
    const query = { companyId: req.user.companyId };

    if (status) query.status = status;
    if (category) query.category = category;
    if (employeeId) query.employeeId = employeeId;

    const expenses = await Expense.find(query)
      .populate('employeeId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get own expenses
// @route   GET /api/expenses/mine
// @access  Employee
export const getMyExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ employeeId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  All
export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    }).populate('employeeId', 'name email')
      .populate('resolvedApproverChain', 'name role')
      .populate('approvalLog.approverId', 'name role');

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};
