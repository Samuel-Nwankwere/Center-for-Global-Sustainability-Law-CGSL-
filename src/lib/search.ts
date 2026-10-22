import { articles, articlePath, domains, people, programs, seriesLabel } from './content';
import { mainNav } from '@/content/site';

export interface SearchItem {
  title: string;
  to: string;
  kind: 'Page' | 'Domain' | 'Program' | 'Publication' | 'Person';
  meta?: string;
  text: string;
}

const pages: SearchItem[] = mainNav.flatMap((n) =>
  (n.children ?? [n]).map((c) => ({ title: c.label, to: c.to, kind: 'Page' as const, meta: c.description, text: c.description ?? '' })),
);

export const searchIndex: SearchItem[] = [
  ...pages,
  ...domains.map((d) => ({ title: d.title, to: `/domains/${d.slug}`, kind: 'Domain' as const, meta: d.category, text: `${d.tagline ?? ''} ${d.summary}` })),
  ...programs.map((p) => ({ title: p.title, to: `/programs/${p.slug}`, kind: 'Program' as const, meta: 'Program', text: p.summary })),
  ...articles.map((a) => ({
    title: a.title,
    to: articlePath(a),
    kind: 'Publication' as const,
    meta: seriesLabel[a.series],
    text: `${a.subtitle ?? ''} ${a.authors.join(' ')} ${a.excerpt}`,
  })),
  ...people.map((p) => ({ title: p.name, to: `/people/${p.slug}`, kind: 'Person' as const, meta: p.role, text: p.role })),
];

const normalize = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

/** Simple weighted search: every query term must match; title hits rank higher. */
export function search(query: string, limit = 12): SearchItem[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return searchIndex
    .map((item) => {
      const title = normalize(item.title);
      const hay = `${title} ${normalize(item.meta ?? '')} ${normalize(item.text)}`;
      if (!terms.every((t) => hay.includes(t))) return null;
      const score = terms.reduce((s, t) => s + (title.startsWith(t) ? 6 : title.includes(t) ? 3 : 1), 0);
      return { item, score };
    })
    .filter((r): r is { item: SearchItem; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}
