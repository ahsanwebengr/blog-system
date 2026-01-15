import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EditorToolbar({ editor }) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const ToolbarButton = ({ onClick, isActive = false, children, title }) => (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      onClick={onClick}
      title={title}
      className={cn('h-8 w-8 p-0', isActive && 'bg-muted')}
    >
      {children}
    </Button>
  );

  return (
    <div className='border-b p-2 flex flex-wrap items-center gap-1'>
      {/* Text Formatting */}
      <div className='flex items-center gap-1 border-r pr-2 mr-2'>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title='Bold'
        >
          <Bold className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title='Italic'
        >
          <Italic className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title='Strikethrough'
        >
          <Strikethrough className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title='Inline Code'
        >
          <Code className='h-4 w-4' />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className='flex items-center gap-1 border-r pr-2 mr-2'>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title='Heading 1'
        >
          <Heading1 className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title='Heading 2'
        >
          <Heading2 className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title='Heading 3'
        >
          <Heading3 className='h-4 w-4' />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className='flex items-center gap-1 border-r pr-2 mr-2'>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title='Bullet List'
        >
          <List className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title='Numbered List'
        >
          <ListOrdered className='h-4 w-4' />
        </ToolbarButton>
      </div>

      {/* Blocks */}
      <div className='flex items-center gap-1 border-r pr-2 mr-2'>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title='Quote'
        >
          <Quote className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title='Code Block'
        >
          <Code2 className='h-4 w-4' />
        </ToolbarButton>
      </div>

      {/* Link */}
      <div className='flex items-center gap-1 border-r pr-2 mr-2'>
        {showLinkInput ? (
          <div className='flex items-center gap-1'>
            <Input
              type='url'
              placeholder='Enter URL...'
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              className='h-8 w-48'
              onKeyDown={e => e.key === 'Enter' && addLink()}
            />
            <Button type='button' size='sm' className='h-8' onClick={addLink}>
              Add
            </Button>
            <Button
              type='button'
              size='sm'
              variant='ghost'
              className='h-8'
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
            >
              ✕
            </Button>
          </div>
        ) : (
          <ToolbarButton
            onClick={() => setShowLinkInput(true)}
            isActive={editor.isActive('link')}
            title='Add Link'
          >
            <LinkIcon className='h-4 w-4' />
          </ToolbarButton>
        )}
      </div>

      {/* Image */}
      <div className='flex items-center gap-1 border-r pr-2 mr-2'>
        {showImageInput ? (
          <div className='flex items-center gap-1'>
            <Input
              type='url'
              placeholder='Enter image URL...'
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className='h-8 w-48'
              onKeyDown={e => e.key === 'Enter' && addImage()}
            />
            <Button type='button' size='sm' className='h-8' onClick={addImage}>
              Add
            </Button>
            <Button
              type='button'
              size='sm'
              variant='ghost'
              className='h-8'
              onClick={() => {
                setShowImageInput(false);
                setImageUrl('');
              }}
            >
              ✕
            </Button>
          </div>
        ) : (
          <ToolbarButton onClick={() => setShowImageInput(true)} title='Add Image'>
            <ImageIcon className='h-4 w-4' />
          </ToolbarButton>
        )}
      </div>

      {/* Undo/Redo */}
      <div className='flex items-center gap-1'>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title='Undo'>
          <Undo className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title='Redo'>
          <Redo className='h-4 w-4' />
        </ToolbarButton>
      </div>
    </div>
  );
}
