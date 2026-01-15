const Joi = require('joi');

/**
 * Joi validation schemas for blog requests
 */

const blogSchemas = {
  // Create/Update blog validation
  createBlog: Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 200 characters',
    }),
    summary: Joi.string().min(10).max(500).required().messages({
      'string.empty': 'Summary is required',
      'string.min': 'Summary must be at least 10 characters',
      'string.max': 'Summary must not exceed 500 characters',
    }),
    content: Joi.object().required().messages({
      'object.base': 'Content must be a valid TipTap JSON object',
      'any.required': 'Content is required',
    }),
    category: Joi.string().required().messages({
      'string.empty': 'Category is required',
    }),
    tags: Joi.array().items(Joi.string()).min(1).max(10).required().messages({
      'array.min': 'At least one tag is required',
      'array.max': 'Maximum 10 tags allowed',
    }),
    coverImage: Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().allow('').optional(),
    }).optional(),
    seo: Joi.object({
      metaTitle: Joi.string().max(70).allow('').optional(),
      metaDescription: Joi.string().max(160).allow('').optional(),
      keywords: Joi.array().items(Joi.string()).optional(),
    }).optional(),
    status: Joi.string().valid('draft', 'published').default('draft'),
  }),

  // Update blog validation
  updateBlog: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    summary: Joi.string().min(10).max(500).optional(),
    content: Joi.object().optional(),
    category: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).min(1).max(10).optional(),
    coverImage: Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().allow('').optional(),
    }).optional(),
    seo: Joi.object({
      metaTitle: Joi.string().max(70).allow('').optional(),
      metaDescription: Joi.string().max(160).allow('').optional(),
      keywords: Joi.array().items(Joi.string()).optional(),
    }).optional(),
    status: Joi.string().valid('draft', 'published').optional(),
  }).min(1),

  // Query params validation
  listQuery: Joi.object({
    cursor: Joi.string().isoDate().optional(),
    limit: Joi.number().integer().min(1).max(100).default(10),
    category: Joi.string().optional(),
    tag: Joi.string().optional(),
    search: Joi.string().max(100).optional(),
    status: Joi.string().valid('draft', 'published', 'all').optional(),
    page: Joi.number().integer().min(1).optional(),
  }),

  // MongoDB ObjectId validation
  mongoId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid ID format',
    }),

  // Slug validation
  slug: Joi.string()
    .regex(/^[a-z0-9-]+$/)
    .messages({
      'string.pattern.base': 'Invalid slug format',
    }),
};

module.exports = blogSchemas;
