import ApprovalRule from '../models/ApprovalRule.js';

// @desc    Get all rules for company
// @route   GET /api/approval-rules
// @access  Admin
export const getRules = async (req, res, next) => {
  try {
    const rules = await ApprovalRule.find({ companyId: req.user.companyId })
      .populate('approvers.userId', 'name email role')
      .populate('specificApproverId', 'name email role');
    res.json({ success: true, data: rules });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new approval rule
// @route   POST /api/approval-rules
// @access  Admin
export const createRule = async (req, res, next) => {
  try {
    const { name, isManagerApproverFirst, approvers, conditionType, percentageThreshold, specificApproverId } = req.body;

    const rule = await ApprovalRule.create({
      companyId: req.user.companyId,
      name,
      isManagerApproverFirst: isManagerApproverFirst || false,
      approvers: approvers || [],
      conditionType: conditionType || 'none',
      percentageThreshold: percentageThreshold || null,
      specificApproverId: specificApproverId || null,
    });

    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

// @desc    Update approval rule
// @route   PUT /api/approval-rules/:id
// @access  Admin
export const updateRule = async (req, res, next) => {
  try {
    const rule = await ApprovalRule.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!rule) {
      res.status(404);
      throw new Error('Rule not found');
    }

    res.json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete approval rule
// @route   DELETE /api/approval-rules/:id
// @access  Admin
export const deleteRule = async (req, res, next) => {
  try {
    const rule = await ApprovalRule.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId
    });

    if (!rule) {
      res.status(404);
      throw new Error('Rule not found');
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
