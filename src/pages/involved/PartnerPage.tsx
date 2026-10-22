import { partner } from '@/content/pages';
import { images } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { EnquiryForm } from '@/components/sections/EnquiryForm';

export default function PartnerPage() {
  useSeo('Engagements & Collaborations', partner.intro);
  return (
    <>
      <PageHero eyebrow="Get involved" title="Engagements & collaborations" image={images.partner} crumbs={[{ label: 'Get Involved' }, { label: 'Engagements & Collaborations' }]} intro="The power of partnerships to drive meaningful change." />

      <Section>
        <Container className="max-w-4xl text-center">
          <p className="font-serif text-2xl leading-relaxed text-ink-800">{partner.intro}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {partner.partnerTypes.map((t) => (
              <li key={t} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 ring-1 ring-brand-200">
                {t}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="grey">
        <Container>
          <SectionHeading align="center" eyebrow="Ways to partner" title="How we can work together" />
          <FeatureGrid items={partner.ways} columns={4} />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <SectionHeading align="center" eyebrow="Start a conversation" title="Propose a collaboration" />
          <div className="rounded-eco bg-white p-6 shadow-lift ring-1 ring-ink-200/70 sm:p-10">
            <EnquiryForm
              kind="partner"
              submitLabel="Send proposal"
              successTitle="Thank you — let’s talk!"
              fields={[
                { name: 'name', label: 'Full name', required: true, autoComplete: 'name' },
                { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'organisation', label: 'Organisation', required: true, autoComplete: 'organization' },
                { name: 'subject', label: 'Type of partnership', type: 'select', options: partner.ways.map((w) => w.title), required: true },
                { name: 'message', label: 'Tell us about your idea', type: 'textarea', required: true },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
