import { advisory } from '@/content/pages';
import { site } from '@/content/site';
import { images } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonA, ButtonLink, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { CtaBand } from '@/components/sections/CtaBand';

const steps = [
  { title: 'Discover', text: 'We map your operations, jurisdictions and sustainability commitments.' },
  { title: 'Diagnose', text: 'Lex Commons intelligence reveals gaps against emerging hard and soft law.' },
  { title: 'Design', text: 'We co-create strategy, policies and implementation roadmaps.' },
  { title: 'Deliver', text: 'Ongoing guidance as regulations and expectations evolve.' },
];

export default function AdvisoryPage() {
  useSeo('Advisory Services', advisory.intro[0]);
  return (
    <>
      <PageHero eyebrow="Advisory" title="Advisory services" image={images.advisory} crumbs={[{ label: 'Advisory Services' }]} intro="A strategic roadmap through the legal complexity of the sustainability transition — for governments, corporations and international organisations.">
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/contact" variant="light" arrow>
            Talk to our team
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-2">
          {advisory.intro.map((p, i) => (
            <p key={i} className={i === 0 ? 'font-serif text-xl leading-relaxed text-ink-800' : 'text-lg leading-relaxed text-ink-600'}>
              {p}
            </p>
          ))}
        </Container>
      </Section>

      <Section tone="grey">
        <Container>
          <SectionHeading eyebrow="The Lex Commons advantage" title="Tailored services for your organisation" intro={advisory.lead} />
          <FeatureGrid items={advisory.services} columns={3} />
        </Container>
      </Section>

      <section className="bg-brand-800 py-20 text-white">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">How an engagement works</p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl font-extrabold text-white sm:text-4xl">Long-term partners, not just counsel</h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-eco bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="bg-brand-800 p-7">
                <span className="font-serif text-5xl font-extrabold text-brand-400/60">{i + 1}</span>
                <h3 className="mt-3 font-sans text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand
        title="Ready to future-proof your sustainability strategy?"
        actions={
          <>
            <ButtonLink to="/contact" variant="light" arrow>
              Contact us
            </ButtonLink>
            <ButtonA href={`mailto:${site.email}?subject=${encodeURIComponent('Advisory enquiry')}`} variant="outline-light">
              {site.email}
            </ButtonA>
          </>
        }
      />
    </>
  );
}
