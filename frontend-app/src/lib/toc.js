// Simple slugify (no dependency)
function slugifyText(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function walk(node, cb) {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach(n => walk(n, cb));
    return;
  }
  cb(node);
  if (node.content) walk(node.content, cb);
}

// Extract headings with unique ids from TipTap JSON content
export function extractHeadings(content) {
  const headings = [];
  const counts = {};

  walk(content, node => {
    if (node.type === 'heading') {
      // extract plain text from node.content
      let text = '';
      if (node.content) {
        text = node.content
          .map(c => (c.type === 'text' ? c.text : ''))
          .join('')
          .trim();
      }
      if (!text) return;
      const base = slugifyText(text);
      counts[base] = (counts[base] || 0) + 1;
      const id = counts[base] > 1 ? `${base}-${counts[base]}` : base;
      headings.push({ id, level: node.attrs?.level || 2, text });
    }
  });

  return headings;
}

export default slugifyText;
