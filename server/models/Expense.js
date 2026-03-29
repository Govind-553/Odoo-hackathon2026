import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  amountInCompanyCurrency: {
    type: Number,
    required: true,
  },
  exchangeRate: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Travel', 'Meals', 'Accommodation', 'Office', 'Other'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    required: true,
  },
  receiptUrl: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'in_review', 'approved', 'rejected'],
    default: 'pending',
  },
  approvalRuleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApprovalRule',
    default: null,
  },
  resolvedApproverChain: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  currentApproverIndex: {
    type: Number,
    default: 0,
  },
  approvalLog: [{
    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      enum: ['approved', 'rejected', 'overridden'],
    },
    comment: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
