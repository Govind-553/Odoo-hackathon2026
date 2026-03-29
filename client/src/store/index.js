import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import expenseReducer from './slices/expenseSlice';
import approvalRuleReducer from './slices/approvalRuleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    expenses: expenseReducer,
    approvalRules: approvalRuleReducer,
  },
});

export default store;
