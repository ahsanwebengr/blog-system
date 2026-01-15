import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';
import { useEffect } from 'react';

export default function TipTapEditor({
  content,
  onChange,
  placeholder = 'Start writing your blog post...',
}) {
  const normalizedContent = (() => {
    if (!content) return undefined;
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch (e) {
        return content;
      }
    }
    return content;
  })();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md my-4',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-muted p-4 rounded-md',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: normalizedContent || undefined,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange && onChange(json);
    },
    editorProps: {
      attributes: {
        class:
          'tiptap-editor prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (normalizedContent) {
      try {
        editor.commands.setContent(normalizedContent, false);
      } catch (e) {
        console.error('Failed to set editor content', e);
      }
    }
  }, [editor, normalizedContent]);

  return (
    <div className='border rounded-md'>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
