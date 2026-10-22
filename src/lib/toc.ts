import type { Block } from '@/content/types';
import { slugify, stripHtml } from './utils';

export const headingId = (text: string) => slugify(text).slice(0, 60);

/** Headings for an in-page table of contents. */
export function tocFrom(blocks: Block[]) {
  return blocks
    .filter((b): b is Extract<Block, { type: 'heading' }> => b.type === 'heading' && b.level === 2)
    .map((b) => ({ id: headingId(b.text), label: stripHtml(b.text) }));
}
