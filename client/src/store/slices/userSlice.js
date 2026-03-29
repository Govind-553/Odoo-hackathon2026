import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || 'Failed to fetch users');
  }
});

export const createUser = createAsyncThunk('users/create', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/users', userData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message || 'Failed to create user');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      });
  },
});

export default userSlice.reducer;
