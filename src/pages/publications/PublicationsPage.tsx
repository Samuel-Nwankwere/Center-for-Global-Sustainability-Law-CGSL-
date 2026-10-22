import { Link } from 'react-router-dom';
import { ArrowRight, BookMarked, FileSearch, FileText, Lightbulb, Newspaper, ScrollText } from 'lucide-react';
import { articles, articlePath, articlesBySeries, images } from '@/lib/content';
import { asset, joinNames } from '@/lib/utils';
import { useSeo } from '@/lib/hooks';
import { PageHero } from '@/components/ui/PageHero';
import { ArrowLink, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { ArticleCard } from '@/components/content/Cards';

const series = [
  { to: '/publications/digest', icon: BookMarked, title: 'LeGsus Digest', text: 'Long-form research articles on the legal dimensions of sustainability.', count: articlesBySeries('digest').length },
  { to: '/publications/trove', icon: Newspaper, title: 'LeGsus Trove', text: 'Concise briefings on the latest legal and policy developments.', count: articlesBySeries('trove').length },
  { to: '/publications/review', icon: FileSearch, title: 'LeGsus Review', text: 'The legal frameworks that govern each sustainability subject.' },
  { to: '/publications/white-papers', icon: FileText, title: 'White Papers', text: 'Policy-oriented thought leadership and recommendations.' },
  { to: '/publications/case-studies', icon: Lightbulb, title: 'Case Studies', text: 'How law is being applied to real-world sustainability challenges.' },
  { to: '/publications/proposals', icon: ScrollText, title: 'Proposals', text: 'Informed proposals for legal and policy reform.' },
];

export default function PublicationsPage() {
  useSeo('Publications', 'Research, briefings and policy analysis from the Center for Global Sustainability Law.');
  const [lead, ...rest] = articlesBySeries('digest');
  return (
    <>
      <PageHero eyebrow="Publications" title="Research & insight" image={images.review} crumbs={[{ label: 'Publications' }]} intro={`${articles.length} articles and briefings on the law of the global sustainability transition.`} />

      <Section>
        <Container>
          <Link to={articlePath(lead)} className="group grid overflow-hidden rounded-eco bg-ink-900 text-white lg:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
              <img src={asset(lead.image)} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Latest · LeGsus Digest</p>
              <h2 className="mt-4 font-serif text-3xl font-extrabold leading-tight text-white sm:text-4xl">{lead.title}</h2>
              {lead.subtitle && <p className="mt-2 font-serif text-lg text-white/70">{lead.subtitle}</p>}
              <p className="mt-5 line-clamp-4 leading-relaxed text-white/75">{lead.excerpt}</p>
              <p className="mt-6 text-sm text-white/60">{joinNames(lead.authors)}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-200 group-hover:text-white">
                Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
              </span>
            </div>
          </Link>
        </Container>
      </Section>

      <Section tone="grey">
        <Container>
          <SectionHeading eyebrow="Collections" title="Explore our publication series" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {series.map((s) => (
              <Link key={s.to} to={s.to} className="group flex gap-5 rounded-eco bg-white p-6 ring-1 ring-ink-200/70 transition hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                  <s.icon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="flex items-center gap-2 font-sans text-lg font-semibold text-ink-900">
                    {s.title}
                    {s.count !== undefined && <span className="rounded-full bg-ink-100 px-2 text-xs font-medium text-ink-600">{s.count}</span>}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="LeGsus Digest" title="Recent articles" action={<ArrowLink to="/publications/digest">View all</ArrowLink>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 6).map((a) => (
              <ArticleCard key={a.slug} article={a} showSeries={false} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
