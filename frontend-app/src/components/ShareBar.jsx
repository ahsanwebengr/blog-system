import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Twitter, Link as LinkIcon } from 'lucide-react';

export default function ShareBar({ title, url }) {
  const [copied, setCopied] = useState(false);

  const shareTwitter = () => {
    const text = encodeURIComponent(title);
    const href = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
      url
    )}`;
    window.open(href, '_blank', 'noopener');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className='sticky top-24 self-start flex flex-col gap-2'>
      <Button size='sm' variant='ghost' onClick={shareTwitter} className='px-3 py-2'>
        <Twitter className='mr-2 h-4 w-4' /> Share
      </Button>
      <Button size='sm' variant='ghost' onClick={copyLink} className='px-3 py-2'>
        <LinkIcon className='mr-2 h-4 w-4' /> {copied ? 'Copied' : 'Copy Link'}
      </Button>
    </div>
  );
}
