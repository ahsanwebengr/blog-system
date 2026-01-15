import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const fetchAdminBlogs = createAsyncThunk(
  'adminBlogs/fetchAdminBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/admin/blogs`, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAdminBlogById = createAsyncThunk(
  'adminBlogs/fetchAdminBlogById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/admin/blogs/${id}`);
      return res.data.blog;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const adminBlogSlice = createSlice({
  name: 'adminBlogs',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminBlogs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        state.list = action.payload.blogs || action.payload || [];
        state.loading = false;
      })
      .addCase(fetchAdminBlogs.rejected, (state, action) => {
        state.error = action.payload || 'Failed to load blogs';
        state.loading = false;
      })
      .addCase(fetchAdminBlogById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminBlogById.rejected, (state, action) => {
        state.error = action.payload || 'Failed to load blog';
        state.loading = false;
      });
  },
});

export const { clearCurrent } = adminBlogSlice.actions;
export default adminBlogSlice.reducer;
