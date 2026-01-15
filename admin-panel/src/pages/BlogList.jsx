import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '@/services/blog.api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PlusCircle, Search, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    status: '',
    search: '',
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const { toast } = useToast();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: 10,
      };
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.tag) params.tag = filters.tag;
      if (filters.search) params.search = filters.search;

      const data = await blogApi.getAll(params);
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch blogs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [filters.page, filters.status]);

  // Fetch categories and tags for filters
  useEffect(() => {
    const loadFacets = async () => {
      try {
        const catRes = await blogApi.getCategories();
        setCategories(catRes.categories || []);
        const tagRes = await blogApi.getTags();
        setTags(tagRes.tags || []);
      } catch (err) {
        // ignore facets errors for now
      }
    };
    loadFacets();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchBlogs();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await blogApi.updateStatus(id, newStatus);
      toast({
        title: 'Success',
        description: `Blog ${
          newStatus === 'published' ? 'published' : 'unpublished'
        } successfully`,
      });
      fetchBlogs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async id => {
    try {
      await blogApi.delete(id);
      toast({
        title: 'Success',
        description: 'Blog deleted successfully',
      });
      fetchBlogs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog',
        variant: 'destructive',
      });
    }
  };

  const formatDate = date => {
    if (!date) return 'Not published';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Blogs</h1>
          <p className='text-muted-foreground'>Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link to='/blogs/create'>
            <PlusCircle className='mr-2 h-4 w-4' />
            Create Blog
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <form
            onSubmit={handleSearch}
            className='flex flex-col md:flex-row gap-4 w-full items-center'
          >
            <div className='flex-1 relative w-full'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search title or summary'
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className='pl-9 w-full'
              />
            </div>
            <div className='flex gap-2 flex-wrap w-full md:w-auto'>
              <Select
                value={filters.status === '' ? 'all' : filters.status}
                onValueChange={value =>
                  setFilters(prev => ({
                    ...prev,
                    status: value === 'all' ? '' : value,
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className='w-full md:w-[160px]'>
                  <SelectValue placeholder='All Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='published'>Published</SelectItem>
                  <SelectItem value='draft'>Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.category || 'all'}
                onValueChange={value =>
                  setFilters(prev => ({
                    ...prev,
                    category: value === 'all' ? '' : value,
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className='w-full md:w-[160px]'>
                  <SelectValue placeholder='All Categories' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.category} value={cat.category}>
                      {cat.category} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.tag || 'all'}
                onValueChange={value =>
                  setFilters(prev => ({
                    ...prev,
                    tag: value === 'all' ? '' : value,
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className='w-full md:w-[160px]'>
                  <SelectValue placeholder='All Tags' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Tags</SelectItem>
                  {tags.map(t => (
                    <SelectItem key={t.tag} value={t.tag}>
                      {t.tag} ({t.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type='submit' className='whitespace-nowrap'>
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Blog List */}
      <div className='space-y-4'>
        {loading ? (
          // Skeleton Loading
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='flex gap-4'>
                  <Skeleton className='h-24 w-40 rounded-md' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-1/2' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : blogs.length === 0 ? (
          <Card>
            <CardContent className='p-6 text-center'>
              <p className='text-muted-foreground'>No blogs found</p>
              <Button asChild className='mt-4'>
                <Link to='/blogs/create'>Create your first blog</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          blogs.map(blog => (
            <Card key={blog.id || blog._id}>
              <CardContent className='p-6'>
                <div className='flex flex-col md:flex-row gap-4'>
                  {/* Cover Image */}
                  {blog.coverImage?.url ? (
                    <img
                      src={blog.coverImage.url}
                      alt={blog.coverImage.alt || blog.title}
                      className='w-full h-48 md:h-24 md:w-40 object-cover rounded-md'
                    />
                  ) : (
                    <div className='w-full h-48 md:h-24 md:w-40 bg-muted rounded-md flex items-center justify-center'>
                      <span className='text-muted-foreground text-sm'>No Image</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <h3 className='font-semibold text-lg line-clamp-2'>
                          {blog.title}
                        </h3>
                        <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>
                          {blog.summary}
                        </p>
                      </div>
                      <Badge
                        className='capitalize'
                        variant={blog.status === 'published' ? 'success' : 'secondary'}
                      >
                        {blog.status}
                      </Badge>
                    </div>

                    <div className='flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground'>
                      <span>{blog.category}</span>
                      <span>•</span>
                      <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                      <span>•</span>
                      <span className='flex items-center gap-1'>
                        <Eye className='h-3 w-3' />
                        {blog.views || 0} views
                      </span>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-2 mt-3'>
                      <Button variant='outline' size='sm' asChild>
                        <Link to={`/blogs/edit/${blog.id || blog._id}`}>
                          <Edit className='mr-1 h-3 w-3' />
                          Edit
                        </Link>
                      </Button>
                      {blog.status === 'draft' ? (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handleStatusChange(blog.id || blog._id, 'published')
                          }
                        >
                          Publish
                        </Button>
                      ) : (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleStatusChange(blog.id || blog._id, 'draft')}
                        >
                          Unpublish
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='destructive' size='sm'>
                            <Trash2 className='mr-1 h-3 w-3' />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{blog.title}"? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(blog.id || blog._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          <Button
            variant='outline'
            disabled={filters.page <= 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span className='text-sm text-muted-foreground'>
            Page {filters.page} of {pagination.totalPages}
          </span>
          <Button
            variant='outline'
            disabled={filters.page >= pagination.totalPages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
