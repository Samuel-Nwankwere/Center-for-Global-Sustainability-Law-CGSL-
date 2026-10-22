import articlesData from '@/content/generated/articles.json';
import domainsData from '@/content/generated/domains.json';
import programsData from '@/content/generated/programs.json';
import peopleData from '@/content/generated/people.json';
import imagesData from '@/content/generated/images.json';
import type { Article, ArticleSeries, Domain, DomainCategory, Person, Program } from '@/content/types';

/**
 * Single access point for site content. Today it reads JSON generated from the
 * legacy WordPress site; swapping in a headless CMS only means changing this file.
 */

export const articles = articlesData as Article[];
export const domains = domainsData as Domain[];
export const programs = programsData as Program[];
export const people = peopleData as Person[];
export const images = imagesData as Record<string, string>;

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
