import { Database } from 'lucide-react';
import { lexCommons } from '@/content/pages';
import { domainCategories, domains, images } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { ArrowLink, ButtonLink, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { CtaBand } from '@/components/sections/CtaBand';
import { Link } from 'react-router-dom';

export default function LexCommonsPage() {
  useSeo('Lex Commons', lexCommons.intro[0]);
  return (
    <>
      <PageHero eyebrow="What we do" title="Lex Commons" image={images.lexCommons} crumbs={[{ label: 'What We Do' }, { label: 'Lex Commons' }]} intro="Our sustainability legal infrastructure — mapping the laws, treaties and standards that shape sustainability worldwide." />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-6 text-lg leading-relaxed text-ink-600 lg:col-span-7">
            {lexCommons.intro.map((p, i) => (
              <p key={i} className={i === 0 ? 'font-serif text-xl text-ink-800' : undefined}>
                {p}
              </p>
            ))}
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-eco bg-ink-900 p-8 text-white">
              <Database className="h-8 w-8 text-brand-300" aria-hidden />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">The catalogue covers</p>
              <ul className="mt-4 space-y-3">
                {['International treaties', 'Regional & national frameworks', 'Soft-law instruments', 'Regulations & standards'].map((t) => (
                  <li key={t} className="flex items-center gap-3 border-b border-white/10 pb-3 text-white/90 last:border-0">
                    <span className="h-2 w-2 rounded-full bg-brand-400" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="grey">
        <Container>
          <SectionHeading eyebrow="Platform in development" title="A regulatory intelligence platform for sustainability" intro={lexCommons.platformLead} />
          <FeatureGrid items={lexCommons.features} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Coverage" title="Organised by sustainability domain" action={<ArrowLink to="/domains">Browse all domains</ArrowLink>} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {domainCategories.map((c) => (
              <div key={c} className="rounded-eco border border-ink-200 p-6">
                <h3 className="font-sans text-base font-semibold text-ink-900">{c}</h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {domains
                    .filter((d) => d.category === c)
                    .map((d) => (
                      <li key={d.slug}>
                        <Link to={`/domains/${d.slug}`} className="inline-block rounded-full bg-ink-50 px-3 py-1 text-xs text-ink-700 ring-1 ring-ink-200 hover:bg-brand-50 hover:text-brand-700">
                          {d.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Put Lex Commons to work for your organisation"
        text="Our Advisory Team uses Lex Commons intelligence to de-risk operations and future-proof strategy."
        actions={
          <>
            <ButtonLink to="/advisory" variant="light" arrow>
              Advisory services
            </ButtonLink>
            <ButtonLink to="/contact" variant="outline-light">
              Request early access
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
