import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpenText, ChevronLeft, ChevronRight, CircleCheck, Layers, Quote, Scale, Users } from 'lucide-react';
import { site } from '@/content/site';
import { history, homeFaqs, lexCommons, overview } from '@/content/pages';
import { articles, articlesBySeries, domains, featuredDomains, getArticle, images, people, programs } from '@/lib/content';
import { asset, cn } from '@/lib/utils';
import { useCountUp, useInView, useSeo } from '@/lib/hooks';
import { ButtonLink, Container, LeafSprig, Reveal, Section, SectionHeading } from '@/components/ui/primitives';
import { ArticleCard, Avatar, PersonCard, ProgramCard } from '@/components/content/Cards';
import { Accordion } from '@/components/ui/Accordion';
import { Icon } from '@/components/ui/Icon';

/* ================================================================== 1. Hero slider (Ecofine "eco_slider") */
const featured = getArticle('energy-as-a-human-right');
const slides = [
  {
    kicker: 'Law & Sustainability',
    title: 'Law at the Heart of Global Sustainability',
    text: 'We advance the critical role of law in shaping a just, equitable, and sustainable future — bridging ambitious sustainability goals and the legal frameworks needed to achieve them.',
    cta: { label: 'Discover More', to: '/about' },
    image: images.homeHero,
  },
  {
    kicker: 'Featured research · LeGsus Digest',
    title: featured?.title ?? 'Energy as a Human Right',
    text: featured?.subtitle ?? '',
    cta: { label: 'Read The Article', to: '/publications/digest/energy-as-a-human-right' },
    image: featured?.image ?? images.energy,
  },
  {
    kicker: 'Lex Commons',
    title: 'Our Sustainability Legal Infrastructure',
    text: lexCommons.platformLead,
    cta: { label: 'Explore Lex Commons', to: '/lex-commons' },
    image: images.lexCommons,
  },
];

function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => go(1), 7000);
    return () => window.clearTimeout(t);
  }, [index, paused, go]);

  return (
    <section
      className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-ink-950 lg:min-h-[860px]"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div key={i} className={cn('absolute inset-0 -z-10 transition-opacity duration-1000', i === index ? 'opacity-100' : 'opacity-0')} aria-hidden>
          <img src={asset(s.image)} alt="" className={cn('h-full w-full object-cover', i === index && 'animate-ken-burns')} loading={i === 0 ? 'eager' : 'lazy'} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--ink-950)/0.92)_0%,rgb(var(--ink-950)/0.7)_45%,rgb(var(--brand-950)/0.25)_100%)]" />
        </div>
      ))}

      <Container className="pb-40 pt-[calc(var(--header-h)+5rem)] lg:pt-[calc(var(--header-h)+var(--topbar-h)+4rem)]">
        <div key={index} className="max-w-[46rem] animate-fade-up" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
          <p className="mb-2 text-sm font-bold uppercase leading-9 tracking-[0.8px] text-brand-300">{slides[index].kicker}</p>
          <h1 className="text-[2.48rem] font-extrabold leading-[1.13] text-white sm:text-[3.15rem] lg:text-[68px] lg:leading-[78px]">{slides[index].title}</h1>
          <p className="mt-6 max-w-[38rem] text-lg leading-[27px] text-white/85">{slides[index].text}</p>
          <ButtonLink to={slides[index].cta.to} arrow className="mt-10">
            {slides[index].cta.label}
          </ButtonLink>
        </div>
      </Container>

      {/* Vertical slide dots */}
      <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex 2xl:left-12" role="tablist" aria-label="Choose slide">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}: ${s.title}`}
            onClick={() => setIndex(i)}
            className={cn('h-3 w-3 rounded-full ring-2 ring-white transition', i === index ? 'bg-white' : 'bg-transparent hover:bg-white/50')}
          />
        ))}
      </div>

      {/* Bottom-left social text links */}
      <div className="absolute bottom-10 left-6 hidden gap-8 text-[12px] font-bold uppercase tracking-[1px] text-white md:flex 2xl:left-12">
        {site.social.linkedin && (
          <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-300">
            LinkedIn
          </a>
        )}
        <a href={`mailto:${site.email}`} className="hover:text-brand-300">
          Email
        </a>
        <Link to="/contact" className="hover:text-brand-300">
          Contact
        </Link>
      </div>

      {/* Bottom-right square arrows */}
      <div className="absolute bottom-0 right-0 flex">
        <button type="button" onClick={() => go(-1)} className="grid h-16 w-16 place-items-center bg-white text-brand-600 transition hover:bg-brand-50 sm:h-[100px] sm:w-[100px]" aria-label="Previous slide">
          <ArrowLeft className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.5} />
        </button>
        <button type="button" onClick={() => go(1)} className="grid h-16 w-16 place-items-center bg-brand-600 text-white transition hover:bg-brand-700 sm:h-[100px] sm:w-[100px]" aria-label="Next slide">
          <ArrowRight className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}

/* ================================================================== 2. About (Ecofine "about image" + "about us") */
function About() {
  const ceo = people.find((p) => p.slug === 'akinola-afolarin');
  const points = ['Independent, non-profit and apolitical', 'A global network of experts across legal traditions', 'Hard and soft law as levers for real change'];
  return (
    <section className="py-20 lg:pb-[120px] lg:pt-[110px]">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <Reveal className="relative mx-auto w-full max-w-[34rem] pb-16 pl-6 pr-10">
          <span className="absolute bottom-16 left-0 top-10 w-3 bg-brand-600" aria-hidden />
          <span className="absolute right-0 top-0 h-40 w-3 bg-brand-600" aria-hidden />
          <img src={asset(images.overview)} alt="" loading="lazy" className="relative aspect-[5/6] w-full rounded-eco object-cover" />
          <div className="absolute bottom-0 right-0 w-1/2 rounded-eco border-[6px] border-white bg-white shadow-lift">
            <img src={asset(images.home)} alt="" loading="lazy" className="aspect-square w-full rounded-[10px] object-cover" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow">About CGSL</p>
          <h2 className="section-title">Bridging Legal Expertise And Global Action</h2>
          <p className="mt-6 leading-[27px] text-ink-500">
            The Center for Global Sustainability Law is an independent nonprofit dedicated to the vital intersection of legal frameworks and environmental
            stewardship. We believe that both hard and soft law are the essential levers required to translate sustainability goals into global reality.
          </p>
          <ul className="mt-7 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 font-bold text-ink-900">
                <CircleCheck className="h-5 w-5 shrink-0 fill-brand-600 text-white" aria-hidden /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Our Vision', text: 'A resilient future where law serves as the foundation for sustainability.' },
              { label: 'Our Mission', text: 'Expert legal analysis that accelerates global sustainability goals.' },
            ].map((b) => (
              <div key={b.label} className="rounded-[10px] bg-ink-50 p-5">
                <p className="font-extrabold text-ink-900">{b.label}</p>
                <p className="mt-1 text-sm leading-6">{b.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-6 border-t border-ink-200 pt-8">
            {ceo && (
              <Link to={`/people/${ceo.slug}`} className="group flex items-center gap-4">
                <Avatar person={ceo} className="h-16 w-16 rounded-full" />
                <span>
                  <span className="block text-sm font-semibold text-brand-600">{ceo.role}</span>
                  <span className="block text-lg font-extrabold text-ink-900 group-hover:text-brand-600">{ceo.name}</span>
                </span>
              </Link>
            )}
            <ButtonLink to="/about" arrow>
              Explore More
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ================================================================== 3. Services band + 4. counter (Ecofine "service three" + "counter") */
function Programs() {
  return (
    <section className="relative overflow-hidden bg-ink-50 pb-[220px] pt-20 lg:pt-[110px]">
      <LeafSprig className="absolute -left-6 -top-4 h-56 w-44 -rotate-12 sm:h-72 sm:w-56" />
      <LeafSprig className="absolute -right-6 -top-4 h-56 w-44 rotate-12 scale-x-[-1] sm:h-72 sm:w-56" />
      <Container className="relative">
        <SectionHeading align="center" eyebrow="Our Programs" title="Law. Sustainability. Impact." intro="Our global network of experts uses both hard and soft law to turn sustainability ambitions into enforceable, impactful, and enduring realities." />
        <div className="grid gap-[30px] sm:grid-cols-2 xl:grid-cols-4">
          {programs.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProgramCard program={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Counter({ value, suffix, label, icon: IconCmp, start }: { value: number; suffix: string; label: string; icon: typeof Users; start: boolean }) {
  const n = useCountUp(value, start);
  return (
    <div className="flex flex-col items-center text-center">
      <span className="mb-6 grid h-28 w-28 place-items-center rounded-full bg-brand-600 text-white ring-8 ring-white/10 transition duration-500 hover:rotate-[360deg] lg:h-[150px] lg:w-[150px]">
        <IconCmp className="h-12 w-12 lg:h-16 lg:w-16" strokeWidth={1.3} aria-hidden />
      </span>
      <p className="text-[36px] font-extrabold leading-none text-white lg:text-[43px]">
        {n}
        {suffix}
      </p>
      <p className="mt-2 text-lg font-bold text-white">{label}</p>
    </div>
  );
}

function Counters() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const stats = [
    { value: domains.length, suffix: '', label: 'Sustainability domains', icon: Layers },
    { value: programs.length, suffix: '', label: 'Flagship programs', icon: Scale },
    { value: articles.length, suffix: '+', label: 'Research publications', icon: BookOpenText },
    { value: people.length, suffix: '+', label: 'Experts & researchers', icon: Users },
  ];
  return (
    <div className="relative z-10 -mt-[150px] px-4 sm:px-[30px]">
      <div ref={ref} className="relative isolate mx-auto max-w-[80rem] overflow-hidden rounded-[30px] bg-brand-900 px-6 py-14 lg:px-16 lg:py-[70px]">
        <img src={asset(images.homeHero)} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-ink-950/75" />
        <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {stats.map((s) => (
            <Counter key={s.label} {...s} start={inView} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== 5. Four-step process (Ecofine "icon box two") */
function Process() {
  const icons = ['ScanSearch', 'FileText', 'Globe2', 'Handshake'];
  return (
    <section className="relative overflow-hidden py-20 lg:py-[110px]">
      <div className="dots-map absolute inset-x-0 top-0 h-[420px]" aria-hidden />
      <Container className="relative">
        <SectionHeading align="center" eyebrow="4 Step Approach" title="Sustainability Defines The Destination. Law Is The Vehicle." />
        <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {overview.approach.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="group relative text-center">
              {i < 3 && (
                <svg className="absolute left-[calc(50%+110px)] top-[85px] hidden w-[calc(100%-190px)] text-brand-300 lg:block" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
                  <path d="M0 10 H92" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" fill="none" vectorEffect="non-scaling-stroke" />
                  <path d="M90 4 L98 10 L90 16" stroke="currentColor" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
              )}
              <span className="relative mx-auto mb-10 grid h-[150px] w-[150px] place-items-center lg:h-[190px] lg:w-[190px] rounded-full bg-ink-50 text-brand-600 transition duration-500 group-hover:bg-brand-600 group-hover:text-white">
                <Icon name={icons[i]} className="h-14 w-14 lg:h-[70px] lg:w-[70px]" strokeWidth={1.1} />
                <span className="absolute right-0 top-0 grid h-[50px] w-[50px] place-items-center rounded-full bg-brand-600 text-xl font-bold text-white ring-4 ring-white">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <h3 className="text-xl font-bold leading-7 text-ink-900">{s.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-[14px] leading-7 text-ink-500">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ================================================================== 6. FAQ (Ecofine "Faq_section") */
function Faq() {
  return (
    <section className="bg-ink-50 py-20 lg:py-[110px]">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="eyebrow">Ask Something</p>
          <h2 className="section-title">Do You Have Any Question?</h2>
          <p className="mb-9 mt-5 leading-[27px]">Answers to the questions we hear most often about CGSL and how we work.</p>
          <Accordion items={homeFaqs} />
        </Reveal>
        <Reveal delay={100} className="relative mx-auto w-full max-w-[34rem]">
          <div className="absolute -right-4 -top-4 h-2/3 w-2/3 rounded-eco bg-brand-600" aria-hidden />
          <img src={asset(images.lexCommons)} alt="" loading="lazy" className="relative aspect-[4/5] w-full rounded-eco object-cover" />
          <div className="absolute -bottom-6 -left-4 max-w-[17rem] rounded-eco bg-white p-6 shadow-lift sm:-left-10">
            <p className="font-extrabold text-ink-900">Still have questions?</p>
            <p className="mt-1 text-sm leading-6">Our team is happy to help.</p>
            <ButtonLink to="/contact" size="sm" arrow className="mt-4">
              Contact Us
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ================================================================== 7. Domains carousel (Ecofine "donation two" card layout) */
function DomainsCarousel() {
  const list = featuredDomains();
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);
  const scrollTo = (p: number) => track.current?.scrollTo({ left: p * (track.current?.clientWidth ?? 0), behavior: 'smooth' });

  return (
    <section className="relative overflow-hidden py-20 lg:py-[110px]">
      <LeafSprig className="absolute -left-8 bottom-0 h-64 w-48 rotate-[200deg]" />
      <LeafSprig className="absolute -right-8 top-6 h-64 w-48 rotate-12 scale-x-[-1]" />
      <Container className="relative">
        <SectionHeading align="center" eyebrow="Sustainability Domains" title="Where Law Meets The Planet’s Hardest Problems" />
        <div ref={track} onScroll={measure} className="-mx-3 flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((d) => (
            <div key={d.slug} className="w-full shrink-0 snap-start px-3 lg:w-1/2">
              <article className="group relative grid h-full overflow-hidden rounded-eco bg-white ring-1 ring-ink-200 transition hover:shadow-lift sm:grid-cols-2">
                <div className="relative min-h-[220px] overflow-hidden">
                  <img src={asset(d.image)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col p-7">
                  <p className="text-xs font-bold uppercase tracking-[2px] text-brand-600">{d.category}</p>
                  <h3 className="mt-2 text-xl font-bold leading-7 text-ink-900">
                    <Link to={`/domains/${d.slug}`} className="after:absolute after:inset-0">
                      {d.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-4 text-[14px] leading-7">{d.tagline}</p>
                  <span className="mt-auto flex h-11 items-center justify-center gap-2 rounded-[5px] bg-brand-600 text-sm font-bold uppercase text-white transition group-hover:bg-ink-900">
                    Explore Domain <ChevronRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </article>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Domain pages">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Show page ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn('h-2 rounded-full transition-all', i === page ? 'w-8 bg-brand-600' : 'w-2 bg-brand-200 hover:bg-brand-300')}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink to="/domains" variant="secondary" arrow>
            View All {domains.length} Domains
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== 8. Commitment quotes (Ecofine "testimonial v2" layout) */
const quotes = [
  { text: overview.vision, name: 'Our Vision', role: 'Center for Global Sustainability Law' },
  { text: overview.mission, name: 'Our Mission', role: 'Center for Global Sustainability Law' },
  { text: history.quote, name: 'Our History', role: 'The Emergence phase' },
];

function Commitment() {
  const [i, setI] = useState(0);
  const q = quotes[i];
  return (
    <section className="py-20 lg:py-[110px]">
      <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="eyebrow">Our Commitment</p>
          <h2 className="section-title">Leading The Way To A Just And Sustainable Transition</h2>
          <figure key={i} className="mt-10 animate-fade-up rounded-eco bg-ink-50 p-8 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-white ring-1 ring-ink-200">
                  <img src={asset('/favicon.png')} alt="" className="h-10 w-10" />
                </span>
                <figcaption>
                  <span className="block text-lg font-extrabold text-ink-900">{q.name}</span>
                  <span className="block text-sm font-semibold text-brand-600">{q.role}</span>
                </figcaption>
              </div>
              <Quote className="h-12 w-12 shrink-0 fill-brand-100 text-brand-200" aria-hidden />
            </div>
            <blockquote className="mt-6 text-lg leading-[29px] text-ink-700">“{q.text}”</blockquote>
          </figure>
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={() => setI((i + quotes.length - 1) % quotes.length)} className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-ink-900" aria-label="Previous statement">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => setI((i + 1) % quotes.length)} className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-ink-900" aria-label="Next statement">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[32rem] p-8">
          <span className="absolute right-0 top-0 h-40 w-40 border-r-[14px] border-t-[14px] border-brand-300" aria-hidden />
          <span className="absolute bottom-0 left-0 h-40 w-40 border-b-[14px] border-l-[14px] border-brand-300" aria-hidden />
          <img src={asset(images.volunteer2)} alt="" loading="lazy" className="relative aspect-[5/6] w-full object-cover" />
          <div className="absolute bottom-16 right-0 bg-brand-600 px-7 py-6 text-center text-white shadow-lift">
            <p className="text-4xl font-extrabold">2025</p>
            <p className="mt-1 text-sm font-semibold">Year founded</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== 9. Team (Ecofine "team two") */
function Team() {
  const team = people.filter((p) => p.group === 'executive').slice(0, 4);
  return (
    <Section tone="grey">
      <Container>
        <SectionHeading eyebrow="Our Expert Team" title="Meet The People Behind CGSL" action={<ButtonLink to="/people" arrow>Our Expert Team</ButtonLink>} />
        <div className="grid gap-x-[30px] gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <PersonCard person={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ================================================================== 10. Blog (Ecofine "blog v2") */
function Blog() {
  const latest = [...articlesBySeries('digest')].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, 3);
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Our Latest Research" title="Let’s Check Out Our Latest Publications" action={<ButtonLink to="/publications" arrow>Read More Articles</ButtonLink>} />
        <div className="grid gap-[30px] md:grid-cols-2 lg:grid-cols-3">
          {latest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default function HomePage() {
  useSeo();
  return (
    <>
      <HeroSlider />
      <About />
      <Programs />
      <Counters />
      <Process />
      <Faq />
      <DomainsCarousel />
      <Commitment />
      <Team />
      <Blog />
    </>
  );
}
