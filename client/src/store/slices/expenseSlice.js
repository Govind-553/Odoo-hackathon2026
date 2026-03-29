import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const submitExpense = createAsyncThunk('expenses/submit', async (expenseData, { rejectWithValue }) => {
  try {
    const response = await api.post('/expenses', expenseData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || 'Failed to submit expense');
  }
});

export const fetchMyExpenses = createAsyncThunk('expenses/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/expenses/mine');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || 'Failed to fetch your expenses');
  }
});

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
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
      .addCase(submitExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.unshift(action.payload);
      })
      .addCase(submitExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchMyExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
