import type { SearchEntry } from './site-data';

export interface SearchExtra { path: string; keywords: string; releaseOnly?: boolean; legacyOnly?: boolean }

export function mergeSearchIndex(base: SearchEntry[], release: SearchEntry[], extras: SearchExtra[], showRelease: boolean): SearchEntry[] {
  const published = showRelease ? release : [];
  const releasePaths = new Set(published.map((entry) => entry.path));
  return [...base.filter((entry) => !releasePaths.has(entry.path) && !['/health', '/search'].includes(entry.path)), ...published].map((entry) => ({
    ...entry,
    keywords: [entry.keywords, ...extras.filter((extra) => extra.path === entry.path && (!extra.releaseOnly || showRelease) && (!extra.legacyOnly || !showRelease)).map((extra) => extra.keywords)].join(' ')
  }));
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}

export function searchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return entries;
  return entries.filter((entry) => {
    const content = normalize([entry.title, entry.seoTitle, entry.description, entry.path, entry.keywords].join(' '));
    return words.every((word) => content.includes(word));
  });
}
