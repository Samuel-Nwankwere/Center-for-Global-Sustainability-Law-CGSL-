import { review } from '@/content/pages';
import { domainCategories, domains, images } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { Container, Section } from '@/components/ui/primitives';
import { DomainCard } from '@/components/content/Cards';

export default function ReviewPage() {
  useSeo('LeGsus Review', review.intro);
  return (
    <>
      <PageHero eyebrow="Publications" title="LeGsus Review" image={images.review} crumbs={[{ label: 'Publications', to: '/publications' }, { label: 'LeGsus Review' }]} intro="The legal frameworks that govern sustainability — organised by subject matter." />
      <Section>
        <Container>
          <p className="max-w-4xl text-lg leading-relaxed text-ink-600">{review.intro}</p>
          <div className="mt-14 space-y-14">
            {domainCategories.map((c) => (
              <section key={c} aria-labelledby={`cat-${c}`}>
                <h2 id={`cat-${c}`} className="mb-6 flex items-center gap-4 text-2xl font-semibold">
                  {c}
                  <span className="h-px flex-1 bg-ink-200" />
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {domains
                    .filter((d) => d.category === c)
                    .map((d) => (
                      <DomainCard key={d.slug} domain={d} variant="compact" />
                    ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
