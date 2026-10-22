import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import { domainsIntro } from '@/content/pages';
import type { DomainCategory } from '@/content/types';
import { domainCategories, domains, images } from '@/lib/content';
import { cn } from '@/lib/utils';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { Container, Section } from '@/components/ui/primitives';
import { DomainCard } from '@/components/content/Cards';

export default function DomainsPage() {
  useSeo('Sustainability Domains', domainsIntro[0]);
  const [params, setParams] = useSearchParams();
  const category = (params.get('category') as DomainCategory | null) ?? null;
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return domains.filter(
      (d) =>
        (!category || d.category === category) &&
        (!q || `${d.title} ${d.tagline ?? ''} ${d.summary}`.toLowerCase().includes(q)),
    );
  }, [category, query]);

  const setCategory = (c: DomainCategory | null) => {
    const next = new URLSearchParams(params);
    if (c) next.set('category', c);
    else next.delete('category');
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Sustainability domains"
        image={images.domains}
        crumbs={[{ label: 'What We Do' }, { label: 'Sustainability Domains' }]}
        intro={`${domains.length} interconnected areas where CGSL maps existing law, identifies gaps, and designs the legal frameworks needed for a sustainable transition.`}
      />

      <Section className="pb-8 sm:pb-10 lg:pb-12">
        <Container className="grid gap-8 lg:grid-cols-2">
          {domainsIntro.map((p, i) => (
            <p key={i} className={cn('text-lg leading-relaxed', i === 0 ? 'font-serif text-xl text-ink-800' : 'text-ink-600')}>
              {p}
            </p>
          ))}
        </Container>
      </Section>

      <div className="sticky top-[var(--header-h)] z-30 border-y border-ink-200 bg-white/95 backdrop-blur">
        <Container className="flex flex-col gap-3 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="-mx-1 flex min-w-0 gap-1.5 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0" role="group" aria-label="Filter by theme">
            {[null, ...domainCategories].map((c) => {
              const count = c ? domains.filter((d) => d.category === c).length : domains.length;
              const active = category === c;
              return (
                <button
                  key={c ?? 'all'}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-[5px] px-4 py-2 text-sm font-medium transition',
                    active ? 'bg-brand-600 text-white' : 'bg-ink-50 text-ink-700 ring-1 ring-ink-200 hover:bg-brand-50 hover:text-brand-700',
                  )}
                >
                  {c ?? 'All themes'}
                  <span className={cn('rounded-full px-1.5 text-xs', active ? 'bg-white/20' : 'bg-white text-ink-500')}>{count}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <label className="relative flex-1 xl:w-60 xl:flex-none">
              <span className="sr-only">Filter domains</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter domains…"
                className="h-10 w-full rounded-full bg-ink-50 pl-10 pr-9 text-sm ring-1 ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ink-400 hover:bg-ink-200" aria-label="Clear filter">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
            <div className="hidden rounded-[5px] bg-ink-50 p-1 ring-1 ring-ink-200 sm:flex" role="group" aria-label="Layout">
              {(['grid', 'list'] as const).map((v) => {
                const ViewIcon = v === 'grid' ? LayoutGrid : List;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    className={cn('grid h-8 w-8 place-items-center rounded-full', view === v ? 'bg-white text-brand-700 shadow' : 'text-ink-500')}
                    aria-label={`${v} view`}
                  >
                    <ViewIcon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </div>

      <Section className="pt-10 sm:pt-12 lg:pt-14">
        <Container>
          <p className="mb-6 text-sm text-ink-500" aria-live="polite">
            Showing {filtered.length} of {domains.length} domains
            {category ? ` in ${category}` : ''}
          </p>
          {filtered.length === 0 ? (
            <div className="rounded-eco bg-ink-50 p-12 text-center text-ink-600">No domains match your filters.</div>
          ) : view === 'grid' ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <DomainCard key={d.slug} domain={d} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <DomainCard key={d.slug} domain={d} variant="compact" />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
