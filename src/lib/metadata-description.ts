import type { PageRecord } from './site-data';

/** Restore complete source text when an older generated description ends at 155 characters. */
export function metadataDescription(page: Pick<PageRecord, 'h1' | 'description' | 'bodyNodes'> & Partial<Pick<PageRecord, 'path'>>): string {
  if (page.path === '/kvkk') {
    const index = page.bodyNodes.findIndex((node) => node.endsWith('(') && page.description.endsWith(node));
    const [company, conjunction, name, ending] = page.bodyNodes.slice(index + 1, index + 5);
    if (index >= 0 && company === '"Aluplan Bilgisayar"' && conjunction === 'veya' && name === '"Şirket"' && ending?.startsWith(') olarak,') && ending.endsWith('.')) {
      return `${page.description}${company} ${conjunction} ${name}${ending}`;
    }
  }
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
