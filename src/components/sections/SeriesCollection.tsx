import type { ReactNode } from 'react';
import type { PublicationSeries } from '@/content/types';
import { seriesIssues } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { PublicationCard } from '@/components/content/PublicationCard';

/** One publication series: heading, description and a grid of issue cards (five per row on desktop). */
export function SeriesCollection({
  series,
  eyebrow,
  limit,
  action,
  tone,
}: {
  series: PublicationSeries;
  eyebrow?: string;
  limit?: number;
  action?: ReactNode;
  tone?: 'white' | 'grey';
}) {
  const issues = seriesIssues(series.slug).slice(0, limit);
  return (
    <Section id={series.slug} tone={tone}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={series.title} intro={series.description} action={action} />
        {issues.length ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {issues.map((issue) => (
              <PublicationCard key={issue.number} issue={issue} />
            ))}
          </div>
        ) : (
          <p className="rounded-eco bg-ink-50 p-12 text-center text-ink-600">Issues of this series will appear here.</p>
        )}
      </Container>
    </Section>
  );
}
