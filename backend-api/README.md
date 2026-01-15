# Backend API

Blog System Backend API built with Node.js, Express, and MongoDB.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- REST APIs
- Cache Abstraction Layer (Redis-ready)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your MongoDB URI
```

### Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-system
NODE_ENV=development
```

### Running

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Public APIs (Read Only)

| Method | Endpoint                   | Description                           |
| ------ | -------------------------- | ------------------------------------- |
| GET    | `/api/blogs`               | Get paginated list of published blogs |
| GET    | `/api/blogs/categories`    | Get all categories with counts        |
| GET    | `/api/blogs/tags`          | Get all tags with counts              |
| GET    | `/api/blogs/:slug`         | Get single blog by slug               |
| GET    | `/api/blogs/:slug/related` | Get related blogs                     |

### Admin APIs

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/api/admin/blog`            | Get all blogs (including drafts) |
| GET    | `/api/admin/blog/:id`        | Get single blog by ID            |
| POST   | `/api/admin/blog`            | Create new blog                  |
| PUT    | `/api/admin/blog/:id`        | Update blog                      |
| PATCH  | `/api/admin/blog/:id/status` | Update blog status               |
| DELETE | `/api/admin/blog/:id`        | Delete blog                      |

## Query Parameters

### GET /api/blogs

- `cursor` - Cursor for pagination (publishedAt date)
- `limit` - Number of results (default: 10)
- `category` - Filter by category
- `tag` - Filter by tag

### GET /api/admin/blog

- `page` - Page number (default: 1)
- `limit` - Number of results (default: 20)
- `status` - Filter by status (draft/published)
- `search` - Search in title and summary

## Blog Data Model

```javascript
{
  title: String,
  slug: String,
  summary: String,
  content: Object, // TipTap JSON ONLY
  coverImage: {
    url: String,
    alt: String
  },
  tags: [String],
  category: String,
  status: 'draft' | 'published',
  publishedAt: Date,
  views: Number,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Cache Strategy

The backend includes a cache abstraction layer that currently returns `null` (no caching). Redis can be plugged in later without any code changes in the services.

To enable Redis caching:

```javascript
// In server.js
const redis = require('redis');
const cache = require('./config/cache');

const redisClient = redis.createClient();
await redisClient.connect();
cache.init(redisClient);
```

## Important Notes

- Content is stored as TipTap JSON - HTML is NEVER stored
- Slug is auto-generated from title
- View count is incremented asynchronously
- All read queries use `.lean()` for performance
