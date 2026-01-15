import { useState, useEffect } from 'react';

export default function ReadingProgress({ targetId = 'article' }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const height = el.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY - (el.offsetTop || 0);
      const pct = height > 0 ? Math.min(100, Math.max(0, (scrolled / height) * 100)) : 0;
      setProgress(isFinite(pct) ? Math.round(pct) : 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);

  return (
    <div className='fixed left-0 right-0 top-0 h-1 z-50'>
      <div
        className='h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
