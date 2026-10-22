import { Compass, Target } from 'lucide-react';
import { overview } from '@/content/pages';
import { images, people } from '@/lib/content';
import { asset } from '@/lib/utils';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { ArrowLink, ButtonLink, Container, Reveal, Section, SectionHeading } from '@/components/ui/primitives';
import { Icon } from '@/components/ui/Icon';
import { Avatar } from '@/components/content/Cards';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  useSeo('About Us', overview.intro);
  const leaders = people.filter((p) => p.group === 'executive').slice(0, 4);
  return (
    <>
      <PageHero eyebrow="About CGSL" title="Who we are" image={images.overview} crumbs={[{ label: 'About' }]} intro={overview.intro} size="lg" />

      <Section>
        <Container className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Compass, title: 'Vision', text: overview.vision },
            { icon: Target, title: 'Mission', text: overview.mission },
          ].map((v, i) => (
            <Reveal key={v.title} delay={i * 100} className="relative overflow-hidden rounded-eco bg-brand-50 p-8 ring-1 ring-brand-100 sm:p-10">
              <v.icon className="h-9 w-9 text-brand-600" aria-hidden />
              <h2 className="mt-5 text-3xl font-semibold">{v.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-700">{v.text}</p>
              <span className="pointer-events-none absolute -bottom-10 -right-6 font-serif text-[9rem] font-bold leading-none text-brand-600/5" aria-hidden>
                {v.title[0]}
              </span>
            </Reveal>
          ))}
        </Container>
      </Section>

      <Section tone="grey">
        <Container className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <p className="eyebrow">Our approach</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Law is the vehicle that gets society to a sustainable destination</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">{overview.approachLead}</p>
            <img src={asset(images.home)} alt="" loading="lazy" className="mt-8 hidden aspect-[4/3] w-full rounded-eco object-cover lg:block" />
          </div>
          <ol className="space-y-4 lg:col-span-7">
            {overview.approach.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 60} className="flex gap-5 rounded-eco bg-white p-6 shadow-card ring-1 ring-ink-200/70 sm:p-8">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 font-serif text-xl font-extrabold text-white">{i + 1}</span>
                <div>
                  <h3 className="font-sans text-xl font-semibold text-ink-900">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading align="center" eyebrow="What guides us" title="Our core values" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {overview.values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 60} className="group rounded-eco border border-ink-200 p-6 transition hover:border-brand-300 hover:bg-brand-50/50">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon name={v.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-sans text-lg font-semibold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="grey">
        <Container>
          <SectionHeading eyebrow="Leadership" title="The people behind CGSL" action={<ArrowLink to="/people">Meet the whole team</ArrowLink>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((p) => (
              <Link key={p.slug} to={`/people/${p.slug}`} className="group flex items-center gap-4 rounded-eco bg-white p-4 ring-1 ring-ink-200/70 transition hover:shadow-card">
                <Avatar person={p} className="h-16 w-16 shrink-0 rounded-2xl text-xl" />
                <div className="min-w-0">
                  <p className="font-serif text-lg font-extrabold text-ink-900 group-hover:text-brand-700">{p.name}</p>
                  <p className="line-clamp-2 text-sm text-ink-600">{p.role}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/about/history" arrow>
              Read our history
            </ButtonLink>
            <ButtonLink to="/about/sustainability-at-cgsl" variant="secondary">
              Sustainability at CGSL
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
