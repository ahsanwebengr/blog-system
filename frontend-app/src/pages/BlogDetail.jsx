import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogApi } from '@/services/blog.api';
import { formatDate, calculateReadTime } from '@/lib/utils';
import ContentRenderer from '@/components/ContentRenderer';
import RelatedBlogs from '@/components/RelatedBlogs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock, Eye, Calendar } from 'lucide-react';
import { extractHeadings } from '@/lib/toc';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogApi.getBySlug(slug);
        setBlog(data.blog);
        // extract headings for TOC
        const hs = extractHeadings(data.blog.content);
        setHeadings(hs);
        // Increment view once per browser using localStorage
        try {
          const key = 'viewed_blogs_v1';
          const stored = localStorage.getItem(key);
          const viewed = stored ? JSON.parse(stored) : [];
          if (!viewed.includes(slug)) {
            // fire-and-forget
            blogApi.incrementView(slug).catch(() => {});
            viewed.push(slug);
            try {
              localStorage.setItem(key, JSON.stringify(viewed));
            } catch (e) {
              // ignore storage errors
            }
          }
        } catch (err) {
          // ignore
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Blog post not found.');
        } else {
          setError('Failed to load blog post. Please try again later.');
        }
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        setLoadingRelated(true);
        const data = await blogApi.getRelated(slug, 4);
        setRelatedBlogs(data.blogs);
      } catch (err) {
        console.error('Error fetching related blogs:', err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchBlog();
    fetchRelated();
  }, [slug]);

  const [headings, setHeadings] = useState([]);

  // Loading skeleton
  if (loading) {
    return (
      <article className='max-w-[720px] mx-auto'>
        <Skeleton className='h-8 w-32 mb-6' />
        <Skeleton className='h-12 w-full mb-4' />
        <Skeleton className='h-12 w-3/4 mb-6' />
        <div className='flex gap-4 mb-8'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-5 w-24' />
        </div>
        <Skeleton className='aspect-video w-full mb-8 rounded-lg' />
        <div className='space-y-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>
      </article>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='max-w-[720px] mx-auto text-center py-12'>
        <h1 className='text-2xl font-bold mb-4'>Oops!</h1>
        <p className='text-muted-foreground mb-6'>{error}</p>
        <Button asChild>
          <Link to='/'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const seoTitle = blog.seo?.metaTitle || blog.title;
  const seoDescription = blog.seo?.metaDescription || blog.summary;
  const seoKeywords = blog.seo?.keywords?.join(', ') || blog.tags?.join(', ');

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{seoTitle}</title>
        <meta name='description' content={seoDescription} />
        {seoKeywords && <meta name='keywords' content={seoKeywords} />}

        {/* Open Graph */}
        <meta property='og:title' content={seoTitle} />
        <meta property='og:description' content={seoDescription} />
        <meta property='og:type' content='article' />
        {blog.coverImage?.url && (
          <meta property='og:image' content={blog.coverImage.url} />
        )}

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={seoTitle} />
        <meta name='twitter:description' content={seoDescription} />
        {blog.coverImage?.url && (
          <meta name='twitter:image' content={blog.coverImage.url} />
        )}

        {/* Article Meta */}
        <meta property='article:published_time' content={blog.publishedAt} />
        <meta property='article:section' content={blog.category} />
        {blog.tags?.map((tag, i) => (
          <meta key={i} property='article:tag' content={tag} />
        ))}
      </Helmet>

      <div id='article' className='w-full'>
        {/* Hero Section with Cover Image */}
        <div className='relative max-w-[1020px] mx-auto bg-muted overflow-hidden rounded-2xl'>
          {/* Background Image */}
          {blog.coverImage?.url ? (
            <img
              src={blog.coverImage.url}
              alt={blog.coverImage.alt || blog.title}
              className='w-full h-[500px] object-cover'
            />
          ) : (
            <div className='w-full h-[500px] bg-gradient-to-br from-muted to-muted-foreground' />
          )}

          {/* Overlay */}
          <div className='absolute inset-0 bg-black/30' />

          {/* Top Navigation */}
          <div className='absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10'>
            <Button
              variant='ghost'
              size='sm'
              asChild
              className='bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm'
            >
              <Link to='/'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Blog
              </Link>
            </Button>
            <div className='hidden sm:block'>
              <Button
                variant='ghost'
                size='sm'
                className='bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm'
                onClick={() => {
                  // Prefer Web Share API when available (mobile/modern browsers)
                  const shareData = {
                    title: blog.title,
                    text: blog.title,
                    url: window.location.href,
                  };

                  if (navigator.share) {
                    navigator.share(shareData).catch(() => {});
                    return;
                  }

                  // Fallback to WhatsApp share link
                  const text = encodeURIComponent(blog.title);
                  const url = encodeURIComponent(window.location.href);
                  const wa = `https://wa.me/?text=${text}%20${url}`;
                  window.open(wa, '_blank', 'noopener');
                }}
              >
                Share
              </Button>
            </div>
          </div>

          {/* Category Badge - Positioned on Image */}
          <div className='absolute bottom-8 left-6 z-20'>
            <Badge
              variant='default'
              className='bg-primary/90 hover:bg-primary text-white capitalize'
            >
              {blog.category}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className='max-w-[1020px] mx-auto px-6 md:px-8 py-12'>
          {/* Main Content */}
          <article>
            {/* Title & Summary */}
            <header className='mb-10'>
              <h1 className='text-5xl md:text-6xl font-extrabold leading-tight mb-6'>
                {blog.title}
              </h1>

              <p className='text-lg md:text-xl text-muted-foreground leading-relaxed mb-8'>
                {blog.summary}
              </p>

              {/* Meta Info */}
              <div className='flex flex-wrap items-center gap-6 text-sm text-muted-foreground'>
                <span className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  {formatDate(blog.publishedAt)}
                </span>
                <span className='flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  {calculateReadTime(blog.content)} min read
                </span>
                {blog.views > 0 && (
                  <span className='flex items-center gap-2'>
                    <Eye className='h-4 w-4' />
                    {blog.views.toLocaleString()} views
                  </span>
                )}
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-6'>
                  {blog.tags.map(tag => (
                    <span
                      key={tag}
                      className='text-xs px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full font-medium'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className='blog-content prose dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-base prose-p:leading-relaxed prose-p:mb-6 prose-img:rounded-lg prose-img:shadow-lg'>
              <ContentRenderer content={blog.content} headings={headings} />
            </div>

            {/* Related Posts */}
            <div className='mt-16 pt-12 border-t border-border'>
              <RelatedBlogs blogs={relatedBlogs} loading={loadingRelated} />
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
