/** Rich-text block model. Inline `html` is pre-sanitised at import time and may
 * only contain <a>, <strong>, <em>, <sup>, <sub> and <br>. */
export type Block =
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'paragraph'; html: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; html: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

export type ArticleSeries = 'digest' | 'trove';

export interface Article {
  slug: string;
  series: ArticleSeries;
  title: string;
  subtitle: string | null;
  authors: string[];
  date: string | null;
  image: string | null;
  imageCaption: string | null;
  excerpt: string;
  readingMinutes: number;
  body: Block[];
  legacyUrl: string;
}

export type DomainCategory =
  | 'Climate & Energy'
  | 'Governance & Rights'
  | 'Finance & Trade'
  | 'Nature & Resources'
  | 'Sectors & Industries';

export interface Domain {
  slug: string;
  title: string;
  tagline: string | null;
  category: DomainCategory;
  icon: string;
  featured: boolean;
  image: string | null;
  summary: string;
  body: Block[];
  related: string[];
  legacyUrl: string;
}

export interface Program {
  slug: string;
  title: string;
  icon: string;
  image: string | null;
  summary: string;
  body: Block[];
  related: string[];
  legacyUrl: string;
}

export type TeamGroup = 'executive' | 'intern';

export interface Person {
  slug: string;
  name: string;
  role: string;
  group: TeamGroup;
  board: boolean;
  email: string | null;
  photo: string | null;
  bio: string[];
}

export interface NavItem {
  label: string;
  to: string;
  description?: string;
  children?: NavItem[];
}
