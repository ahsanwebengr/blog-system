# Frontend App (Public Blog)

Blog System Frontend built with React, Vite, TipTap Renderer, and shadcn/ui.

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- react-helmet-async (SEO)
- Axios

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Features

- ✅ Blog listing with cursor-based pagination
- ✅ Blog detail page with full content
- ✅ Related blogs section
- ✅ SEO-optimized with react-helmet
- ✅ Open Graph meta tags
- ✅ Responsive design
- ✅ Skeleton loading states
- ✅ Reading time estimation
- ✅ View counter

## Content Rendering

Blog content is rendered from TipTap JSON using a custom `ContentRenderer` component:

- ❌ No `dangerouslySetInnerHTML`
- ❌ No raw HTML
- ✅ Full CSS control with Tailwind
- ✅ Safe and secure rendering
- ✅ Supports all TipTap node types

## Reading UX

Following best practices for readability:

- Max content width: 720px
- Line height: 1.7
- Font size: 18px
- Responsive on all devices

## Project Structure

```
src/
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── Layout.jsx        # Main layout with header/footer
│   ├── BlogCard.jsx      # Blog preview card
│   ├── RelatedBlogs.jsx  # Related posts section
│   └── ContentRenderer.jsx  # TipTap JSON renderer
├── pages/
│   ├── BlogList.jsx      # Home/listing page
│   └── BlogDetail.jsx    # Single blog page
├── services/
│   └── blog.api.js       # API service
├── lib/
│   └── utils.js          # Utility functions
├── App.jsx
├── main.jsx
└── index.css
```

## SEO Features

Each blog page includes:

- Dynamic page title
- Meta description
- Keywords meta tag
- Open Graph tags (title, description, image, type)
- Twitter Card tags
- Article published time
- Article section and tags

## Environment Variables

Create a `.env` file if you need to change the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Important Notes

- Content is rendered from TipTap JSON - NO HTML storage
- Slug-based routing for SEO-friendly URLs
- Async view counting (non-blocking)
- Cursor-based pagination for scalability
