const blogService = require('../services/public.blog.service');

/**
 * GET /api/blogs
 * Get paginated list of published blogs
 */
const getBlogs = async (req, res, next) => {
  try {
    const { cursor, limit, category, tag, search } = req.query;

    const result = await blogService.getPublishedBlogs({
      cursor,
      limit: parseInt(limit) || 10,
      category,
      tag,
      search,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/categories
 * Get all categories with counts
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await blogService.getCategories();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/tags
 * Get all tags with counts
 */
const getTags = async (req, res, next) => {
  try {
    const tags = await blogService.getTags();
    res.json({ tags });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/:slug
 * Get single blog by slug
 */
const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await blogService.getBlogBySlug(slug);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Do NOT auto-increment view on GET. The frontend should call the
    // dedicated endpoint POST /api/blogs/:slug/view once per user/browser.
    res.json({ blog });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/blogs/:slug/view
 * Increment view counter for a blog (non-blocking)
 */
const incrementBlogView = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Fire-and-forget increment; service will perform update
    blogService.incrementViewCount(slug);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/:slug/related
 * Get related blogs
 */
const getRelatedBlogs = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { limit } = req.query;

    const relatedBlogs = await blogService.getRelatedBlogs(slug, parseInt(limit) || 4);

    res.json({ blogs: relatedBlogs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getCategories,
  getTags,
  getBlogBySlug,
  incrementBlogView,
  getRelatedBlogs,
};
