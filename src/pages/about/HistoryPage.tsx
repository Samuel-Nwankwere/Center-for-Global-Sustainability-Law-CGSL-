import { Flag, Quote } from 'lucide-react';
import { history } from '@/content/pages';
import { images } from '@/lib/content';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/ui/primitives';

export default function HistoryPage() {
  useSeo('Our History', history.intro);
  return (
    <>
      <PageHero eyebrow="About CGSL" title="Our history" image={images.history} crumbs={[{ label: 'About', to: '/about' }, { label: 'Our History' }]} intro="Rooted in passion, resilience, and an unwavering dedication to a cause that secures our world." />

      <Section>
        <Container className="max-w-prose">
          <p className="font-serif text-2xl leading-relaxed text-ink-800 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-extrabold first-letter:leading-[0.85] first-letter:text-brand-600">
            {history.intro}
          </p>
        </Container>
      </Section>

      <Section tone="grey">
        <Container>
          <SectionHeading align="center" eyebrow="Why we exist" title="The three gaps in global sustainability" />
          <div className="grid gap-6 lg:grid-cols-3">
            {history.gaps.map((g, i) => (
              <Reveal key={g.title} delay={i * 100} className="relative flex flex-col rounded-eco bg-white p-8 shadow-card ring-1 ring-ink-200/70">
                <span className="font-serif text-6xl font-extrabold text-brand-100">0{i + 1}</span>
                <h3 className="mt-2 text-2xl font-semibold">{g.title}</h3>
                <p className="mt-1 font-medium text-brand-700">{g.subtitle}</p>
                <p className="mt-4 leading-relaxed text-ink-600">{g.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="Our journey" title="From consultation to propulsion" />
          <ol className="relative border-l-2 border-brand-100 pl-8 sm:pl-12">
            {history.timeline.map((t, i) => (
              <Reveal as="li" key={t.title} delay={i * 60} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[2.6rem] top-1 grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white ring-8 ring-white sm:-left-[3.6rem]">
                  {i === history.timeline.length - 1 ? <Flag className="h-4 w-4" aria-hidden /> : <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">{t.period}</p>
                <h3 className="mt-1 text-2xl font-semibold">{t.title}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-600">{t.text}</p>
                {i === history.timeline.length - 1 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {history.pillars.map((p) => (
                      <li key={p} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 ring-1 ring-brand-200">
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <section className="bg-brand-800 py-20 text-white">
        <Container className="max-w-4xl text-center">
          <Quote className="mx-auto h-10 w-10 text-brand-300" aria-hidden />
          <blockquote className="mt-6 font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">“{history.quote}”</blockquote>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl text-center">
          <p className="eyebrow">The road ahead</p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Building momentum</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-600">{history.roadAhead}</p>
          <p className="mt-6 font-serif text-xl text-brand-800">{history.callToAction}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/get-involved/volunteer" arrow>
              Join us
            </ButtonLink>
            <ButtonLink to="/donate" variant="secondary">
              Support our work
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
