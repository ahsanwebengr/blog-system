/**
 * Application Constants
 * Centralized constants for better maintainability
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 9,
  MAX_PAGE_SIZE: 100,
};

// Blog Status
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  VIEWED_BLOGS: 'viewed_blogs_v1',
  THEME: 'theme_preference',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  ISO: 'yyyy-MM-dd',
};

// SEO Limits
export const SEO_LIMITS = {
  META_TITLE_MAX: 70,
  META_DESCRIPTION_MAX: 160,
  TITLE_MIN: 3,
  TITLE_MAX: 200,
  SUMMARY_MIN: 10,
  SUMMARY_MAX: 500,
};

// Categories (can be fetched from API or kept as constants)
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

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  BLOG_CREATED: 'Blog post created successfully!',
  BLOG_UPDATED: 'Blog post updated successfully!',
  BLOG_DELETED: 'Blog post deleted successfully!',
  BLOG_PUBLISHED: 'Blog post published successfully!',
  BLOG_UNPUBLISHED: 'Blog post unpublished successfully!',
};

// Debounce Delays
export const DEBOUNCE = {
  SEARCH: 300,
  AUTOSAVE: 1000,
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  BLOG_LIST: '/',
  BLOG_DETAIL: '/blog/:slug',
  NOT_FOUND: '*',
};
