const blogService = require('../services/admin.blog.service');

/**
 * GET /api/admin/blog
 * Get all blogs for admin (including drafts)
 */
const getAllBlogs = async (req, res, next) => {
  try {
    const { page, limit, status, search, category, tag } = req.query;

    const result = await blogService.getAllBlogs({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      status,
      search,
      category,
      tag,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/blog/:id
 * Get single blog by ID for admin
 */
const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await blogService.getBlogById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/blog
 * Create a new blog
 */
const createBlog = async (req, res, next) => {
  try {
    const blogData = req.body;

    // Validate required fields
    const requiredFields = ['title', 'summary', 'content', 'category'];
    const missingFields = requiredFields.filter(field => !blogData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Validate content is an object (TipTap JSON)
    if (typeof blogData.content !== 'object') {
      return res.status(400).json({
        error: 'Content must be TipTap JSON object',
      });
    }

    const blog = await blogService.createBlog(blogData);
    res.status(201).json({ blog });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * PUT /api/admin/blog/:id
 * Update an existing blog
 */
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogData = req.body;

    // Validate content if provided
    if (blogData.content && typeof blogData.content !== 'object') {
      return res.status(400).json({
        error: 'Content must be TipTap JSON object',
      });
    }

    const blog = await blogService.updateBlog(id, blogData);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * PATCH /api/admin/blog/:id/status
 * Update blog status (publish/unpublish)
 */
const updateBlogStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({
        error: 'Status must be either "draft" or "published"',
      });
    }

    const blog = await blogService.updateBlogStatus(id, status);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/blog/:id
 * Delete a blog
 */
const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await blogService.deleteBlog(id);

    if (!result) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
};
