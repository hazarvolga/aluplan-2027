'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';
import { getHomepageData, getSearchIndex } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

const searchIndex = getSearchIndex();
const homepageData = getHomepageData();

interface SearchPageSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchPageSection({
  query,
  onQueryChange
}: SearchPageSectionProps): ReactElement {
  const filteredResults = query.trim()
    ? searchIndex.filter((item) => {
        const normalizedQuery = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.seoTitle.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.path.toLowerCase().includes(normalizedQuery) ||
          item.keywords.toLowerCase().includes(normalizedQuery)
        );
      })
    : searchIndex;

  return (
    <section className="preview-section" aria-labelledby="search-page-heading">
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
        <h2 id="search-page-heading" className="alu-h2">
          Tüm Sayfa, Ürün ve Çözümlerde Ara ({filteredResults.length} sonuç)
        </h2>
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
                <Link className="alu-link alu-link--standalone" href={item.path}>
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
