import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { ArticleSeries } from '@/content/types';
import { articlesBySeries, images, seriesLabel } from '@/lib/content';
import { cn } from '@/lib/utils';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { Container, Section } from '@/components/ui/primitives';
import { ArticleCard } from '@/components/content/Cards';

const copy: Record<ArticleSeries, { intro: string; image: string }> = {
  digest: {
    intro: 'Long-form research from CGSL’s team and network, examining how law can accelerate — or obstruct — the global sustainability transition.',
    image: 'review',
  },
  trove: {
    intro: 'Concise briefings on legislation, litigation, finance and diplomacy shaping sustainability around the world.',
    image: 'whitePapers',
  },
};

export default function SeriesPage({ series }: { series: ArticleSeries }) {
  const all = articlesBySeries(series);
  const label = seriesLabel[series];
  useSeo(label, copy[series].intro);
  const [query, setQuery] = useState('');
  const [author, setAuthor] = useState<string | null>(null);
  const authors = useMemo(() => [...new Set(all.flatMap((a) => a.authors))].sort(), [all]);

  const list = all.filter(
    (a) =>
      (!author || a.authors.includes(author)) &&
      (!query || `${a.title} ${a.subtitle ?? ''} ${a.excerpt}`.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <PageHero eyebrow="Publications" title={label} image={images[copy[series].image]} crumbs={[{ label: 'Publications', to: '/publications' }, { label }]} intro={copy[series].intro} />
      <Section>
        <Container>
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {authors.length > 1 ? (
              <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by author">
                {[null, ...authors].map((a) => (
                  <button
                    key={a ?? 'all'}
                    type="button"
                    onClick={() => setAuthor(a)}
                    aria-pressed={author === a}
                    className={cn(
                      'shrink-0 rounded-[5px] px-4 py-2 text-sm font-medium transition',
                      author === a ? 'bg-brand-600 text-white' : 'bg-ink-50 text-ink-700 ring-1 ring-ink-200 hover:bg-brand-50',
                    )}
                  >
                    {a ?? 'All authors'}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-ink-500">{all.length} briefings</p>
            )}
            <label className="relative lg:w-72">
              <span className="sr-only">Search {label}</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${label}…`}
                className="h-11 w-full rounded-full bg-ink-50 pl-10 pr-4 text-sm ring-1 ring-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </label>
          </div>
          {list.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => (
                <ArticleCard key={a.slug} article={a} showSeries={false} />
              ))}
            </div>
          ) : (
            <p className="rounded-eco bg-ink-50 p-12 text-center text-ink-600">No articles match your search.</p>
          )}
        </Container>
      </Section>
    </>
  );
}
