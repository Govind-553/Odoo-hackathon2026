import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRules = createAsyncThunk(
  'approvalRules/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/approval-rules');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch approval rules'
      );
    }
  }
);

export const createRule = createAsyncThunk(
  'approvalRules/create',
  async (ruleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/approval-rules', ruleData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create approval rule'
      );
    }
  }
);

export const updateRule = createAsyncThunk(
  'approvalRules/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/approval-rules/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update approval rule'
      );
    }
  }
);

export const deleteRule = createAsyncThunk(
  'approvalRules/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/approval-rules/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete approval rule'
      );
    }
  }
);

const approvalRuleSlice = createSlice({
  name: 'approvalRules',
  initialState: {
    rules: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRules
      .addCase(fetchRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload;
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createRule
      .addCase(createRule.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRule.fulfilled, (state, action) => {
        state.loading = false;
        state.rules.push(action.payload);
      })
      .addCase(createRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateRule
      .addCase(updateRule.fulfilled, (state, action) => {
        const idx = state.rules.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.rules[idx] = action.payload;
      })
      // deleteRule
      .addCase(deleteRule.fulfilled, (state, action) => {
        state.rules = state.rules.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearError } = approvalRuleSlice.actions;
export default approvalRuleSlice.reducer;
