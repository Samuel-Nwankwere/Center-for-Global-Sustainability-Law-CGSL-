import { volunteer } from '@/content/pages';
import { images } from '@/lib/content';
import { asset } from '@/lib/utils';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { EnquiryForm } from '@/components/sections/EnquiryForm';

export default function VolunteerPage() {
  useSeo('Volunteer with Us', volunteer.intro);
  return (
    <>
      <PageHero eyebrow="Get involved" title="Join our team" image={images.volunteer} crumbs={[{ label: 'Get Involved' }, { label: 'Volunteer with Us' }]} intro="Called to make a difference? Let’s go." />

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">CGSL volunteer program</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Lend your skills to a global mission</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-600">{volunteer.intro}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={asset(images.volunteer)} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-eco object-cover" />
            <img src={asset(images.volunteer2)} alt="" loading="lazy" className="mt-12 aspect-[3/4] w-full rounded-eco object-cover" />
          </div>
        </Container>
      </Section>

      <Section tone="grey">
        <Container>
          <SectionHeading align="center" eyebrow="Why volunteer" title="What you’ll gain" />
          <FeatureGrid items={volunteer.benefits} />
        </Container>
      </Section>

      <Section id="apply">
        <Container className="max-w-3xl">
          <SectionHeading align="center" eyebrow="Apply" title="Express your interest" intro="Tell us about yourself and where you’d like to contribute. We’ll be in touch about current opportunities." />
          <div className="rounded-eco bg-white p-6 shadow-lift ring-1 ring-ink-200/70 sm:p-10">
            <EnquiryForm
              kind="volunteer"
              submitLabel="Submit application"
              successTitle="Thank you for your interest!"
              fields={[
                { name: 'name', label: 'Full name', required: true, autoComplete: 'name' },
                { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'location', label: 'Country / city', autoComplete: 'country-name' },
                { name: 'area', label: 'Area of interest', type: 'select', options: volunteer.areas, required: true },
                { name: 'linkedin', label: 'LinkedIn or CV link', type: 'url', full: true, placeholder: 'https://' },
                { name: 'message', label: 'Why would you like to volunteer with CGSL?', type: 'textarea', required: true },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
