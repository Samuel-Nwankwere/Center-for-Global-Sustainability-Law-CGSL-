import { Link } from 'react-router-dom';
import { ChevronsRight, Clock, FolderOpen, Mail, User } from 'lucide-react';
import type { Article, Domain, Person, Program } from '@/content/types';
import { articlePath, seriesLabel } from '@/lib/content';
import { asset, cn, initials, joinNames } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

const dayMonth = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString('en-US', { day: '2-digit', timeZone: 'UTC' }),
    month: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
  };
};

/* ------------------------------------------------------------------ Article (Ecofine "theme blog v2") */
export function ArticleCard({ article, className, showSeries = true }: { article: Article; className?: string; showSeries?: boolean }) {
  const dm = dayMonth(article.date);
  return (
    <article className={cn('group relative flex h-full flex-col overflow-hidden rounded-eco bg-white ring-1 ring-ink-200 transition duration-300 hover:shadow-lift hover:ring-transparent', className)}>
      <div className="relative aspect-[16/11] overflow-hidden rounded-t-eco bg-ink-100">
        {article.image && <img src={asset(article.image)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-80" />}
        {dm && (
          <span className="absolute bottom-0 right-0 flex w-[68px] flex-col items-center rounded-tl-eco bg-brand-600 py-1.5 leading-tight text-white">
            <span className="text-xl font-extrabold">{dm.day}</span>
            <span className="text-xs font-semibold uppercase">{dm.month}</span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-medium text-ink-500">
          <li className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-brand-600" aria-hidden />
            <span className="line-clamp-1">{joinNames(article.authors)}</span>
          </li>
          {showSeries && (
            <li className="inline-flex items-center gap-1.5">
              <FolderOpen className="h-3.5 w-3.5 text-brand-600" aria-hidden />
              {seriesLabel[article.series]}
            </li>
          )}
        </ul>
        <h3 className="mt-3 text-[20px] font-bold leading-[29px] text-ink-900 transition group-hover:text-brand-600">
          <Link to={articlePath(article)} className="line-clamp-3 after:absolute after:inset-0 focus-visible:ring-0">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 leading-7 text-ink-500">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between border-t border-ink-200 pt-5 text-sm">
          <span className="inline-flex items-center gap-1.5 font-extrabold text-ink-900 group-hover:text-brand-600">
            Read More <ChevronsRight className="h-4 w-4 text-brand-600" aria-hidden />
          </span>
          <span className="inline-flex items-center gap-1 text-ink-500">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {article.readingMinutes} min
          </span>
        </div>
      </div>
    </article>
  );
}

/** Compact horizontal variant for sidebars and lists (Ecofine recent-post widget). */
export function ArticleRow({ article }: { article: Article }) {
  return (
    <article className="group relative flex gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[10px] bg-ink-100">
        {article.image && <img src={asset(article.image)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[2px] text-brand-600">{seriesLabel[article.series]}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-6 text-ink-900 transition group-hover:text-brand-600">
          <Link to={articlePath(article)} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-ink-500">{joinNames(article.authors)}</p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ Service-style card (Ecofine "service three", style two)
   White top with a round icon that spins and fills on hover, photo underneath
   with a "Read More" button that fades in. Used for domains and programmes. */
function ServiceCard({ to, title, text, icon, image, kicker }: { to: string; title: string; text?: string | null; icon: string; image: string | null; kicker?: string }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-eco bg-white text-center shadow-card">
      <div className="flex flex-1 flex-col items-center px-7 pb-9 pt-11">
        <span className="mb-7 grid h-[100px] w-[100px] place-items-center rounded-full bg-brand-50 text-brand-600 transition duration-500 group-hover:rotate-[360deg] group-hover:bg-brand-600 group-hover:text-white">
          <Icon name={icon} className="h-11 w-11" strokeWidth={1.4} />
        </span>
        {kicker && <p className="mb-1 text-xs font-bold uppercase tracking-[2px] text-brand-600">{kicker}</p>}
        <h3 className="text-[20px] font-bold leading-[27px] text-ink-900 transition group-hover:text-brand-600">
          <Link to={to} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        {text && <p className="mt-3 line-clamp-3 leading-[27px] text-ink-500">{text}</p>}
      </div>
      <div className="relative h-44 overflow-hidden bg-brand-900">
        {image && <img src={asset(image)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-ink-950/0 transition group-hover:bg-ink-950/40" />
        <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 scale-90 items-center gap-2 rounded-[5px] bg-brand-600 px-6 py-3 text-sm font-bold text-white opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100">
          Read More <ChevronsRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ Domain */
export function DomainCard({ domain, variant = 'image' }: { domain: Domain; variant?: 'image' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <article className="group relative flex h-full items-start gap-4 rounded-eco border border-ink-200 bg-white p-5 transition duration-300 hover:border-transparent hover:shadow-lift">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition duration-500 group-hover:rotate-[360deg] group-hover:bg-brand-600 group-hover:text-white">
          <Icon name={domain.icon} className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold leading-6 text-ink-900 transition group-hover:text-brand-600">
            <Link to={`/domains/${domain.slug}`} className="after:absolute after:inset-0">
              {domain.title}
            </Link>
          </h3>
          {domain.tagline && <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink-500">{domain.tagline}</p>}
        </div>
      </article>
    );
  }
  return <ServiceCard to={`/domains/${domain.slug}`} title={domain.title} text={domain.tagline} icon={domain.icon} image={domain.image} kicker={domain.category} />;
}

/* ------------------------------------------------------------------ Program */
export function ProgramCard({ program }: { program: Program; index?: number }) {
  return <ServiceCard to={`/programs/${program.slug}`} title={program.title} text={program.summary} icon={program.icon} image={program.image} />;
}

/* ------------------------------------------------------------------ Person (Ecofine "team two") */
export function Avatar({ person, className }: { person: Pick<Person, 'name' | 'photo'>; className?: string }) {
  return person.photo ? (
    <img src={asset(person.photo)} alt="" loading="lazy" className={cn('object-cover', className)} />
  ) : (
    <span className={cn('grid place-items-center bg-brand-50 font-extrabold text-brand-600', className)}>{initials(person.name)}</span>
  );
}

export function PersonCard({ person }: { person: Person }) {
  return (
    <article className="group relative">
      <div className="aspect-[4/5] overflow-hidden rounded-eco bg-ink-100">
        <Avatar person={person} className="h-full w-full text-5xl transition duration-500 group-hover:scale-105" />
      </div>
      <div className="relative z-10 mx-5 -mt-16 rounded-[10px] bg-white px-4 py-4 text-center shadow-card transition duration-300 group-hover:bg-brand-600">
        <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 gap-1.5 opacity-0 transition duration-300 group-hover:opacity-100">
          {person.email && (
            <a href={`mailto:${person.email}`} className="relative z-20 grid h-9 w-9 place-items-center rounded-full bg-white text-brand-600 shadow" aria-label={`Email ${person.name}`}>
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
        <p className="line-clamp-1 text-[12px] font-semibold text-brand-600 transition group-hover:text-white/85">{person.role}</p>
        <h3 className="mt-0.5 text-lg font-extrabold text-ink-900 transition group-hover:text-white">
          <Link to={`/people/${person.slug}`} className="after:absolute after:inset-0 after:-top-[300px]">
            {person.name}
          </Link>
        </h3>
      </div>
    </article>
  );
}
