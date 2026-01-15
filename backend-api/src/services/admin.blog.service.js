const Blog = require('../models/Blog');
const cache = require('../config/cache');

/**
 * Create a new blog post
 */
const createBlog = async blogData => {
  const blog = new Blog(blogData);
  await blog.save();

  // Invalidate list cache
  await cache.delByPattern('blogs:list:*');
  await cache.del('blogs:categories');
  await cache.del('blogs:tags');

  return blog;
};

/**
 * Update an existing blog post
 */
const updateBlog = async (id, blogData) => {
  const blog = await Blog.findById(id);

  if (!blog) {
    return null;
  }

  // Update fields
  Object.keys(blogData).forEach(key => {
    if (blogData[key] !== undefined) {
      blog[key] = blogData[key];
    }
  });

  await blog.save();

  // Invalidate caches
  await cache.del(cache.generateKey('blogs:detail', blog.slug));
  await cache.delByPattern('blogs:list:*');
  await cache.delByPattern('blogs:related:*');
  await cache.del('blogs:categories');
  await cache.del('blogs:tags');

  return blog;
};

/**
 * Update blog status (publish/unpublish)
 */
const updateBlogStatus = async (id, status) => {
  const blog = await Blog.findById(id);

  if (!blog) {
    return null;
  }

  blog.status = status;

  // Set publishedAt when publishing for the first time
  if (status === 'published' && !blog.publishedAt) {
    blog.publishedAt = new Date();
  }

  await blog.save();

  // Invalidate caches
  await cache.del(cache.generateKey('blogs:detail', blog.slug));
  await cache.delByPattern('blogs:list:*');
  await cache.delByPattern('blogs:related:*');
  await cache.del('blogs:categories');
  await cache.del('blogs:tags');

  return blog;
};

/**
 * Delete a blog post
 */
const deleteBlog = async id => {
  const blog = await Blog.findById(id);

  if (!blog) {
    return null;
  }

  const slug = blog.slug;
  await Blog.deleteOne({ _id: id });

  // Invalidate caches
  await cache.del(cache.generateKey('blogs:detail', slug));
  await cache.delByPattern('blogs:list:*');
  await cache.delByPattern('blogs:related:*');
  await cache.del('blogs:categories');
  await cache.del('blogs:tags');

  return { success: true };
};

/**
 * Get all blogs for admin (including drafts)
 */
const getAllBlogs = async ({ page = 1, limit = 20, status, search, category, tag }) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (category) {
    query.category = category;
  }

  if (tag) {
    // Match tag in tags array
    query.tags = tag;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .select(
        'title slug summary coverImage tags category status publishedAt views createdAt updatedAt'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query),
  ]);

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
};

/**
 * Get single blog by ID for admin
 */
const getBlogById = async id => {
  return Blog.findById(id).lean();
};

module.exports = {
  createBlog,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
  getAllBlogs,
  getBlogById,
};
