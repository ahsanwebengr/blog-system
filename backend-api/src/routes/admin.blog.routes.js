const express = require('express');
const router = express.Router();
const blogController = require('../controllers/admin.blog.controller');

// GET /api/admin/blog - Get all blogs (including drafts)
router.get('/', blogController.getAllBlogs);

// GET /api/admin/blog/:id - Get single blog by ID
router.get('/:id', blogController.getBlogById);

// POST /api/admin/blog - Create a new blog
router.post('/', blogController.createBlog);

// PUT /api/admin/blog/:id - Update an existing blog
router.put('/:id', blogController.updateBlog);

// PATCH /api/admin/blog/:id/status - Update blog status
router.patch('/:id/status', blogController.updateBlogStatus);

// DELETE /api/admin/blog/:id - Delete a blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
