/**
 * Admin Panel Constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  TIMEOUT: 30000,
};

// Blog Status
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ALL: 'all',
};

// Categories
export const CATEGORIES = [
  'Technology',
  'Programming',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'Design',
  'Business',
  'Lifestyle',
  'Tutorial',
  'News',
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// SEO Limits
export const SEO_LIMITS = {
  META_TITLE_MAX: 70,
  META_DESCRIPTION_MAX: 160,
  TITLE_MIN: 3,
  TITLE_MAX: 200,
  SUMMARY_MIN: 10,
  SUMMARY_MAX: 500,
  TAGS_MAX: 10,
  KEYWORDS_MAX: 10,
};

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch blogs',
  CREATE_FAILED: 'Failed to create blog',
  UPDATE_FAILED: 'Failed to update blog',
  DELETE_FAILED: 'Failed to delete blog',
  STATUS_UPDATE_FAILED: 'Failed to update status',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Please fill all required fields correctly.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  BLOG_CREATED: 'Blog created successfully!',
  BLOG_UPDATED: 'Blog updated successfully!',
  BLOG_DELETED: 'Blog deleted successfully!',
  STATUS_UPDATED: 'Status updated successfully!',
  PUBLISHED: 'Blog published successfully!',
  UNPUBLISHED: 'Blog unpublished successfully!',
};

// Route Paths
export const ROUTES = {
  BLOGS: '/blogs',
  CREATE_BLOG: '/blogs/create',
  EDIT_BLOG: '/blogs/edit/:id',
};
