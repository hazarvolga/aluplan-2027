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

export type SearchScope = 'all' | 'akademi' | 'site';

const AKADEMI_SECTION = 'Akademi';
const TITLE_WEIGHT = 3;
const DESCRIPTION_WEIGHT = 2;
const OTHER_WEIGHT = 1;

function inScope(entry: SearchEntry, scope: SearchScope): boolean {
  if (scope === 'all') return true;
  const isAkademi = entry.section === AKADEMI_SECTION;
  return scope === 'akademi' ? isAkademi : !isAkademi;
}

/**
 * Every query word must match (as in searchEntries); each word scores by where it
 * matches: title > description > other fields. Ties keep the input order.
 */
export function rankSearchEntries(entries: SearchEntry[], query: string, scope: SearchScope = 'all'): SearchEntry[] {
  const scoped = entries.filter((entry) => inScope(entry, scope));
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return scoped;
  const scored = scoped.map((entry, index) => {
    const title = normalize(entry.title);
    const description = normalize(entry.description);
    const other = normalize([entry.seoTitle, entry.path, entry.keywords].join(' '));
    let score = 0;
    for (const word of words) {
      if (title.includes(word)) score += TITLE_WEIGHT;
      else if (description.includes(word)) score += DESCRIPTION_WEIGHT;
      else if (other.includes(word)) score += OTHER_WEIGHT;
      else return null;
    }
    return { entry, index, score };
  });
  return scored
    .filter((item): item is { entry: SearchEntry; index: number; score: number } => item !== null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.entry);
}
