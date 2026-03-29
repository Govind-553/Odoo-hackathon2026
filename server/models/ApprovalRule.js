import mongoose from 'mongoose';

const approvalRuleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isManagerApproverFirst: {
    type: Boolean,
    default: false,
  },
  approvers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sequence: {
      type: Number,
    },
  }],
  conditionType: {
    type: String,
    enum: ['none', 'percentage', 'specific', 'hybrid'],
    default: 'none',
  },
  percentageThreshold: {
    type: Number,
    default: null,
  },
  specificApproverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ApprovalRule = mongoose.model('ApprovalRule', approvalRuleSchema);
export default ApprovalRule;
