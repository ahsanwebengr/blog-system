import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TipTapEditor from './TipTapEditor';
import { X } from 'lucide-react';

const CATEGORIES = [
  'Technology',
  'Programming',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'Design',
  'Business',
  'Lifestyle',
  'Tutorial',
  'News',
];

export default function BlogForm({ initialData = {}, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    summary: initialData.summary || '',
    content: initialData.content || null,
    category: initialData.category || '',
    tags: initialData.tags || [],
    coverImage: initialData.coverImage || { url: '', alt: '' },
    seo: initialData.seo || {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    status: initialData.status || 'draft',
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = tagToRemove => {
    handleChange(
      'tags',
      formData.tags.filter(tag => tag !== tagToRemove)
    );
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seo.keywords.includes(keywordInput.trim())) {
      handleNestedChange('seo', 'keywords', [
        ...formData.seo.keywords,
        keywordInput.trim(),
      ]);
      setKeywordInput('');
    }
  };

  const removeKeyword = keywordToRemove => {
    handleNestedChange(
      'seo',
      'keywords',
      formData.seo.keywords.filter(kw => kw !== keywordToRemove)
    );
  };

  const handleSubmit = (e, status) => {
    e.preventDefault();
    onSubmit({ ...formData, status });
  };

  return (
    <form className='space-y-6'>
      <Tabs defaultValue='content' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='content'>Content</TabsTrigger>
          <TabsTrigger value='media'>Media & Tags</TabsTrigger>
          <TabsTrigger value='seo'>SEO</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value='content' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Title *</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder='Enter blog title...'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='summary'>Summary *</Label>
                <Textarea
                  id='summary'
                  value={formData.summary}
                  onChange={e => handleChange('summary', e.target.value)}
                  placeholder='Brief description of your blog post...'
                  rows={3}
                  maxLength={500}
                  required
                />
                <p className='text-xs text-muted-foreground'>
                  {formData.summary.length}/500 characters
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Content *</Label>
                <TipTapEditor
                  content={formData.content}
                  onChange={json => handleChange('content', json)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media & Tags Tab */}
        <TabsContent value='media' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='coverUrl'>Image URL</Label>
                <Input
                  id='coverUrl'
                  type='url'
                  value={formData.coverImage.url}
                  onChange={e => handleNestedChange('coverImage', 'url', e.target.value)}
                  placeholder='https://example.com/image.jpg'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='coverAlt'>Alt Text</Label>
                <Input
                  id='coverAlt'
                  value={formData.coverImage.alt}
                  onChange={e => handleNestedChange('coverImage', 'alt', e.target.value)}
                  placeholder='Describe the image...'
                />
              </div>
              {formData.coverImage.url && (
                <div className='mt-4'>
                  <img
                    src={formData.coverImage.url}
                    alt={formData.coverImage.alt || 'Cover preview'}
                    className='max-w-md rounded-md border'
                    onError={e => (e.target.style.display = 'none')}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-2'>
                <Input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  placeholder='Add a tag...'
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type='button' onClick={addTag}>
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm'
                    >
                      {tag}
                      <button
                        type='button'
                        onClick={() => removeTag(tag)}
                        className='hover:text-destructive'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value='seo' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='metaTitle'>Meta Title</Label>
                <Input
                  id='metaTitle'
                  value={formData.seo.metaTitle}
                  onChange={e => handleNestedChange('seo', 'metaTitle', e.target.value)}
                  placeholder='SEO optimized title...'
                  maxLength={70}
                />
                <p className='text-xs text-muted-foreground'>
                  {formData.seo.metaTitle.length}/70 characters
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='metaDescription'>Meta Description</Label>
                <Textarea
                  id='metaDescription'
                  value={formData.seo.metaDescription}
                  onChange={e =>
                    handleNestedChange('seo', 'metaDescription', e.target.value)
                  }
                  placeholder='Brief description for search engines...'
                  rows={3}
                  maxLength={160}
                />
                <p className='text-xs text-muted-foreground'>
                  {formData.seo.metaDescription.length}/160 characters
                </p>
              </div>

              <div className='space-y-2'>
                <Label>Keywords</Label>
                <div className='flex gap-2'>
                  <Input
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    placeholder='Add a keyword...'
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                  />
                  <Button type='button' onClick={addKeyword}>
                    Add
                  </Button>
                </div>
                {formData.seo.keywords.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {formData.seo.keywords.map(keyword => (
                      <span
                        key={keyword}
                        className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm'
                      >
                        {keyword}
                        <button
                          type='button'
                          onClick={() => removeKeyword(keyword)}
                          className='hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className='flex justify-end gap-4 pt-4 border-t'>
        <Button
          type='button'
          variant='outline'
          onClick={e => handleSubmit(e, 'draft')}
          disabled={isLoading}
        >
          Save as Draft
        </Button>
        <Button
          type='button'
          onClick={e => handleSubmit(e, 'published')}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Publish'}
        </Button>
      </div>
    </form>
  );
}
