import { describe, expect, it } from 'vitest';
import { articles, currentPeople, domains, people, programs, personForAuthor, getArticle, publicationSeries, seriesIssues } from '@/lib/content';
import { mainNav } from '@/content/site';
import { search } from '@/lib/search';
import { routes } from '@/router';

const routePaths = (routes[0].children ?? []).map((r) => r.path).filter(Boolean) as string[];

const matchesRoute = (path: string) =>
  routePaths.some((p) => {
    const re = new RegExp('^/' + p.replace(/:[^/]+/g, '[^/]+') + '$');
    return re.test(path.split('?')[0]);
  }) || path === '/';

describe('content integrity', () => {
  it('has unique slugs per collection', () => {
    for (const list of [articles, domains, programs, people]) {
      const slugs = list.map((x) => x.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('only links related articles that exist', () => {
    for (const item of [...domains, ...programs]) {
      for (const slug of item.related) expect(getArticle(slug), `${item.slug} -> ${slug}`).toBeDefined();
    }
  });

  it('every internal link inside rich text resolves to a route', () => {
    const blocks = [...articles, ...domains, ...programs].flatMap((x) => x.body);
    const html = blocks.flatMap((b) => ('html' in b ? [b.html] : 'items' in b ? b.items : []));
    const hrefs = html.flatMap((h) => [...h.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]));
    for (const href of hrefs) expect(matchesRoute(href), href).toBe(true);
  });

  it('contains no leftover placeholder text', () => {
    const all = JSON.stringify([articles, domains, programs, people]);
    expect(all).not.toMatch(/lorem ipsum/i);
  });

  it('maps article authors to team members', () => {
    expect(personForAuthor('Akinola Afolarin')?.slug).toBe('akinola-afolarin');
    expect(personForAuthor('Md. Mahamodul Hasan')?.slug).toBe('md-mahamodul-hasan');
  });

  it('keeps credits of former team members linked to their profiles', () => {
    expect(personForAuthor('Samuel Abdulkareem')?.former).toBe(true);
    expect(currentPeople.some((p) => p.former)).toBe(false);
  });

  it('every navigation link resolves to a route', () => {
    for (const item of mainNav.flatMap((i) => [i, ...(i.children ?? [])])) expect(matchesRoute(item.to), item.to).toBe(true);
  });
});

describe('publication series', () => {
  it('has unique slugs', () => {
    const slugs = publicationSeries.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('lists every discovered issue with a PDF, in order', () => {
    for (const s of publicationSeries) {
      const issues = seriesIssues(s.slug);
      expect(issues.every((i) => i.pdf)).toBe(true);
      expect(issues.map((i) => i.number)).toEqual([...issues.map((i) => i.number)].sort((a, b) => a - b));
    }
  });
  it('shows the introduction before issue 1', () => {
    const issues = seriesIssues('paris-agreement');
    if (issues.some((i) => i.number === 0)) expect(issues[0].number).toBe(0);
  });
});

describe('search', () => {
  it('finds domains, publications and people', () => {
    expect(search('net zero').some((r) => r.kind === 'Domain')).toBe(true);
    expect(search('green bonds').some((r) => r.kind === 'Publication')).toBe(true);
    expect(search('Tolani')[0]?.kind).toBe('Person');
    expect(search('Pianpian')).toEqual([]);
    expect(search('Priscilla').some((r) => r.kind === 'Person')).toBe(false);
  });
  it('returns nothing for an empty query', () => {
    expect(search('   ')).toEqual([]);
  });
});
