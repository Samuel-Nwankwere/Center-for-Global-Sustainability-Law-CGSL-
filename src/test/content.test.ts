import { describe, expect, it } from 'vitest';
import { articles, domains, people, programs, personForAuthor, getArticle } from '@/lib/content';
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
});

describe('search', () => {
  it('finds domains, publications and people', () => {
    expect(search('net zero').some((r) => r.kind === 'Domain')).toBe(true);
    expect(search('green bonds').some((r) => r.kind === 'Publication')).toBe(true);
    expect(search('Pianpian')[0]?.kind).toBe('Person');
  });
  it('returns nothing for an empty query', () => {
    expect(search('   ')).toEqual([]);
  });
});
