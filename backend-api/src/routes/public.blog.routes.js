const express = require('express');
const router = express.Router();
const blogController = require('../controllers/public.blog.controller');

// GET /api/blogs - Get paginated list of published blogs
router.get('/', blogController.getBlogs);

// GET /api/blogs/categories - Get all categories
router.get('/categories', blogController.getCategories);

// GET /api/blogs/tags - Get all tags
router.get('/tags', blogController.getTags);

// GET /api/blogs/:slug - Get single blog by slug
router.get('/:slug', blogController.getBlogBySlug);

// POST /api/blogs/:slug/view - Increment blog view (called by client once)
router.post('/:slug/view', blogController.incrementBlogView);

// GET /api/blogs/:slug/related - Get related blogs
router.get('/:slug/related', blogController.getRelatedBlogs);

module.exports = router;
