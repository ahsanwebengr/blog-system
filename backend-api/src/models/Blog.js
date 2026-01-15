const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    content: {
      type: Object, // TipTap JSON ONLY - Never store HTML
      required: [true, 'Content is required'],
    },
    coverImage: {
      url: {
        type: String,
        default: '',
      },
      alt: {
        type: String,
        default: '',
      },
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    seo: {
      metaTitle: {
        type: String,
        maxlength: [70, 'Meta title cannot exceed 70 characters'],
        default: '',
      },
      metaDescription: {
        type: String,
        maxlength: [160, 'Meta description cannot exceed 160 characters'],
        default: '',
      },
      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for performance
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1, status: 1, publishedAt: -1 });

// Generate slug before saving
blogSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;

    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Transform output
blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
