# 📘 COMPLETE BLOG SYSTEM — MASTER README

## 🧠 Project Overview

This project is a **complete, scalable blog system** consisting of **three separate repositories**:

1. **Backend API**
2. **Admin Panel (CMS)**
3. **Public Frontend (Reader App)**

The system is designed for **high read traffic**, **SEO**, and **clean architecture**, with **future scalability in mind**.

---

## 🚀 Quick Start

### 1. Backend API

```bash
cd backend-api
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

Backend runs at: `http://localhost:5000`

### 2. Admin Panel

```bash
cd admin-panel
npm install
npm run dev
```

Admin Panel runs at: `http://localhost:3001`

### 3. Frontend App

```bash
cd frontend-app
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 📦 Repositories Structure (MANDATORY)

```
blog-system/
 ├─ backend-api/
 ├─ admin-panel/
 └─ frontend-app/
```

⚠️ Each repo is **independent**
⚠️ No shared codebase
⚠️ Communicate via APIs only

---

## 🚫 Global Hard Constraints (DO NOT BREAK)

These rules apply to **ALL repositories**:

- ❌ No Next.js
- ❌ No server-side rendering
- ❌ No user authentication (public users)
- ❌ No likes, comments, or reactions
- ❌ No react-quill
- ❌ No raw HTML storage
- ❌ No `dangerouslySetInnerHTML`
- ❌ Redis must NOT be mandatory (future optional)

---

## ✍️ Content Strategy (VERY IMPORTANT)

- Blog content is written using **TipTap editor**
- Content is stored as **TipTap JSON**
- HTML is **never stored in DB**
- Rendering is always done from JSON

✅ Full control
✅ Secure
✅ Style-safe
✅ Future-proof

---

# 🧩 BACKEND API — REQUIREMENTS

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- REST APIs
- TipTap JSON
- Cache abstraction layer (Redis later)

---

## 🗄️ Blog Data Model (FIXED)

```js
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
    metaTitle,
    metaDescription,
    keywords
  },

  createdAt,
  updatedAt
}
```

❌ Never store HTML
✅ Always store JSON

---

## 🔗 API Endpoints

### Public APIs (Read Only)

```
GET /blogs
GET /blogs/:slug
GET /blogs/:slug/related
```

### Admin APIs

```
POST   /admin/blog
PUT    /admin/blog/:id
PATCH  /admin/blog/:id/status
DELETE /admin/blog/:id
```

---

## 🔁 Related Blogs Logic

Related blogs must:

- Exclude current blog
- Be `published` only
- Match same **category OR tags**
- Sorted by `publishedAt DESC`
- Limit: 3–5 items

---

## ⚡ Caching Strategy (IMPORTANT)

### Current Phase

- ❌ Redis NOT used
- ❌ No paid cache services

### Required Design

Backend must implement **cache abstraction**:

```js
cache.get(key);
cache.set(key, value, ttl);
cache.del(key);
```

👉 For now, cache returns `null`
👉 Redis will be plugged in later **without refactor**

---

## 📈 Performance Rules

- MongoDB indexes on slug, category, tags, publishedAt
- Cursor-based pagination
- `.lean()` for read queries
- Async view counter
- No blocking logic

---

# 🧩 ADMIN PANEL (CMS) — REQUIREMENTS

## 🛠 Tech Stack

- React JS (CSR)
- React Router
- Tailwind CSS
- TipTap Editor
- Axios / Fetch

---

## ✍️ Editor Rules

- Use **TipTap**
- Store **JSON output only**
- No HTML generation
- Support:

  - Headings
  - Ordered / unordered lists
  - Code blocks
  - Images
  - Links

---

## 🧠 Admin Features

- Create blog
- Edit blog
- Save as draft
- Publish / unpublish
- Add tags & category
- SEO fields
- Cover image URL

---

## 📁 Suggested Admin Structure

```
src/
 ├─ pages/
 │   ├─ BlogList.jsx
 │   ├─ BlogCreate.jsx
 │   └─ BlogEdit.jsx
 ├─ components/
 │   ├─ TipTapEditor.jsx
 │   ├─ BlogForm.jsx
 │   └─ EditorToolbar.jsx
 └─ services/
     └─ blog.api.js
```

---

# 🧩 FRONTEND (PUBLIC BLOG) — REQUIREMENTS

## 🛠 Tech Stack

- React JS (CSR)
- React Router
- Tailwind CSS
- react-helmet
- Axios / Fetch

---

## 📄 Pages

- Blog Listing Page
- Blog Detail Page
- Related Blogs Section

---

## 📘 Rendering Rules

- Render blog from **TipTap JSON**
- Use TipTap renderer
- ❌ No `dangerouslySetInnerHTML`
- Full CSS control

---

## 🎨 Reading UX Rules

- Max width: 700–720px
- Line height: 1.7
- Font size: ~18px
- Responsive
- Skeleton loaders
- Hide empty sections

---

## 🔍 SEO Rules

- Slug-based routing
- Meta tags via react-helmet
- Use SEO fields from DB
- Open Graph support

---

## 📁 Suggested Frontend Structure

```
src/
 ├─ pages/
 │   ├─ BlogList.jsx
 │   └─ BlogDetail.jsx
 ├─ components/
 │   ├─ BlogCard.jsx
 │   ├─ RelatedBlogs.jsx
 │   └─ Skeleton.jsx
 └─ services/
     └─ blog.api.js
```

---

## ✅ FINAL SUCCESS CRITERIA

- Clean architecture
- No HTML storage
- TipTap JSON end-to-end
- No Redis dependency initially
- Redis-ready for future scale
- SEO friendly
- High read performance

---

## 🚀 IMPORTANT COPILOT INSTRUCTION

When generating code with Copilot or AI:

- Use THIS README as **single source of truth**
- Do NOT assume missing features
- Follow constraints strictly
- Prefer clean, production-ready patterns
