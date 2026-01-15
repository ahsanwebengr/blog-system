/**
 * TipTap JSON Content Renderer
 *
 * Renders TipTap JSON content to React components.
 * NO HTML storage, NO dangerouslySetInnerHTML
 * Full CSS control via Tailwind classes
 */

const renderNode = (node, index, headingIds = { list: [], i: 0 }) => {
  if (!node) return null;

  switch (node.type) {
    case 'doc':
      return (
        <div key={index} className='blog-content'>
          {node.content?.map((child, i) => renderNode(child, i))}
        </div>
      );

    case 'paragraph':
      if (!node.content || node.content.length === 0) {
        return (
          <p key={index} className='mb-4'>
            &nbsp;
          </p>
        );
      }
      return (
        <p key={index} className='mb-4'>
          {node.content?.map((child, i) => renderNode(child, i))}
        </p>
      );

    case 'heading':
      const HeadingTag = `h${node.attrs?.level || 2}`;
      const headingClasses = {
        1: 'text-3xl font-bold mt-8 mb-4',
        2: 'text-2xl font-bold mt-6 mb-3',
        3: 'text-xl font-semibold mt-5 mb-2',
        4: 'text-lg font-semibold mt-4 mb-2',
        5: 'text-base font-semibold mt-3 mb-2',
        6: 'text-sm font-semibold mt-3 mb-2',
      };

      // assign id from headingIds list if provided
      let id = undefined;
      if (
        headingIds &&
        Array.isArray(headingIds.list) &&
        headingIds.i < headingIds.list.length
      ) {
        id = headingIds.list[headingIds.i].id;
        headingIds.i += 1;
      }

      return (
        <HeadingTag
          key={index}
          id={id}
          className={headingClasses[node.attrs?.level || 2]}
        >
          {node.content?.map((child, i) => renderNode(child, i, headingIds))}
        </HeadingTag>
      );

    case 'bulletList':
      return (
        <ul key={index} className='list-disc list-inside mb-4 space-y-1'>
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={index} className='list-decimal list-inside mb-4 space-y-1'>
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      );

    case 'listItem':
      return (
        <li key={index} className='pl-2'>
          {node.content?.map((child, i) => {
            // For list items, render paragraph content inline
            if (child.type === 'paragraph') {
              return child.content?.map((c, j) => renderNode(c, j));
            }
            return renderNode(child, i);
          })}
        </li>
      );

    case 'blockquote':
      return (
        <blockquote
          key={index}
          className='border-l-4 border-primary pl-4 italic my-4 text-muted-foreground'
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    case 'codeBlock':
      return (
        <pre
          key={index}
          className='bg-muted p-4 rounded-lg mb-4 overflow-x-auto text-sm font-mono'
        >
          <code>{node.content?.map((child, i) => renderNode(child, i))}</code>
        </pre>
      );

    case 'horizontalRule':
      return <hr key={index} className='my-8 border-border' />;

    case 'hardBreak':
      return <br key={index} />;

    case 'image':
      return (
        <figure key={index} className='my-6'>
          <img
            src={node.attrs?.src}
            alt={node.attrs?.alt || ''}
            title={node.attrs?.title || ''}
            className='max-w-full h-auto rounded-lg'
          />
          {node.attrs?.title && (
            <figcaption className='text-center text-sm text-muted-foreground mt-2'>
              {node.attrs.title}
            </figcaption>
          )}
        </figure>
      );

    case 'text':
      let textContent = node.text;

      // Apply marks (bold, italic, code, link, etc.)
      if (node.marks) {
        node.marks.forEach(mark => {
          switch (mark.type) {
            case 'bold':
              textContent = <strong key='bold'>{textContent}</strong>;
              break;
            case 'italic':
              textContent = <em key='italic'>{textContent}</em>;
              break;
            case 'strike':
              textContent = <s key='strike'>{textContent}</s>;
              break;
            case 'code':
              textContent = (
                <code
                  key='code'
                  className='bg-muted px-1.5 py-0.5 rounded text-sm font-mono'
                >
                  {textContent}
                </code>
              );
              break;
            case 'link':
              textContent = (
                <a
                  key='link'
                  href={mark.attrs?.href}
                  target={mark.attrs?.target || '_blank'}
                  rel='noopener noreferrer'
                  className='text-primary underline hover:no-underline'
                >
                  {textContent}
                </a>
              );
              break;
            default:
              break;
          }
        });
      }

      return <span key={index}>{textContent}</span>;

    default:
      // For unknown node types, try to render content if available
      if (node.content) {
        return (
          <div key={index}>{node.content.map((child, i) => renderNode(child, i))}</div>
        );
      }
      return null;
  }
};

export default function ContentRenderer({ content, headings = [] }) {
  if (!content) {
    return null;
  }

  const headingIds = { list: headings || [], i: 0 };
  return renderNode(content, 0, headingIds);
}
