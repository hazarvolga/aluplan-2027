'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getHomepageData } from '@/lib/site-shared';
import { AluIcon } from '@/components/ui/AluIcon';
import type { AluIconName } from '@/components/ui/AluIcon';
import { handleStructuredTabKey } from './structured-tab-key';

const data = getHomepageData();
const services = data.services;
const serviceGroups = data.serviceGroups;
const serviceByName = new Map(services.map((service) => [service.title, service]));

export function ProfessionalServicesSection() {
  const [activeGroupIdx, setActiveGroupIdx] = useState<number>(0);
  const [showAllServices, setShowAllServices] = useState<boolean>(false);
  const visibleGroups = serviceGroups;
  const serviceCount = services.length;
  const safeGroupIdx = activeGroupIdx < visibleGroups.length ? activeGroupIdx : 0;
  const activeGroup = visibleGroups[safeGroupIdx];
  const allResourcesButtonLabel = showAllServices
    ? 'Kategori Görünümüne Dön'
    : `Tüm ${serviceCount} Kaynağı Tek Listede Aç`;
  const allResourcesHeading = `Tüm Hizmet ve Kaynak Dizini (${serviceCount}/${serviceCount})`;

  return (
    <section id="professional-services" className="preview-section preview-section--subtle" aria-labelledby="services-heading">
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <div className="preview-section-heading">
          <div className="alu-stack">
            <span className="preview-kicker">PROFESYONEL HİZMETLER VE DESTEK MERKEZİ</span>
            <h2 id="services-heading" className="alu-h1">
              Öğrenme, Teknik Destek ve Lisans Kaynakları
            </h2>
            <p className="alu-body preview-meta">
              {`Eğitim, Microsoft Teams canlı bağlantı ve allplan.net.tr/tr ticket platformu dahil ${serviceCount} profesyonel hizmet ve teknik kaynağa tek merkezden ulaşın.`}
            </p>
          </div>
          <button
            type="button"
            className="alu-button alu-button--secondary alu-button--md"
            onClick={() => setShowAllServices((prev) => !prev)}
          >
            <AluIcon name="layers" size="sm" />
            <span>{allResourcesButtonLabel}</span>
          </button>
        </div>

        <div className="alu-service-pills" role="tablist" aria-label="Hizmet kategorileri">
          {visibleGroups.map((group, idx) => (
            <button
              key={group.title}
              type="button"
              id={`services-tab-${idx}`}
              role="tab"
              aria-selected={safeGroupIdx === idx}
              aria-controls="services-panel"
              tabIndex={safeGroupIdx === idx ? 0 : -1}
              className={`alu-service-pill${safeGroupIdx === idx ? ' alu-service-pill--active' : ''}`}
              onClick={() => {
                setActiveGroupIdx(idx);
                setShowAllServices(false);
              }}
              onKeyDown={(event) => handleStructuredTabKey(
                event,
                idx,
                visibleGroups.length,
                (nextIndex) => {
                  setActiveGroupIdx(nextIndex);
                  setShowAllServices(false);
                }
              )}
            >
              <span>{group.title}</span>
              <span className="alu-service-pill__count">{group.serviceTitles.length}</span>
            </button>
          ))}
        </div>

        <div
          id="services-panel"
          className="alu-tabs__panel"
          role="tabpanel"
          aria-labelledby={`services-tab-${safeGroupIdx}`}
        >
          <div className="alu-services-grid">
            {activeGroup?.serviceTitles.map((serviceName) => {
              const item = serviceByName.get(serviceName);
              if (!item) return null;
              const isExternal = item.href.startsWith('http');
              return (
                <article key={item.title} className="alu-service-card">
                  <div className="alu-service-card__top">
                    <span className="alu-support-card__icon">
                      <AluIcon name={item.icon as AluIconName} size="md" />
                    </span>
                    <span className="alu-card__eyebrow">{activeGroup.title}</span>
                  </div>
                  <div className="alu-card__body">
                    <h3 className="alu-card__title">{item.title}</h3>
                    <p className="alu-body-sm">{item.description}</p>
                  </div>
                  <div className="alu-card__footer">
                    {isExternal ? (
                      <a
                        className="alu-button alu-button--secondary alu-button--sm"
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{item.cta}</span>
                        <AluIcon name="external-link" size="sm" />
                      </a>
                    ) : (
                      <Link className="alu-button alu-button--secondary alu-button--sm" href={item.href}>
                        <span>{item.cta}</span>
                        <AluIcon name="arrow-right" size="sm" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="alu-stack" style={{ display: showAllServices ? 'flex' : 'none' }}>
          <h3 className="alu-h3">{allResourcesHeading}</h3>
          {visibleGroups.map((group) => (
            <div key={group.title} className="alu-stack" style={{ gap: 'var(--space-stack-md)', paddingTop: 'var(--space-application-jsx-section)' }}>
              <div className="alu-cluster" style={{ justifyContent: 'space-between', borderBottom: 'var(--border-width-default) solid var(--border-default)', paddingBottom: 'var(--space-application-jsx-regular)' }}>
                <span className="alu-h4">{group.title}</span>
                <span className="alu-badge">{group.serviceTitles.length} kayıt</span>
              </div>
              <div className="alu-services-grid">
                {group.serviceTitles.map((serviceName) => {
                  const item = serviceByName.get(serviceName);
                  if (!item) return null;
                  const isExternal = item.href.startsWith('http');
                  return (
                    <article key={`all-${item.title}`} className="alu-service-card">
                      <div className="alu-service-card__top">
                        <span className="alu-support-card__icon">
                          <AluIcon name={item.icon as AluIconName} size="md" />
                        </span>
                        <span className="alu-card__eyebrow">{group.title}</span>
                      </div>
                      <div className="alu-card__body">
                        <h4 className="alu-card__title">{item.title}</h4>
                        <p className="alu-body-sm">{item.description}</p>
                      </div>
                      <div className="alu-card__footer">
                        {isExternal ? (
                          <a
                            className="alu-link alu-link--standalone"
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{item.cta}</span>
                            <AluIcon name="external-link" size="sm" />
                          </a>
                        ) : (
                          <Link className="alu-link alu-link--standalone" href={item.href}>
                            <span>{item.cta}</span>
                            <AluIcon name="arrow-right" size="sm" />
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
