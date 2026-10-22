import { useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';
import type { Block } from '@/content/types';
import { asset, cn, isHashRouter } from '@/lib/utils';
import { headingId } from '@/lib/toc';

/** Rewrite inline links: internal routes go through the SPA router, external links open in a new tab. */
function prepareHtml(html: string) {
  return html.replace(/<a href="([^"]+)">/g, (_m, href: string) => {
    if (href.startsWith('/')) return `<a href="${isHashRouter ? '#' + href : href}" data-internal="${href}">`;
    if (href.startsWith('mailto:')) return `<a href="${href}">`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
  });
}


export function RichText({ blocks, className }: { blocks: Block[]; className?: string }) {
  const navigate = useNavigate();
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest('a[data-internal]');
    if (a && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      navigate(a.getAttribute('data-internal')!);
    }
  };

  return (
    // Click handler only delegates link navigation; links stay keyboard-accessible.
    <div
      onClick={onClick}
      className={cn(
        'rich-text prose prose-cgsl max-w-none text-[15px] leading-[27px] prose-headings:font-extrabold prose-h2:mt-12 prose-h2:text-[25px] prose-h2:leading-[34px] prose-h3:text-[20px] prose-p:leading-[27px] prose-li:my-1.5 prose-img:rounded-eco',
        className,
      )}
    >
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'heading': {
            const H = b.level === 2 ? 'h2' : b.level === 3 ? 'h3' : 'h4';
            return (
              <H key={i} id={headingId(b.text)}>
                {b.text}
              </H>
            );
          }
          case 'paragraph':
            return <p key={i} dangerouslySetInnerHTML={{ __html: prepareHtml(b.html) }} />;
          case 'quote':
            return <blockquote key={i} dangerouslySetInnerHTML={{ __html: prepareHtml(b.html) }} />;
          case 'list': {
            const L = b.ordered ? 'ol' : 'ul';
            return (
              <L key={i}>
                {b.items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: prepareHtml(item) }} />
                ))}
              </L>
            );
          }
          case 'image':
            return (
              <figure key={i}>
                <img src={asset(b.src)} alt={b.alt} loading="lazy" className="w-full" />
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
