const Blog = require('../models/Blog');
const cache = require('../config/cache');

// Cache key prefixes
const CACHE_KEYS = {
  BLOG_LIST: 'blogs:list',
  BLOG_DETAIL: 'blogs:detail',
  BLOG_RELATED: 'blogs:related',
};

/**
 * Get paginated list of published blogs
 * Supports cursor-based pagination for performance
 */
const getPublishedBlogs = async ({ cursor, limit = 10, category, tag, search }) => {
  // Try cache first
  const cacheKey = cache.generateKey(
    CACHE_KEYS.BLOG_LIST,
    `${cursor || 'first'}_${limit}_${category || ''}_${tag || ''}_${search || ''}`
  );
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  // Build query
  const query = { status: 'published' };

  if (category) {
    query.category = category;
  }

  if (tag) {
    query.tags = tag;
  }

  // Text search over title and summary (case-insensitive)
  if (search && String(search).trim().length > 0) {
    const s = String(search).trim();
    query.$or = [
      { title: { $regex: s, $options: 'i' } },
      { summary: { $regex: s, $options: 'i' } },
    ];
  }

  // Cursor-based pagination
  if (cursor) {
    query.publishedAt = { $lt: new Date(cursor) };
  }

  const blogs = await Blog.find(query)
    .select('title slug summary coverImage tags category publishedAt views')
    .sort({ publishedAt: -1 })
    .limit(limit + 1) // Fetch one extra to check if there's more
    .lean();

  // Determine if there are more results
  const hasMore = blogs.length > limit;
  const results = hasMore ? blogs.slice(0, -1) : blogs;
  const nextCursor = hasMore ? results[results.length - 1].publishedAt : null;

  const response = {
    blogs: results,
    pagination: {
      hasMore,
      nextCursor,
      count: results.length,
    },
  };

  // Cache for 5 minutes
  await cache.set(cacheKey, response, 300);

  return response;
};

/**
 * Get single blog by slug
 */
const getBlogBySlug = async slug => {
  // Try cache first
  const cacheKey = cache.generateKey(CACHE_KEYS.BLOG_DETAIL, slug);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const blog = await Blog.findOne({ slug, status: 'published' }).lean();

  if (blog) {
    // Cache for 10 minutes
    await cache.set(cacheKey, blog, 600);
  }

  return blog;
};

/**
 * Get related blogs based on category or tags
 */
const getRelatedBlogs = async (slug, limit = 4) => {
  // Try cache first
  const cacheKey = cache.generateKey(CACHE_KEYS.BLOG_RELATED, `${slug}_${limit}`);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  // First get the current blog
  const currentBlog = await Blog.findOne({ slug }).lean();

  if (!currentBlog) {
    return [];
  }

  // Find related by category OR tags, excluding current blog
  const relatedBlogs = await Blog.find({
    _id: { $ne: currentBlog._id },
    status: 'published',
    $or: [{ category: currentBlog.category }, { tags: { $in: currentBlog.tags } }],
  })
    .select('title slug summary coverImage tags category publishedAt')
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  // Cache for 10 minutes
  await cache.set(cacheKey, relatedBlogs, 600);

  return relatedBlogs;
};

/**
 * Increment view count asynchronously
 * Non-blocking - doesn't wait for completion
 */
const incrementViewCount = slug => {
  // Fire and forget - don't await
  Blog.updateOne({ slug }, { $inc: { views: 1 } }).exec();
};

/**
 * Get all categories with blog counts
 */
const getCategories = async () => {
  const cacheKey = 'blogs:categories';
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const categories = await Blog.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { category: '$_id', count: 1, _id: 0 } },
  ]);

  await cache.set(cacheKey, categories, 600);
  return categories;
};

/**
 * Get all tags with blog counts
 */
const getTags = async () => {
  const cacheKey = 'blogs:tags';
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const tags = await Blog.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { tag: '$_id', count: 1, _id: 0 } },
  ]);

  await cache.set(cacheKey, tags, 600);
  return tags;
};

module.exports = {
  getPublishedBlogs,
  getBlogBySlug,
  getRelatedBlogs,
  incrementViewCount,
  getCategories,
  getTags,
};
