import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, Check, ChevronsRight, Clock, FolderOpen, Link2, Linkedin, Mail, User } from 'lucide-react';
import { articles, articlesBySeries, getArticle, personForAuthor, seriesLabel, topicsForArticle } from '@/lib/content';
import { asset, cn, formatDate } from '@/lib/utils';
import { useReadingProgress, useSeo } from '@/lib/hooks';
import { tocFrom } from '@/lib/toc';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonLink, Container, Section, SectionHeading, ArrowLink } from '@/components/ui/primitives';
import { Widget } from '@/components/ui/Widget';
import { RichText } from '@/components/content/RichText';
import { ArticleCard, ArticleRow, Avatar } from '@/components/content/Cards';
import NotFoundPage from '../NotFoundPage';

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  const btn = 'grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600 transition hover:bg-brand-600 hover:text-white';
  return (
    <div className="flex items-center gap-2">
      <span className="mr-2 font-extrabold text-ink-900">Share:</span>
      <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
        <Linkedin className="h-4 w-4" />
      </a>
      <a className={btn} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} aria-label="Share by email">
        <Mail className="h-4 w-4" />
      </a>
      <button type="button" className={btn} onClick={copy} aria-label="Copy link">
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  if (items.length < 3) return null;
  return (
    <Widget title="On This Page">
      <nav aria-label="On this page">
        <ol className="space-y-1">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(i.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn('flex items-start gap-2 py-1.5 text-[14px] font-semibold leading-6 transition', active === i.id ? 'text-brand-600' : 'text-ink-700 hover:text-brand-600')}
              >
                <ChevronsRight className="mt-1 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                {i.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </Widget>
  );
}

export default function ArticlePage() {
  const { series = '', slug = '' } = useParams();
  const article = getArticle(slug);
  useSeo(article?.title, article?.excerpt);
  const bodyRef = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(bodyRef);
  const toc = useMemo(() => (article ? tocFrom(article.body) : []), [article]);

  if (!article || article.series !== series) return <NotFoundPage />;

  const label = seriesLabel[article.series];
  const topics = topicsForArticle(article.slug);
  const authorPeople = article.authors.map((a) => ({ name: a, person: personForAuthor(a) }));
  const more = articles.filter((a) => a.slug !== article.slug && a.series === article.series).slice(0, 3);
  const recent = articles.filter((a) => a.slug !== article.slug).slice(0, 4);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[55] h-1 origin-left bg-brand-500" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      <PageHero title={label} image={article.image} crumbs={[{ label: 'Publications', to: '/publications' }, { label, to: `/publications/${article.series}` }, { label: article.title }]} />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <article ref={bodyRef} className="min-w-0 lg:col-span-8">
            {article.image && (
              <figure>
                <img src={asset(article.image)} alt="" className="aspect-[16/9] w-full rounded-eco object-cover" />
                {article.imageCaption && <figcaption className="mt-2 text-sm text-ink-500">{article.imageCaption}</figcaption>}
              </figure>
            )}
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-semibold text-ink-500">
              <li className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-brand-600" aria-hidden />
                {authorPeople.map(({ name, person }, i) => (
                  <span key={name}>
                    {i > 0 && (i === authorPeople.length - 1 ? ' and ' : ', ')}
                    {person ? (
                      <Link to={`/people/${person.slug}`} className="hover:text-brand-600">
                        {name}
                      </Link>
                    ) : (
                      name
                    )}
                  </span>
                ))}
              </li>
              {article.date && (
                <li className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-brand-600" aria-hidden />
                  <time dateTime={article.date}>{formatDate(article.date, { dateStyle: 'long' })}</time>
                </li>
              )}
              <li className="inline-flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-brand-600" aria-hidden />
                <Link to={`/publications/${article.series}`} className="hover:text-brand-600">
                  {label}
                </Link>
              </li>
              <li className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-600" aria-hidden /> {article.readingMinutes} min read
              </li>
            </ul>
            <h1 className="mt-5 text-[1.8rem] font-extrabold leading-[1.2] text-ink-900 lg:text-[36px] lg:leading-[45px]">{article.title}</h1>
            {article.subtitle && <p className="mt-3 text-xl font-semibold leading-8 text-brand-700">{article.subtitle}</p>}
            <RichText blocks={article.body} className="mt-8 prose-p:text-[0.95rem]" />

            <div className="mt-12 flex flex-col gap-6 border-y border-ink-200 py-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 font-extrabold text-ink-900">Topics:</span>
                {topics.length ? (
                  topics.map((t) => (
                    <Link key={t.to} to={t.to} className="rounded-[5px] bg-ink-50 px-3 py-1.5 text-sm font-semibold text-ink-700 transition hover:bg-brand-600 hover:text-white">
                      {t.label}
                    </Link>
                  ))
                ) : (
                  <Link to={`/publications/${article.series}`} className="rounded-[5px] bg-ink-50 px-3 py-1.5 text-sm font-semibold text-ink-700 transition hover:bg-brand-600 hover:text-white">
                    {label}
                  </Link>
                )}
              </div>
              <ShareButtons title={article.title} />
            </div>

            {authorPeople
              .filter((a) => a.person)
              .map(({ person }) => (
                <div key={person!.slug} className="mt-10 flex flex-col gap-6 rounded-eco bg-ink-50 p-7 sm:flex-row sm:items-center">
                  <Avatar person={person!} className="h-28 w-28 shrink-0 rounded-full" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[2px] text-brand-600">About the author</p>
                    <h2 className="mt-1 text-2xl font-extrabold text-ink-900">{person!.name}</h2>
                    <p className="font-semibold text-ink-700">{person!.role}</p>
                    <p className="mt-2 line-clamp-3 leading-7">{person!.bio[0]}</p>
                    <ArrowLink to={`/people/${person!.slug}`} className="mt-3">
                      View profile
                    </ArrowLink>
                  </div>
                </div>
              ))}
          </article>

          <aside className="space-y-8 lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <Toc items={toc} />
              <Widget title="Recent Posts">
                <div className="space-y-6">
                  {recent.map((a) => (
                    <ArticleRow key={a.slug} article={a} />
                  ))}
                </div>
              </Widget>
              <Widget title="Categories">
                <ul className="space-y-3">
                  {(['digest', 'trove'] as const).map((s) => (
                    <li key={s}>
                      <Link to={`/publications/${s}`} className="flex items-center justify-between rounded-[5px] bg-white px-5 py-3.5 font-bold text-ink-900 transition hover:bg-brand-600 hover:text-white">
                        {seriesLabel[s]} <span>({articlesBySeries(s).length})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Widget>
              <div className="rounded-eco bg-brand-600 p-8 text-center text-white">
                <p className="text-2xl font-extrabold">Work with our experts</p>
                <p className="mt-2 leading-7 text-white/85">Regulatory intelligence and tailored advice on the topics we research.</p>
                <ButtonLink to="/advisory" variant="light" arrow className="mt-6">
                  Advisory Services
                </ButtonLink>
              </div>
            </div>
          </aside>
        </Container>
      </Section>

      {more.length > 0 && (
        <Section tone="grey">
          <Container>
            <SectionHeading eyebrow={label} title="More Publications" action={<ButtonLink to={`/publications/${article.series}`} arrow>View All</ButtonLink>} />
            <div className="grid gap-[30px] md:grid-cols-2 lg:grid-cols-3">
              {more.map((a) => (
                <ArticleCard key={a.slug} article={a} showSeries={false} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
