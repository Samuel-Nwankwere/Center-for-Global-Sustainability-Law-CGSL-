import { Users } from 'lucide-react';
import { training } from '@/content/pages';
import { site } from '@/content/site';
import { images } from '@/lib/content';
import { asset } from '@/lib/utils';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonA, ButtonLink, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { CtaBand } from '@/components/sections/CtaBand';

export default function TrainingPage() {
  useSeo('Training', training.intro[0]);
  return (
    <>
      <PageHero eyebrow="What we do" title="Training & capacity building" image={images.training} crumbs={[{ label: 'What We Do' }, { label: 'Training' }]} intro="Equipping policymakers, legal practitioners and executives to navigate the evolving Lex Commons." />

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-lg leading-relaxed text-ink-600">
            {training.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="relative">
            <img src={asset(images.advisory)} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-eco object-cover" />
            <div className="absolute -bottom-6 left-6 right-6 rounded-eco bg-white p-6 shadow-lift ring-1 ring-ink-200/70 sm:left-auto sm:w-80">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Users className="h-4 w-4 text-brand-600" aria-hidden /> Designed for
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {training.audiences.map((a) => (
                  <li key={a} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="grey">
        <Container>
          <SectionHeading eyebrow="Our programs" title="Training that fits your organisation" intro={training.lead} />
          <FeatureGrid items={training.features} />
        </Container>
      </Section>

      <CtaBand
        title="Plan a training programme with CGSL"
        text="Tell us about your team and objectives, and we’ll design a learning pathway around them."
        actions={
          <>
            <ButtonA href={`mailto:${site.email}?subject=${encodeURIComponent('Training enquiry')}`} variant="light" arrow>
              Email {site.email}
            </ButtonA>
            <ButtonLink to="/contact" variant="outline-light">
              Use the contact form
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
