'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import type { SearchEntry } from '@/lib/site-data';
import { VIDEO_SOURCES } from '@/lib/video-sources';
import { mergeSearchIndex, type SearchExtra } from '@/lib/search';

interface SearchIndexState { entries: SearchEntry[]; loading: boolean; error: boolean; videoPartial: boolean; load: () => void; retryVideos: () => void }
const SearchIndexContext = createContext<SearchIndexState>({ entries: [], loading: false, error: false, videoPartial: false, load: () => {}, retryVideos: () => {} });

export function SearchIndexProvider({ children, showRelease, showAkademi }: { children: ReactNode; showRelease: boolean; showAkademi: boolean }) {
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [videoPartial, setVideoPartial] = useState(false);
  const pending = useRef(false);
  const retryVideos = useCallback(() => {
    fetch('/api/search-video-sources', { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error('Video source index unavailable');
      return response.json() as Promise<{ entries: SearchEntry[]; partial: boolean }>;
    }).then(({ entries: updated, partial }) => {
      const paths = new Set(updated.map((entry) => entry.path));
      setEntries((current) => [...current.filter((entry) => !paths.has(entry.path)), ...updated]);
      setVideoPartial(partial);
    }).catch(() => setVideoPartial(true));
  }, []);
  const load = useCallback(() => {
    if (entries.length || pending.current) return;
    pending.current = true;
    setLoading(true);
    setError(false);
    Promise.all([
      import('@/data/search-index.json'),
      showRelease ? import('@/data/search-release-index.json') : Promise.resolve(null),
      import('@/data/search-extra-index.json'),
      // Akademi lessons join the index only while the Akademi is enabled (never leaks when off).
      showAkademi ? import('@/data/search-akademi-index.json') : Promise.resolve(null)
    ]).then(([baseModule, releaseModule, extraModule, akademiModule]) => {
      const videoSources = Object.entries(VIDEO_SOURCES).map(([slug, source]) => ({
        path: `/video-kutuphanesi/kaynak/${slug}`, title: source.title,
        seoTitle: `${source.title} | Video Kütüphanesi | Aluplan`, section: 'Video',
        description: source.description, keywords: ''
      }));
      const base = baseModule.default as SearchEntry[];
      const release = (releaseModule?.default ?? []) as SearchEntry[];
      const extras = extraModule.default as SearchExtra[];
      const enriched = mergeSearchIndex(base, release, extras, showRelease);
      const akademi = (akademiModule?.default ?? []) as SearchEntry[];
      setEntries([...enriched, ...videoSources, ...akademi]);
      retryVideos();
    }).catch(() => setError(true)).finally(() => {
      pending.current = false;
      setLoading(false);
    });
  }, [entries.length, showRelease, showAkademi, retryVideos]);
  return <SearchIndexContext.Provider value={{ entries, loading, error, videoPartial, load, retryVideos }}>{children}</SearchIndexContext.Provider>;
}

export function useSearchIndex(): SearchIndexState {
  return useContext(SearchIndexContext);
}
