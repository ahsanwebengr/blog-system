import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateReadTime(content) {
  if (!content?.content) return '1 min read';

  // Count words in TipTap JSON
  const countWords = nodes => {
    let count = 0;
    nodes.forEach(node => {
      if (node.text) {
        count += node.text.split(/\s+/).filter(Boolean).length;
      }
      if (node.content) {
        count += countWords(node.content);
      }
    });
    return count;
  };

  const wordCount = countWords(content.content);
  const readTime = Math.ceil(wordCount / 200); // Average reading speed
  return `${readTime || 1} min read`;
}
