import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogApi } from '@/services/blog.api';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import BlogForm from '@/components/BlogForm';

export default function BlogEdit() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogApi.getById(id);
        setBlog(data.blog);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch blog',
          variant: 'destructive',
        });
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async formData => {
    // Validate required fields
    if (!formData.title || !formData.summary || !formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.content || !formData.content.content?.length) {
      toast({
        title: 'Validation Error',
        description: 'Please add some content to your blog',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await blogApi.update(id, formData);
      toast({
        title: 'Success',
        description: `Blog ${
          formData.status === 'published' ? 'published' : 'saved as draft'
        } successfully`,
      });
      navigate('/blogs');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update blog',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto space-y-6'>
        <div>
          <Skeleton className='h-10 w-48 mb-2' />
          <Skeleton className='h-5 w-72' />
        </div>
        <Skeleton className='h-[600px] w-full' />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className='max-w-4xl mx-auto text-center py-12'>
        <p className='text-muted-foreground'>Blog not found</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Edit Blog</h1>
        <p className='text-muted-foreground'>Update your blog post</p>
      </div>

      <BlogForm initialData={blog} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
