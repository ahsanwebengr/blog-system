import { useEffect, useState } from 'react';

export default function TableOfContents({ headings = [] }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!headings || headings.length === 0) return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0, 0.1, 0.5, 1] }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // update hash without default jump
    history.replaceState(null, '', `#${id}`);
  };

  if (!headings || headings.length === 0) return null;

  return (
    <nav className='sticky top-24 max-h-[70vh] overflow-y-auto'>
      <div className='text-sm font-semibold text-foreground mb-4 uppercase tracking-wide'>
        Table of Contents
      </div>
      <ul className='space-y-2'>
        {headings.map(h => (
          <li
            key={h.id}
            className={`transition-all duration-200 ${
              active === h.id
                ? 'text-primary font-semibold border-l-2 border-primary pl-3'
                : 'text-muted-foreground hover:text-foreground border-l-2 border-transparent pl-3'
            }`}
            style={{ paddingLeft: `${(h.level - 2) * 12 + 12}px` }}
            onClick={() => {
              const el = document.getElementById(h.id);
              if (!el) return;
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <button className='text-left text-sm leading-relaxed hover:text-primary transition-colors'>
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
