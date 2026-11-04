import type { PageRecord } from './site-data';

/** Restore complete source text when an older generated description ends at 155 characters. */
export function metadataDescription(page: Pick<PageRecord, 'h1' | 'description' | 'bodyNodes'>): string {
  const prefix = `${page.h1}: `;
  if (!page.description.startsWith(prefix)) return page.description;

  const excerpt = page.description.slice(prefix.length);
  if (excerpt.length !== 155) return page.description;

  const paragraphs = page.bodyNodes.filter((node) => node.length > 35 && node !== page.h1);
  const original = paragraphs.slice(0, 2).join(' ');
  if (original.length <= excerpt.length || !original.startsWith(excerpt)) return page.description;

  // Preserve every character already present in the excerpt, including text from
  // the second paragraph when the first one ends before the original cutoff.
  const text = paragraphs[0].length >= excerpt.length ? paragraphs[0] : original;
  return `${prefix}${text}`;
}
