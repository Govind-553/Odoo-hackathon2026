import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const submitExpense = createAsyncThunk('expenses/submit', async (expenseData, { rejectWithValue }) => {
  try {
    const response = await api.post('/expenses', expenseData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit expense');
  }
});

export const fetchMyExpenses = createAsyncThunk('expenses/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/expenses/mine');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch your expenses');
  }
});

export const fetchAllExpenses = createAsyncThunk('expenses/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/expenses');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch expenses');
  }
});

export const fetchPendingApprovals = createAsyncThunk('expenses/fetchPending', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/expenses/pending');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending approvals');
  }
});

export const fetchExpenseById = createAsyncThunk('expenses/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/expenses/${id}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch expense');
  }
});

export const approveExpense = createAsyncThunk('expenses/approve', async ({ id, comment }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/expenses/${id}/approve`, { comment });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to approve expense');
  }
});

export const rejectExpense = createAsyncThunk('expenses/reject', async ({ id, comment }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/expenses/${id}/reject`, { comment });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to reject expense');
  }
});

export const overrideExpense = createAsyncThunk('expenses/override', async ({ id, action, comment }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/expenses/${id}/override`, { action, comment });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to override expense');
  }
});

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    mine: [],         // employee's own expenses
    allExpenses: [],  // admin view
    pending: [],      // manager approval queue
    selectedExpense: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearExpenseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit expense
      .addCase(submitExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.mine.unshift(action.payload);
      })
      .addCase(submitExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // My expenses
      .addCase(fetchMyExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // All expenses (Admin)
      .addCase(fetchAllExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.allExpenses = action.payload;
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Pending approvals (Manager)
      .addCase(fetchPendingApprovals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingApprovals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Single expense detail
      .addCase(fetchExpenseById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedExpense = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpense = action.payload;
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve expense
      .addCase(approveExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpense = action.payload;
        // Remove from pending queue so UI updates immediately
        state.pending = state.pending.filter(e => e._id !== action.payload._id);
        // Update in admin list if present
        const idx = state.allExpenses.findIndex(e => e._id === action.payload._id);
        if (idx !== -1) state.allExpenses[idx] = action.payload;
      })
      .addCase(approveExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject expense
      .addCase(rejectExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpense = action.payload;
        // Remove from pending queue so UI updates immediately
        state.pending = state.pending.filter(e => e._id !== action.payload._id);
        // Update in admin list if present
        const idx = state.allExpenses.findIndex(e => e._id === action.payload._id);
        if (idx !== -1) state.allExpenses[idx] = action.payload;
      })
      .addCase(rejectExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin override
      .addCase(overrideExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(overrideExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpense = action.payload;
        const idx = state.allExpenses.findIndex(e => e._id === action.payload._id);
        if (idx !== -1) state.allExpenses[idx] = action.payload;
      })
      .addCase(overrideExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
