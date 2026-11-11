'use client';

import Link from 'next/link';
import { useEffect, type ReactElement } from 'react';
import { getHomepageData } from '@/lib/site-shared';
import { useSearchIndex } from '@/components/shell/SearchIndexProvider';
import { rankSearchEntries } from '@/lib/search';
import { AluIcon } from '@/components/ui/AluIcon';

const homepageData = getHomepageData();

interface SearchPageSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchPageSection({
  query,
  onQueryChange
}: SearchPageSectionProps): ReactElement {
  const { entries: searchIndex, loading, error, videoPartial, load, retryVideos } = useSearchIndex();
  useEffect(() => { load(); }, [load]);
  const filteredResults = rankSearchEntries(searchIndex, query);

  return (
    <section className="preview-section" aria-labelledby="search-page-heading">
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
        <h2 id="search-page-heading" className="alu-h2">
          Tüm Sayfa, Ürün ve Çözümlerde Ara ({filteredResults.length} sonuç)
        </h2>
        {loading && <p role="status">Arama hazırlanıyor…</p>}
        {error && <button type="button" onClick={load}>Arama yüklenemedi. Tekrar dene</button>}
        {videoPartial && <p role="status">Bazı güncel video başlıkları şu anda aranamayabilir. <button type="button" onClick={retryVideos}>Tekrar dene</button></p>}
        {!loading && !error && query.trim() && filteredResults.length === 0 && <p role="status">Sonuç bulunamadı.</p>}
        <input
          type="search"
          className="alu-input"
          aria-label="Site içeriğinde ara"
          placeholder={`Anahtar kelime girin (örn. ${homepageData.releaseLabel}, AX3000, BIMFlex, Köprü, Prekast)...`}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <div className="alu-services-grid">
          {filteredResults.map((item) => (
            <article key={item.path} className="alu-service-card">
              <span className="alu-card__eyebrow">{item.section.toUpperCase()}</span>
              <div className="alu-card__body">
                <h3 className="alu-card__title">{item.title}</h3>
                <p className="alu-body-sm">{item.description}</p>
              </div>
              <div className="alu-card__footer">
                <Link className="alu-link alu-link--standalone" href={item.path} aria-label={`Sayfaya Git: ${item.seoTitle.replace(/ \| Aluplan$/, '')}`}>
                  <span>Sayfaya Git</span>
                  <AluIcon name="arrow-right" size="sm" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
