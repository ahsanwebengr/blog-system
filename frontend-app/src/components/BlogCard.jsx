import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, calculateReadTime } from '@/lib/utils';
import { Clock, Eye } from 'lucide-react';

export default function BlogCard({ blog }) {
  return (
    <Card className='overflow-hidden group hover:shadow-2xl transition-shadow duration-300'>
      <Link to={`/blog/${blog.slug}`} className='block'>
        <div className='relative overflow-hidden rounded-t-lg'>
          {blog.coverImage?.url ? (
            <img
              src={blog.coverImage.url}
              alt={blog.coverImage.alt || blog.title}
              className='w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500'
            />
          ) : (
            <div className='h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center'>
              <span className='text-muted-foreground'>No Image</span>
            </div>
          )}

          <div className='absolute left-4 top-4'>
            <Badge variant='secondary'>{blog.category}</Badge>
          </div>
        </div>

        <CardContent className='p-5'>
          <div className="mb-2 space-x-1">
              {blog.tags?.slice(0, 2).map(tag => (
                <span key={tag} className='text-xs px-2 py-0.5 bg-muted rounded-full'>
                  #{tag}
                </span>
              ))}
          </div>
          <h2 className='text-lg md:text-xl font-semibold mb-2 line-clamp-2'>
            {blog.title}
          </h2>

          <p className='text-sm text-muted-foreground line-clamp-3 mb-4'>
            {blog.summary}
          </p>

          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <div className='flex items-center gap-3'>
              <span>{formatDate(blog.publishedAt)}</span>
              <span className='flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                {calculateReadTime(blog.content)}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              {blog.views > 0 && (
                <span className='flex items-center gap-1'>
                  <Eye className='h-3 w-3' />
                  {blog.views}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
