import { configureStore } from '@reduxjs/toolkit';
import adminBlogReducer from './adminBlogSlice';

export const store = configureStore({
  reducer: {
    adminBlogs: adminBlogReducer,
  },
});
