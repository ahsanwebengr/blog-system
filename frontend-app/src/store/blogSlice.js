import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogApi } from '@/services/blog.api';

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await blogApi.getAll(params);
      return { data, params };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'blogs/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await blogApi.getCategories();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  blogs: [],
  pagination: { hasMore: false, nextCursor: null, count: 0 },
  loading: false,
  loadingMore: false,
  error: null,
  categories: [],
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearBlogs(state) {
      state.blogs = [];
      state.pagination = { hasMore: false, nextCursor: null, count: 0 };
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBlogs.pending, (state, action) => {
        const { cursor } = action.meta.arg || {};
        if (cursor) {
          state.loadingMore = true;
        } else {
          state.loading = true;
          state.blogs = [];
        }
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (action.meta.arg && action.meta.arg.cursor) {
          state.blogs = [...state.blogs, ...data.blogs];
        } else {
          state.blogs = data.blogs;
        }
        state.pagination = data.pagination || { hasMore: false, nextCursor: null };
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.error = action.payload || 'Failed to load blogs.';
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        const list = action.payload.categories || action.payload || [];
        state.categories = (Array.isArray(list) ? list : []).map(item => {
          if (typeof item === 'string') return item;
          return item.category || item.name || item._id || JSON.stringify(item);
        });
      })
      .addCase(fetchCategories.rejected, state => {
        // ignore, categories optional
      });
  },
});

export const { clearBlogs } = blogSlice.actions;
export default blogSlice.reducer;
