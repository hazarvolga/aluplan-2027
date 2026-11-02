'use client';

import type { ReactElement } from 'react';
import type { StructuredReferencesDirectory } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { DirectoryCategoryIcon } from './DirectoryCategoryIcon';
import { handleStructuredTabKey } from './structured-tab-key';

interface ReferencesDirectorySectionProps {
  directory: StructuredReferencesDirectory;
  activeCategoryId: string;
  searchQuery: string;
  onCategoryChange: (categoryId: string) => void;
  onSearchQueryChange: (query: string) => void;
}

export function ReferencesDirectorySection({
  directory,
  activeCategoryId,
  searchQuery,
  onCategoryChange,
  onSearchQueryChange
}: ReferencesDirectorySectionProps): ReactElement {
  const q = searchQuery.trim().toLowerCase();
  const filteredRefs = directory.items.filter((item) => {
    const matchesCategory =
      activeCategoryId === 'all' || item.category === activeCategoryId;
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
  const activeCatObj =
    directory.categories.find((category) => category.id === activeCategoryId) ||
    directory.categories[0];
  const activeCategoryIndex = Math.max(
    directory.categories.findIndex((category) => category.id === activeCategoryId),
    0
  );

  return (
    <section className="preview-section" aria-label={directory.title}>
      <div
        className="alu-container alu-stack"
        style={{ gap: 'var(--space-stack-xl)' }}
      >
        <div className="alu-section-header-center">
          {directory.kicker && (
            <span className="preview-kicker">{directory.kicker}</span>
          )}
          <h1 className="alu-h1" style={{ margin: 0 }}>
            {directory.title}
          </h1>
          {directory.subtitle && (
            <p
              className="alu-body preview-meta"
              style={{ margin: 0, maxWidth: 'var(--container-application-prose-wide)' }}
            >
              {directory.subtitle}
            </p>
          )}
        </div>

        <div className="alu-ref-controls">
          <div
            className="alu-ref-tabs"
            role="tablist"
            aria-label="Referans Kategorileri"
          >
            {directory.categories.map((category, categoryIndex) => {
              const isActive = category.id === activeCategoryId;
              return (
                <button
                  key={category.id}
                  type="button"
                  id={`references-tab-${categoryIndex}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="references-panel"
                  tabIndex={isActive ? 0 : -1}
                  className={`alu-ref-tab${
                    isActive ? ' alu-ref-tab--active' : ''
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                  onKeyDown={(event) => handleStructuredTabKey(
                    event,
                    categoryIndex,
                    directory.categories.length,
                    (nextIndex) => onCategoryChange(directory.categories[nextIndex].id)
                  )}
                >
                  <span className="alu-ref-tab__icon">
                    <DirectoryCategoryIcon name={category.iconName} />
                  </span>
                  <span className="alu-ref-tab__label">{category.label}</span>
                  <span className="alu-ref-tab__count">{category.count}</span>
                </button>
              );
            })}
          </div>

          <div className="alu-ref-toolbar">
            <div className="alu-ref-search">
              <AluIcon name="search" size="sm" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder="Referans kurum, firma veya üniversite ara..."
                aria-label="Referans kurum ara"
                className="alu-ref-search__input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="alu-ref-search__clear"
                  onClick={() => onSearchQueryChange('')}
                  aria-label="Aramayı temizle"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="alu-ref-status">
              <span className="alu-badge alu-badge--accent">
                {activeCatObj?.label || 'Tümü'}
              </span>
              <span className="alu-caption">
                Toplam <strong>{filteredRefs.length}</strong> referans gösteriliyor
              </span>
            </div>
          </div>
        </div>

        {filteredRefs.length > 0 ? (
          <div
            id="references-panel"
            className="alu-ref-grid"
            role="tabpanel"
            aria-labelledby={`references-tab-${activeCategoryIndex}`}
          >
            {filteredRefs.map((item, referenceIndex) => (
              <article
                key={`${item.category}-${item.name}-${referenceIndex}`}
                className="alu-ref-card"
              >
                <div className="alu-ref-card__icon" aria-hidden="true">
                  <DirectoryCategoryIcon name={item.iconName} />
                </div>
                <div className="alu-ref-card__body">
                  <h3 className="alu-ref-card__name">{item.name}</h3>
                  <span className="alu-ref-card__cat">{item.category}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            id="references-panel"
            className="alu-service-card alu-stack"
            role="tabpanel"
            aria-labelledby={`references-tab-${activeCategoryIndex}`}
            style={{ textAlign: 'center', padding: 'var(--space-application-jsx-empty-state-block) var(--space-application-jsx-section-inset)' }}
          >
            <p className="alu-h3" style={{ margin: 0 }}>
              Arama kriterlerinize uygun referans bulunamadı.
            </p>
            <div>
              <button
                type="button"
                className="alu-button alu-button--secondary alu-button--sm"
                onClick={() => {
                  onCategoryChange('all');
                  onSearchQueryChange('');
                }}
              >
                Tüm Referansları Göster ({directory.items.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
