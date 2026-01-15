import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public Blog API
export const blogApi = {
  // Get paginated list of published blogs
  getAll: async (params = {}) => {
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  // Get single blog by slug
  getBySlug: async slug => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  },

  // Get related blogs
  getRelated: async (slug, limit = 4) => {
    const response = await api.get(`/blogs/${slug}/related`, {
      params: { limit },
    });
    return response.data;
  },

  // Increment view count (called by client once per user/browser)
  incrementView: async slug => {
    const response = await api.post(`/blogs/${slug}/view`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/blogs/categories');
    return response.data;
  },

  // Get tags
  getTags: async () => {
    const response = await api.get('/blogs/tags');
    return response.data;
  },
};

export default api;
