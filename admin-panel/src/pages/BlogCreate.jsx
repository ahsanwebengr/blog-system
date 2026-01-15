import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '@/services/blog.api';
import { useToast } from '@/hooks/use-toast';
import BlogForm from '@/components/BlogForm';

export default function BlogCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      setIsLoading(true);
      await blogApi.create(formData);
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
        description: error.response?.data?.error || 'Failed to create blog',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Create New Blog</h1>
        <p className='text-muted-foreground'>Write and publish your new blog post</p>
      </div>

      <BlogForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
