import type { ReactNode } from 'react';

/** In-page link that works under both browser and hash routing. */
export function AnchorLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById(to)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }}
    >
      {children}
    </a>
  );
}
