import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin Blog API
export const blogApi = {
  // Get all blogs (admin)
  getAll: async (params = {}) => {
    const response = await api.get('/admin/blog', { params });
    return response.data;
  },

  // Get categories (public)
  getCategories: async () => {
    const response = await api.get('/blogs/categories');
    return response.data;
  },

  // Get tags (public)
  getTags: async () => {
    const response = await api.get('/blogs/tags');
    return response.data;
  },

  // Get single blog by ID
  getById: async id => {
    const response = await api.get(`/admin/blog/${id}`);
    return response.data;
  },

  // Create new blog
  create: async blogData => {
    const response = await api.post('/admin/blog', blogData);
    return response.data;
  },

  // Update blog
  update: async (id, blogData) => {
    const response = await api.put(`/admin/blog/${id}`, blogData);
    return response.data;
  },

  // Update blog status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/admin/blog/${id}/status`, { status });
    return response.data;
  },

  // Delete blog
  delete: async id => {
    const response = await api.delete(`/admin/blog/${id}`);
    return response.data;
  },
};

export default api;
