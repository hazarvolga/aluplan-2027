'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getHomepageData, TRIAL_CTA_URL, MAIN_QUOTE_FORM_URL } from '@/lib/site-data';

const data = getHomepageData();

const HERO_TAGS = [
  'CLOUD NATIVE',
  'BIM LEVEL 3',
  'PARAMETRIC',
  'AUTOMATION',
  'INTEROPERABILITY',
  'AX3000',
  'PYTHONPARTS',
  'OPENBIM',
  'REAL-TIME',
  'PRECAST',
  'CIVIL',
  'BRIDGE',
  '@CONNECTION',
  'DATA_NODE'
];

const SERVICE_GROUPS: [string, string[]][] = [
  ['Öğren ve yardım al', ['Eğitim', 'Teknik Destek', 'Destek Platformu', 'Danışmanlık', 'Sertifika']],
  [
    'Yazılım ve lisans işlemleri',
    ['Download', 'Connect: Giriş', 'Admin Lisans : Lisans Yöneticisi Bilgi Formu', 'CodeMeter WebDepot', 'Deklarasyon Formu']
  ],
  [
    'Bilgi ve güncellemeler',
    [
      'ALLPLAN FAQ',
      'Blog Global',
      'Canlı Webinarlar',
      'BIM Rehberi',
      'OPENBIM',
      'Sistem Gereksinimleri',
      'Tüm Gereksinimler',
      'Sürüm Notları',
      'IFC Export El Kitabı'
    ]
  ],
  ['Partner erişimi', ['Partner']]
];

export function HomepageView() {
  const [roleId, setRoleId] = useState<string>(data.roles[0].id);
  const [activeGroupIdx, setActiveGroupIdx] = useState<number>(0);

  const activeRole = data.roles.find((r) => r.id === roleId) || data.roles[0];
  const serviceByName = new Map(data.services.map((s) => [s.title, s]));

  return (
    <>
      {/* H01: Hero */}
      <section className="preview-hero" aria-labelledby="hero-title">
        <div className="alu-container preview-hero__grid">
          <div className="alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
            <div className="alu-cluster">
              <span className="alu-badge alu-badge--accent">/ ALLPLAN 2026 · Giriş ve kimlik</span>
              <span className="alu-badge">1995&apos;ten beri Türkiye Distribütörü</span>
            </div>
            <h1 id="hero-title" className="alu-display preview-hero__title">
              DAHA İYİ BİR GELECEK İNŞA ETMEK İÇİN TASARLANDI
            </h1>
            <p className="alu-body-lg">
              Yenilikçi AEC iş akışları, otomasyon ve bulut tabanlı iş birliği ile daha başarılı projeler.
            </p>
            <div className="alu-cluster" role="group" aria-label="Ana eylemler">
              <a
                className="alu-button alu-button--primary alu-button--lg"
                href={MAIN_QUOTE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Teklif İste ↗
              </a>
              <a
                className="alu-button alu-button--secondary alu-button--lg"
                href={TRIAL_CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ücretsiz Deneme ↗
              </a>
            </div>
            <div className="alu-cluster" aria-label="Teknik yetenek etiketleri" style={{ gap: '0.375rem' }}>
              {HERO_TAGS.map((tag) => (
                <span key={tag} className="alu-badge">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="preview-hero__media" aria-label="Hero teknik özet alanı">
            <div className="preview-hero__mark" aria-hidden="true">
              ⌜
            </div>
            <p className="preview-kicker">Mimari · Mühendislik · İnşaat</p>
            <p className="alu-body-sm">
              ALLPLAN platformu, disiplinler arası BIM iş akışları ve yerel teknik destek için tek giriş noktası.
            </p>
            <div className="alu-cluster">
              <span className="alu-badge">29+ Yıllık Tecrübe</span>
              <span className="alu-badge">500+ Aktif Müşteri</span>
              <span className="alu-badge">50+ Uzman Kadro</span>
              <span className="alu-badge">10K+ Tamamlanan Proje</span>
            </div>
          </aside>
        </div>
      </section>

      {/* H02: QuickLinks */}
      <section className="preview-section--subtle" aria-label="Hızlı erişimler">
        <div className="alu-container preview-quicklinks">
          {data.quickLinks.map(([label, href]) => (
            <Link key={href} className="alu-button alu-button--ghost alu-button--sm" href={href}>
              {label} →
            </Link>
          ))}
        </div>
      </section>

      {/* H03: RoleSelector + 6 Permanent Products */}
      <section id="products" className="preview-section" aria-labelledby="products-heading">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="alu-stack">
            <span className="preview-kicker">Rol ve ürün seçimi</span>
            <h2 id="products-heading" className="alu-h1">
              Rolünüzü seçin
            </h2>
            <p className="alu-body preview-meta">
              Rol seçimi yönlendirmeyi değiştirir; altı ürün her seçimde görünür kalır.
            </p>
          </div>

          <div className="alu-role-selector" role="radiogroup" aria-label="Çalışma alanınız">
            {data.roles.map((role) => (
              <button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={role.id === activeRole.id}
                className="alu-role"
                onClick={() => setRoleId(role.id)}
              >
                <span className="alu-role__title">{role.label}</span>
                <span className="alu-role__desc">{role.title}</span>
              </button>
            ))}
          </div>

          <div className="preview-role-copy" aria-live="polite">
            <div className="alu-stack">
              <span className="alu-badge alu-badge--accent">{activeRole.label}</span>
              <h3 className="alu-h2">{activeRole.title}</h3>
              <p className="alu-body">{activeRole.description}</p>
              <div>
                <Link className="alu-button alu-button--secondary alu-button--md" href={activeRole.href}>
                  Bu akışı detaylı incele →
                </Link>
              </div>
            </div>
            <div className="alu-grid">
              {activeRole.features.map((feat) => (
                <article key={feat} className="alu-card">
                  <div className="alu-card__body">
                    <h4 className="alu-card__title">{feat}</h4>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="alu-grid">
            {data.products.map((product) => {
              const isRelated = product.relatedRoles.includes(activeRole.id);
              return (
                <div
                  key={product.id}
                  className={`preview-product${isRelated ? ' preview-product--related' : ''}`}
                >
                  <article className="alu-card">
                    <div className="alu-cluster">
                      <span className="alu-card__eyebrow">ALLPLAN</span>
                      {isRelated && <span className="alu-badge alu-badge--accent">İlgili yol</span>}
                    </div>
                    <div className="alu-card__body">
                      <h3 className="alu-card__title">{product.title}</h3>
                      <p className="alu-body-sm">{product.description}</p>
                    </div>
                    <div className="alu-card__footer">
                      <Link className="alu-link" href={product.href}>
                        Ürünü İncele →
                      </Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* H04: Solutions */}
      <section id="solutions" className="preview-section preview-section--subtle" aria-labelledby="solutions-heading">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="alu-stack">
            <span className="preview-kicker">Çözüm alanları</span>
            <h2 id="solutions-heading" className="alu-h1">
              Tek platform. Tüm disiplinler.
            </h2>
          </div>
          <div className="alu-grid">
            {data.solutions.map((item) => (
              <article key={item.href} className="alu-card">
                <span className="alu-card__eyebrow">{item.subtitle}</span>
                <div className="alu-card__body">
                  <h3 className="alu-card__title">{item.title}</h3>
                  <p className="alu-body-sm">{item.description}</p>
                </div>
                <div className="alu-card__footer">
                  <Link className="alu-link" href={item.href}>
                    {item.cta} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* H05: Package Comparison / TechSpecs */}
      <section id="package-comparison" className="preview-section" aria-labelledby="packages-heading">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="preview-section-heading">
            <div className="alu-stack">
              <span className="preview-kicker">{data.packageAccess.eyebrow}</span>
              <h2 id="packages-heading" className="alu-h1">
                {data.packageAccess.title}
              </h2>
              <p className="alu-body preview-meta">{data.packageAccess.description}</p>
            </div>
            <a
              className="alu-button alu-button--secondary alu-button--md"
              href={data.packageAccess.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.packageAccess.cta} ↗
            </a>
          </div>
          <div className="alu-grid preview-package-grid">
            {data.packages.map((pkg) => (
              <article key={pkg.id} className="alu-card">
                <span className="alu-card__eyebrow">PDF · TR</span>
                <div className="alu-card__body">
                  <h3 className="alu-card__title">{pkg.title}</h3>
                  <p className="alu-body-sm">{pkg.description}</p>
                </div>
                <div className="alu-card__footer">
                  <a
                    className="alu-link"
                    href={data.packageAccess.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Karşılaştırma Tablosunu İndir (PDF) ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* H06: Professional Services (20 items) */}
      <section id="professional-services" className="preview-section preview-section--subtle" aria-labelledby="services-heading">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="alu-stack">
            <span className="preview-kicker">Profesyonel hizmetler</span>
            <h2 id="services-heading" className="alu-h1">
              Öğrenme, destek ve bilgi kaynakları
            </h2>
            <p className="alu-body preview-meta">
              Eğitim, Teams desteği ve ticket platformu ilk görünümde; tüm 20 hizmet ve kaynak kaydı görevlerine göre gruplanır.
            </p>
          </div>

          <div>
            <div className="alu-tabs__list" role="tablist" aria-label="Hizmet kategorileri">
              {SERVICE_GROUPS.map(([groupTitle], idx) => (
                <button
                  key={groupTitle}
                  type="button"
                  role="tab"
                  aria-selected={activeGroupIdx === idx}
                  className="alu-tabs__tab"
                  onClick={() => setActiveGroupIdx(idx)}
                >
                  {groupTitle}
                </button>
              ))}
            </div>
            <div className="alu-tabs__panel">
              <div className="alu-grid preview-services-primary">
                {SERVICE_GROUPS[activeGroupIdx][1].map((serviceName) => {
                  const item = serviceByName.get(serviceName);
                  if (!item) return null;
                  const isExt = item.href.startsWith('http');
                  return (
                    <article key={item.title} className="alu-card">
                      <span className="alu-card__eyebrow">{SERVICE_GROUPS[activeGroupIdx][0]}</span>
                      <div className="alu-card__body">
                        <h3 className="alu-card__title">{item.title}</h3>
                        <p className="alu-body-sm">{item.description}</p>
                      </div>
                      <div className="alu-card__footer">
                        {isExt ? (
                          <a
                            className="alu-link"
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.cta} ↗
                          </a>
                        ) : (
                          <Link className="alu-link" href={item.href}>
                            {item.cta} →
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="alu-stack">
            <h3 className="alu-h3">Tüm Hizmet ve Kaynak Dizini (20/20)</h3>
            {SERVICE_GROUPS.map(([groupTitle, names], idx) => (
              <details key={groupTitle} className="preview-service-group" open={idx === 0}>
                <summary>
                  <span>{groupTitle}</span>
                  <span className="alu-caption">{names.length} kayıt</span>
                </summary>
                <div className="alu-grid" style={{ marginTop: 'var(--space-stack-md)' }}>
                  {names.map((name) => {
                    const item = serviceByName.get(name);
                    if (!item) return null;
                    const isExt = item.href.startsWith('http');
                    return (
                      <article key={`all-${item.title}`} className="alu-card">
                        <span className="alu-card__eyebrow">{groupTitle}</span>
                        <div className="alu-card__body">
                          <h4 className="alu-card__title">{item.title}</h4>
                          <p className="alu-body-sm">{item.description}</p>
                        </div>
                        <div className="alu-card__footer">
                          {isExt ? (
                            <a
                              className="alu-link"
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.cta} ↗
                            </a>
                          ) : (
                            <Link className="alu-link" href={item.href}>
                              {item.cta} →
                            </Link>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* H07: BIMFlex */}
      <section id="bimflex" className="preview-section" aria-labelledby="bimflex-heading">
        <div className="alu-container">
          <div className="preview-bimflex">
            <div className="alu-stack preview-bimflex__content" style={{ gap: 'var(--space-stack-lg)' }}>
              <div className="alu-cluster">
                <span className="alu-badge alu-badge--accent">{data.bimflex.eyebrow}</span>
                <span className="alu-badge">{data.bimflex.label}</span>
              </div>
              <img
                className="preview-bimflex__logo"
                src={data.bimflex.logo.src}
                alt={data.bimflex.logo.alt}
              />
              <h2 id="bimflex-heading" className="alu-h1">
                {data.bimflex.title}
              </h2>
              <h3 className="alu-h3">{data.bimflex.claim}</h3>
              <p className="alu-body">{data.bimflex.description}</p>
              <p className="alu-caption">{data.bimflex.relationship}</p>
              <div>
                <Link className="alu-button alu-button--primary alu-button--md" href={data.bimflex.href}>
                  {data.bimflex.cta} →
                </Link>
              </div>
            </div>
            <div className="preview-bimflex__media" aria-label="BIMFlex arayüz ve donatı görselleri">
              {data.bimflex.media.map((visual, index) => (
                <figure
                  key={visual.src}
                  className={`preview-bimflex__figure preview-bimflex__figure--${index + 1}`}
                >
                  <img src={visual.src} alt={visual.alt} loading="lazy" />
                  <figcaption>{visual.alt}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* H08: ALLPLAN 2026 Innovations */}
      <section id="innovations" className="preview-section preview-section--subtle" aria-labelledby="innovations-heading">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="preview-section-heading">
            <div className="alu-stack">
              <span className="preview-kicker">
                {data.innovationsMeta.eyebrow} · {data.innovationsMeta.version}
              </span>
              <h2 id="innovations-heading" className="alu-h1">
                {data.innovationsMeta.title}
              </h2>
              <p className="alu-body preview-meta">{data.innovationsMeta.description}</p>
            </div>
            <Link className="alu-button alu-button--secondary alu-button--md" href={data.innovationsMeta.href}>
              {data.innovationsMeta.cta} →
            </Link>
          </div>
          <div className="alu-grid preview-innovations-grid">
            {data.innovations.map((card) => (
              <article key={card.id} className="alu-card">
                <span className="alu-card__eyebrow">{card.badge}</span>
                <div className="alu-card__body">
                  <h3 className="alu-card__title">{card.title}</h3>
                  <p className="alu-body-sm">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
