'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AluIcon } from '@/components/ui/AluIcon';
import type { AluIconName } from '@/components/ui/AluIcon';
import type { getHomepageData } from '@/lib/site-data';
import { handleStructuredTabKey } from './structured-tab-key';
import styles from './DisciplineWorkflowSection.module.css';

type HomepageData = ReturnType<typeof getHomepageData>;
type Props = { id: string; roles: HomepageData['roles']; products: HomepageData['products']; releaseLabel: string; trialHref: string; productsHref: string };
const ROLE_ICONS: Record<string, AluIconName> = { architect: 'building-2', engineer: 'ruler', fabricator: 'boxes' };
const ROLE_ACCENTS: Record<string, string> = { architect: 'var(--role-architect)', engineer: 'var(--role-engineer)', fabricator: 'var(--role-fabricator)' };
export function DisciplineWorkflowSection({ id, roles, products, releaseLabel, trialHref, productsHref }: Props) {
  const [roleId, setRoleId] = useState(roles[0]?.id ?? '');
  const activeRole = roles.find(role => role.id === roleId) ?? roles[0];
  if (!activeRole) return null;
  return (
      <section
        id={id}
        className={`preview-section alu-pathway-section ${styles.section}`}
        aria-labelledby={`${id}-heading`}
        style={
          {
            '--role-accent': ROLE_ACCENTS[activeRole.id] || 'var(--role-architect)'
          } as React.CSSProperties
        }
      >
        {/* Dynamic Ambient Glow based on Active Role */}
        

        <div className="alu-container alu-stack alu-pathway-content" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className={styles.headerRow}>
          <div className="alu-pathway-header">
            <span className="preview-kicker">ROLÜNÜZÜ SEÇİN · ROL VE ÜRÜN MİMARİSİ</span>
            <h2 id={`${id}-heading`} className="alu-h1">
              Disiplininize Özel BIM İş Akışı
            </h2>
            <p className="alu-body preview-meta" style={{ maxWidth: 'var(--container-application-meta)' }}>
              Size en uygun iş akışını ve ürün paketini keşfedin. Seçtiğiniz disipline göre önerilen ALLPLAN paketleri aşağıda otomatik olarak öne çıkar.
            </p>
          </div>

          {/* Role Tabs (MİMAR / MÜHENDİS / PREKAST) */}
          <div className="alu-pathway-tabs" role="tablist" aria-orientation="vertical" aria-label="Rolünüzü seçin">
            {roles.map((role, rIdx) => {
              const isSelected = role.id === activeRole.id;
              const iconName = ROLE_ICONS[role.id] || 'layers';
              const roleColor = ROLE_ACCENTS[role.id] || 'var(--role-architect)';
              return (
                <button
                  key={role.id}
                  id={`${id}-tab-${role.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`${id}-panel`}
                  tabIndex={isSelected ? 0 : -1}
                  className={`alu-pathway-tab${isSelected ? ' alu-pathway-tab--active' : ''}`}
                  style={{ '--tab-accent': roleColor } as React.CSSProperties}
                  onClick={() => setRoleId(role.id)}
                  onKeyDown={(event) => handleStructuredTabKey(
                    event,
                    rIdx,
                    roles.length,
                    (nextIndex) => setRoleId(roles[nextIndex].id),
                    true
                  )}
                >
                  <span className="alu-pathway-tab__icon">
                    <AluIcon name={iconName} size="md" />
                  </span>
                  <span className="alu-pathway-tab__text">
                    <span className="alu-pathway-tab__kicker">0{rIdx + 1} · ROL</span>
                    <span className="alu-pathway-tab__label">{role.label}</span>
                  </span>
                  <span className="alu-pathway-tab__dot" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          </div>

          {/* Active Role Content (Split View with Smooth Keyed Entrance & Staggered Features) */}
          <div
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${activeRole.id}`}
            className="alu-pathway-split"
            aria-live="polite"
          >
            {/* Left: Animated Role Title, Description & CTA */}
            <div key={activeRole.id + '-text'} className="alu-pathway-split__left">
              <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-dense)' }}>
                <span className="alu-pathway-role-badge">
                  <AluIcon name={ROLE_ICONS[activeRole.id] || 'layers'} size="sm" />
                  <span>{activeRole.label} İŞ AKIŞI</span>
                </span>
                <span className="alu-caption">{releaseLabel}</span>
              </div>

              <h3 className="alu-pathway-split__title">{activeRole.title}</h3>

              <p className="alu-pathway-split__desc">{activeRole.description}</p>

              <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-wide)', paddingTop: 'var(--space-application-jsx-regular)' }}>
                <Link className="alu-pathway-cta" href={activeRole.href}>
                  <span>Bu Akışı Detaylı İncele</span>
                  <span className="alu-pathway-cta__arrow">
                    <AluIcon name="arrow-right" size="sm" />
                  </span>
                </Link>
                <a
                  className="alu-button alu-button--secondary alu-button--md"
                  href={trialHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Ücretsiz Dene</span>
                  <AluIcon name="external-link" size="sm" />
                </a>
              </div>
            </div>

            {/* Right: Staggered 2x2 Feature Cards + Role Visual Preview */}
            <div key={activeRole.id + '-right'} className="alu-pathway-split__right">
              <ul className={styles.featureList}>
                {activeRole.features.map((feature, index) => (
                  <li key={`${activeRole.id}-feature-${index}`}>
                    <AluIcon name="check" size="sm" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {activeRole.image && (
                <div className="alu-pathway-visual-frame">
                  <img src={activeRole.image} alt={`${activeRole.label} — ${activeRole.title}`} />
                  <div className="alu-pathway-visual-frame__caption">
                    <span>{activeRole.label} · {activeRole.title}</span>
                    <span>IFC 4.3 · OPENBIM</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 6 Permanent Products Showcase (Conditional Highlighting & Smooth Dimming) */}
          <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
            <div className="alu-cluster" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="alu-caption">
                SEÇİLİ ROL İÇİN ÖNERİLEN PAKETLER ({activeRole.label})
              </span>
              <Link className="alu-link alu-link--standalone" href={productsHref}>
                <span>Tüm Ürün Ailesi</span>
                <AluIcon name="arrow-right" size="sm" />
              </Link>
            </div>

            <div className={`alu-products-showcase ${styles.productsGrid}`}>
              {products.filter(product => product.relatedRoles.includes(activeRole.id)).map((product) => {
                const isHighlighted = product.relatedRoles.includes(activeRole.id);
                return (
                  <Link
                    key={product.id}
                    href={product.href}
                    className={`alu-product-card${
                      isHighlighted ? ' alu-product-card--highlighted' : ' alu-product-card--dimmed'
                    }`}
                  >
                    <div className="alu-product-card__body">
                      <div className="alu-product-card__top-row">
                        <span
                          className={`alu-product-card__status-dot${
                            isHighlighted ? ' alu-product-card__status-dot--active' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="alu-product-card__title">{product.title}</h3>
                      <p className="alu-product-card__desc">{product.description}</p>
                    </div>
                    <div className="alu-product-card__footer">
                      <span className="alu-product-card__cta">
                        <span>İncele</span>
                        <AluIcon name="arrow-right" size="sm" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

  );
}
