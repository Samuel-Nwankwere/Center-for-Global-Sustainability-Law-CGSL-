import { getArticle } from '@/lib/content';
import type { Article } from '@/content/types';
import { Container, Section, SectionHeading, ArrowLink } from '@/components/ui/primitives';
import { ArticleCard } from './Cards';

export function RelatedArticles({ slugs, title = 'Related publications', fallback = [] }: { slugs: string[]; title?: string; fallback?: Article[] }) {
  const list = slugs.map(getArticle).filter((a): a is Article => Boolean(a));
  const items = list.length ? list : fallback;
  if (!items.length) return null;
  return (
    <Section tone="grey">
      <Container>
        <SectionHeading eyebrow="Publications" title={list.length ? title : 'Latest publications'} action={<ArrowLink to="/publications">All publications</ArrowLink>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
