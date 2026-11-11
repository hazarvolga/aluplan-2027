'use client';

import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchIndex } from './SearchIndexProvider';
import { rankSearchEntries, type SearchScope } from '@/lib/search';
import { AluIcon } from '@/components/ui/AluIcon';
import { MediaDialog } from '@/components/ui/MediaDialog';

const EMPTY_QUERY_LIMIT = 8;
const SCOPES: readonly { value: SearchScope; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'akademi', label: 'Akademi' },
  { value: 'site', label: 'Site' },
];

interface SearchDialogProps {
  /** Scope the dialog opens with: the main site searches everything, the Akademi its lessons. */
  defaultScope: SearchScope;
  /** Renders the button (or any control) that opens the dialog. */
  trigger: (open: () => void) => ReactNode;
}

/**
 * Site search shared by the main site and the Akademi: Ctrl/Cmd+K toggles it, results are
 * ranked (title matches first) and can be scoped. Scope buttons appear only when Akademi
 * entries are in the index (i.e. while the Akademi is enabled).
 */
export function SearchDialog({ defaultScope, trigger }: SearchDialogProps): ReactElement {
  const { entries, loading, error, videoPartial, load, retryVideos } = useSearchIndex();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>(defaultScope);

  useEffect(() => {
    if (!open) return;
    setScope(defaultScope);
    load();
  }, [open, load, defaultScope]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Keep a single modal owner for focus and body scroll restoration.
        if (document.querySelector('dialog.alu-video-modal:modal')) return;
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const hasAkademi = entries.some((entry) => entry.section === 'Akademi');
  const activeScope: SearchScope = hasAkademi ? scope : 'all';
  const ranked = rankSearchEntries(entries, query, activeScope);
  const results = query.trim() ? ranked : ranked.slice(0, EMPTY_QUERY_LIMIT);
  const close = () => setOpen(false);

  return (
    <>
      {trigger(() => setOpen(true))}
      {open && (
        <MediaDialog className="alu-modal-backdrop" label="Site içi arama" onClose={close}>
          <div className="alu-modal alu-stack">
            <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
              <h2 className="alu-h3" style={{ margin: 0 }}>
                Ürün, Çözüm ve Eğitim Arama
              </h2>
              <button type="button" className="alu-button alu-button--ghost alu-button--sm" onClick={close}>
                <AluIcon name="x" size="sm" />
                <span>Kapat (ESC)</span>
              </button>
            </div>
            <input
              type="search"
              className="alu-input"
              placeholder="ALLPLAN, lejant, donatı, köprü, prekast, video ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Site içinde ara"
              data-media-dialog-initial-focus
            />
            {hasAkademi && (
              <div className="alu-cluster" role="group" aria-label="Arama kapsamı" style={{ gap: 'var(--space-application-jsx-tight)' }}>
                {SCOPES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`alu-button alu-button--sm ${activeScope === item.value ? 'alu-button--primary' : 'alu-button--ghost'}`}
                    aria-pressed={activeScope === item.value}
                    onClick={() => setScope(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
            <div className="alu-stack" style={{ gap: 'var(--space-application-jsx-regular)', maxHeight: 'var(--layout-application-utility-panel-max-height)', overflowY: 'auto' }}>
              {loading && <p role="status">Arama hazırlanıyor…</p>}
              {error && <button type="button" onClick={load}>Arama yüklenemedi. Tekrar dene</button>}
              {videoPartial && <p role="status">Bazı güncel video başlıkları şu anda aranamayabilir. <button type="button" onClick={retryVideos}>Tekrar dene</button></p>}
              <p className="alu-caption" aria-live="polite" style={{ margin: 0 }}>
                {!loading && !error && query.trim() ? (results.length ? `${results.length} sonuç` : 'Sonuç bulunamadı.') : ''}
              </p>
              {results.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="alu-card"
                  style={{ padding: 'var(--space-application-jsx-comfortable) var(--space-application-jsx-section)', textDecoration: 'none' }}
                  onClick={close}
                >
                  <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong>
                    <span className="alu-badge">{item.section.toLocaleUpperCase('tr-TR')}</span>
                  </div>
                  <p className="alu-caption" style={{ margin: 'var(--space-application-jsx-tight) 0 0 0' }}>
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </MediaDialog>
      )}
    </>
  );
}
