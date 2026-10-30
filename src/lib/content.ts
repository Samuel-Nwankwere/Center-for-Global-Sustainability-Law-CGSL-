import articlesData from '@/content/generated/articles.json';
import domainsData from '@/content/generated/domains.json';
import programsData from '@/content/generated/programs.json';
import peopleData from '@/content/generated/people.json';
import imagesData from '@/content/generated/images.json';
import { publicationSeries } from '@/content/series';
import type { Article, ArticleSeries, Domain, DomainCategory, Person, Program, SeriesIssue } from '@/content/types';

/**
 * Single access point for site content. Today it reads JSON generated from the
 * legacy WordPress site; swapping in a headless CMS only means changing this file.
 */

export const articles = articlesData as Article[];
export const domains = domainsData as Domain[];
export const programs = programsData as Program[];
export const people = peopleData as Person[];
export const images = imagesData as Record<string, string>;

/** Team members currently at CGSL (former members keep their profile pages for author credits). */
export const currentPeople = people.filter((p) => !p.former);

export const domainCategories: DomainCategory[] = [
  'Climate & Energy',
  'Governance & Rights',
  'Finance & Trade',
  'Nature & Resources',
  'Sectors & Industries',
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const getDomain = (slug: string) => domains.find((d) => d.slug === slug);
export const getProgram = (slug: string) => programs.find((p) => p.slug === slug);
export const getPerson = (slug: string) => people.find((p) => p.slug === slug);

export const articlesBySeries = (series: ArticleSeries) => articles.filter((a) => a.series === series);

export const featuredDomains = () => domains.filter((d) => d.featured);

export const articlePath = (a: Pick<Article, 'series' | 'slug'>) => `/publications/${a.series}/${a.slug}`;

export const seriesLabel: Record<ArticleSeries, string> = {
  digest: 'LeGsus Digest',
  trove: 'LeGsus Trove',
};

/* ------------------------------------------------------------------ Publication series (PDF carousels)
   Files are discovered from `src/assets/series/<slug>/`: an optional `intro.pdf`
   (shown first) and `issue-N.pdf`, each with an optional `.webp` cover of the
   same name. Only URLs are imported; PDFs load when a reader opens them. */
const seriesFiles = import.meta.glob('/src/assets/series/*/{intro,issue-*}.{pdf,webp}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

export { publicationSeries };
export const getSeries = (slug: string) => publicationSeries.find((s) => s.slug === slug);

/** Issues of a series in reading order; the introduction, if any, is number 0. */
export function seriesIssues(slug: string): SeriesIssue[] {
  const titles = getSeries(slug)?.issueTitles ?? {};
  const file = (n: number, ext: string) => seriesFiles[`/src/assets/series/${slug}/${n === 0 ? 'intro' : `issue-${n}`}.${ext}`] ?? null;
  return Object.keys(seriesFiles)
    .map((path) => path.match(new RegExp(`^/src/assets/series/${slug}/(?:intro|issue-(\\d+))\\.pdf$`)))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => (m[1] ? Number(m[1]) : 0))
    .sort((a, b) => a - b)
    .map((n) => ({ number: n, title: titles[n] ?? null, pdf: file(n, 'pdf')!, cover: file(n, 'webp') }));
}

/** Domains and programmes that link to a given article. */
export function topicsForArticle(slug: string) {
  return [
    ...programs.filter((p) => p.related.includes(slug)).map((p) => ({ label: p.title, to: `/programs/${p.slug}` })),
    ...domains.filter((d) => d.related.includes(slug)).map((d) => ({ label: d.title, to: `/domains/${d.slug}` })),
  ];
}

/** Find the team member whose name matches an article author, if any. */
export function personForAuthor(author: string) {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/^(dr|md)\.?\s+/g, '')
      .replace(/[^a-z ]/g, '')
      .split(' ')
      .filter(Boolean)
      .sort()
      .join(' ');
  const target = norm(author);
  return people.find((p) => norm(p.name) === target);
}
