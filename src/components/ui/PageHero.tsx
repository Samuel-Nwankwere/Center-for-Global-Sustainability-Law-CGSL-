import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';
import { asset, cn } from '@/lib/utils';
import { images } from '@/lib/content';
import { Container } from './primitives';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, light, center }: { items: Crumb[]; light?: boolean; center?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn('flex flex-wrap items-center gap-2 text-[14px] font-semibold', center && 'justify-center', light ? 'text-white' : 'text-ink-500')}>
        <li>
          <Link to="/" className={cn('transition', light ? 'hover:text-brand-200' : 'hover:text-brand-600')}>
            Home
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            <ChevronsRight className={cn('h-4 w-4', light ? 'text-brand-300' : 'text-brand-600')} aria-hidden />
            {c.to ? (
              <Link to={c.to} className={cn('transition', light ? 'hover:text-brand-200' : 'hover:text-brand-600')}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn('line-clamp-1', light ? 'text-brand-200' : 'text-brand-600')}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Ecofine inner-page banner ("breadcroumn"): dark green image band with a
 * centred title and breadcrumb trail.
 */
export function PageHero({
  title,
  eyebrow,
  intro,
  image,
  crumbs,
  children,
}: {
  title: ReactNode;
  eyebrow?: string;
  intro?: ReactNode;
  image?: string | null;
  crumbs: Crumb[];
  children?: ReactNode;
  size?: 'md' | 'lg';
}) {
  return (
    <header className="relative isolate overflow-hidden bg-brand-950 text-white">
      <img src={asset(image ?? images.homeHero)} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" loading="eager" decoding="async" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(var(--ink-950)/0.78)_0%,rgb(var(--brand-950)/0.88)_100%)]" />
      <Container className="py-24 text-center lg:py-[120px]">
        <div className="mx-auto max-w-4xl animate-fade-up">
          {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-[3px] text-brand-300">{eyebrow}</p>}
          <h1 className="text-[2.02rem] font-extrabold leading-[1.15] text-white lg:text-[43px] lg:leading-[52px]">{title}</h1>
          <div className="mt-5">
            <Breadcrumbs items={crumbs} light center />
          </div>
          {intro && <div className="mx-auto mt-6 max-w-2xl text-[15px] leading-[27px] text-white/80">{intro}</div>}
          {children && <div className="mt-7 flex justify-center">{children}</div>}
        </div>
      </Container>
    </header>
  );
}
