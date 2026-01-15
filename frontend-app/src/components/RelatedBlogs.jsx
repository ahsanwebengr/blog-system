import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

export default function RelatedBlogs({ blogs, loading }) {
  if (loading) {
    return (
      <section className='mt-12 border-t pt-8'>
        <h2 className='text-2xl font-bold mb-6'>Related Posts</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className='p-4'>
                <Skeleton className='h-4 w-20 mb-2' />
                <Skeleton className='h-6 w-full mb-2' />
                <Skeleton className='h-4 w-3/4' />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className='mt-12 border-t pt-8'>
      <h2 className='text-2xl font-bold mb-6'>Related Posts</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {blogs.map(blog => (
          <Card key={blog.id || blog._id} className='hover:shadow-md transition-shadow'>
            <Link to={`/blog/${blog.slug}`}>
              <CardContent className='p-4'>
                <span className='text-xs text-muted-foreground'>{blog.category}</span>
                <h3 className='font-semibold mt-1 line-clamp-2 hover:text-primary transition-colors'>
                  {blog.title}
                </h3>
                <p className='text-sm text-muted-foreground mt-2 line-clamp-2'>
                  {blog.summary}
                </p>
                <div className='text-xs text-muted-foreground mt-3'>
                  {formatDate(blog.publishedAt)}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
