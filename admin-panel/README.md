# Admin Panel (CMS)

Blog System Admin Panel built with React, Vite, TipTap, and shadcn/ui.

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- TipTap Editor
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

The admin panel will be available at `http://localhost:3001`

### Build for Production

```bash
npm run build
npm run preview
```

## Features

- ✅ Create blog posts with TipTap editor
- ✅ Edit existing blog posts
- ✅ Save as draft or publish
- ✅ Manage tags and categories
- ✅ SEO fields (meta title, description, keywords)
- ✅ Cover image with URL and alt text
- ✅ Search and filter blogs
- ✅ Publish/unpublish blogs
- ✅ Delete blogs with confirmation

## Editor Features

The TipTap editor supports:

- **Text Formatting**: Bold, italic, strikethrough, inline code
- **Headings**: H1, H2, H3
- **Lists**: Bullet lists, numbered lists
- **Blocks**: Blockquotes, code blocks
- **Media**: Images (via URL)
- **Links**: Add links to text
- **History**: Undo/Redo

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── Layout.jsx    # Main layout
│   ├── BlogForm.jsx  # Blog create/edit form
│   ├── TipTapEditor.jsx
│   └── EditorToolbar.jsx
├── pages/
│   ├── BlogList.jsx   # Blog listing page
│   ├── BlogCreate.jsx # Create new blog
│   └── BlogEdit.jsx   # Edit existing blog
├── services/
│   └── blog.api.js    # API service
├── hooks/
│   └── use-toast.js   # Toast notifications
├── lib/
│   └── utils.js       # Utility functions
├── App.jsx
├── main.jsx
└── index.css
```

## Environment Variables

Create a `.env` file if you need to change the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Important Notes

- Content is stored as TipTap JSON - HTML is NEVER generated
- All forms validate required fields before submission
- Toast notifications for success/error feedback
- Skeleton loading states for better UX
