import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { blogApi } from '@/services/blog.api';
import BlogCard from '@/components/BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    hasMore: false,
    nextCursor: null,
  });
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const fetchBlogs = useCallback(
    async (cursor = null) => {
      try {
        if (cursor) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          // reset list when loading first page (new filter/search)
          setBlogs([]);
          setPagination({ hasMore: false, nextCursor: null });
        }

        const params = {
          cursor,
          limit: 9,
        };

        if (selectedCategory) params.category = selectedCategory;
        if (debouncedSearch) params.search = debouncedSearch;

        const data = await blogApi.getAll(params);

        if (cursor) {
          setBlogs(prev => [...prev, ...data.blogs]);
        } else {
          setBlogs(data.blogs);
        }

        setPagination(data.pagination);
      } catch (err) {
        setError('Failed to load blogs. Please try again later.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory, debouncedSearch]
  );

  // Fetch blogs on mount and whenever filters/search change
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Debounce the search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Load categories for the filter
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await blogApi.getCategories();
        if (!mounted) return;
        const list = data.categories || data || [];
        const normalized = (Array.isArray(list) ? list : []).map(item => {
          if (typeof item === 'string') return item;
          return (
            item.name || item.category || item.label || item._id || JSON.stringify(item)
          );
        });
        setCategories(normalized);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleLoadMore = () => {
    if (pagination.nextCursor && !loadingMore) {
      fetchBlogs(pagination.nextCursor);
    }
  };

  // Skeleton loading cards
  const SkeletonCard = () => (
    <Card className='overflow-hidden'>
      <Skeleton className='aspect-video' />
      <CardContent className='p-5'>
        <Skeleton className='h-5 w-20 mb-3' />
        <Skeleton className='h-6 w-full mb-2' />
        <Skeleton className='h-6 w-3/4 mb-4' />
        <Skeleton className='h-4 w-full mb-2' />
        <Skeleton className='h-4 w-2/3' />
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Blog - Latest Posts</title>
        <meta
          name='description'
          content='Read our latest blog posts on technology, programming, and more.'
        />
        <meta property='og:title' content='Blog - Latest Posts' />
        <meta
          property='og:description'
          content='Read our latest blog posts on technology, programming, and more.'
        />
      </Helmet>

      <div className='max-w-6xl mx-auto'>
        {/* Page Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Blog</h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Explore our latest articles, tutorials, and insights on technology,
            programming, and development.
          </p>
        </div>

        {/* Filters */}
        <div className='flex flex-col md:flex-row items-stretch gap-3 mb-8 justify-between'>
          <div className='flex-1'>
            <label className='sr-only'>Search</label>
            <input
              type='search'
              placeholder='Search posts...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring'
            />
          </div>

          <div className='w-full md:w-64'>
            <label className='sr-only'>Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className='w-full px-4 py-2 border rounded-md bg-white'
            >
              <option value=''>All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className='flex-none'>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
              }}
              className='px-4 py-2 border rounded-md bg-gray-50'
            >
              Clear
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className='text-center py-12'>
            <p className='text-destructive mb-4'>{error}</p>
            <Button onClick={() => fetchBlogs()}>Try Again</Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && blogs.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No blog posts found. Check back later!
            </p>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && blogs.length > 0 && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {blogs.map(blog => (
                <BlogCard key={blog.id || blog._id || blog.slug} blog={blog} />
              ))}
            </div>

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className='text-center mt-12'>
                <Button
                  variant='outline'
                  size='lg'
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
