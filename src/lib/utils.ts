import { clsx, type ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

/** Resolve a public asset path against the deployment base (works for sub-path hosting). */
export function asset(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}

export const routerMode = import.meta.env.VITE_ROUTER ?? 'browser';
export const isHashRouter = routerMode === 'hash';

/** Convert an internal route into an href that works with the active router. */
export function hrefFor(to: string) {
  return isHashRouter ? `#${to}` : to;
}

export function formatDate(iso: string | null, opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }) {
  if (!iso) return null;
  return new Intl.DateTimeFormat('en-US', { ...opts, timeZone: 'UTC' }).format(new Date(iso));
}

export function joinNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export function initials(name: string) {
  return name
    .replace(/^(Dr|MD)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
