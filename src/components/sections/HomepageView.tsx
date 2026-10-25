'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getHomepageData, TRIAL_CTA_URL, MAIN_QUOTE_FORM_URL } from '@/lib/site-data';
import { AluIcon, AluIconName } from '@/components/ui/AluIcon';

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

const SERVICE_ICONS: Record<string, AluIconName> = {
  Eğitim: 'graduation-cap',
  'Teknik Destek': 'headset',
  'Destek Platformu': 'life-buoy',
  Danışmanlık: 'users',
  Sertifika: 'award',
  Download: 'download',
  'Connect: Giriş': 'key',
  'Admin Lisans : Lisans Yöneticisi Bilgi Formu': 'shield',
  'CodeMeter WebDepot': 'key',
  'Deklarasyon Formu': 'file-text',
  'ALLPLAN FAQ': 'help-circle',
  'Blog Global': 'globe',
  'Canlı Webinarlar': 'video',
  'BIM Rehberi': 'book-open',
  OPENBIM: 'boxes',
  'Sistem Gereksinimleri': 'cpu',
  'Tüm Gereksinimler': 'layers',
  'Sürüm Notları': 'sparkles',
  'IFC Export El Kitabı': 'file-text',
  Partner: 'users'
};

const ROLE_ICONS: Record<string, AluIconName> = {
  architect: 'building-2',
  engineer: 'ruler',
  fabricator: 'boxes'
};

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
                <span>Teklif İste</span>
                <AluIcon name="external-link" size="sm" />
              </a>
              <a
                className="alu-button alu-button--secondary alu-button--lg"
                href={TRIAL_CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Ücretsiz Deneme</span>
                <AluIcon name="external-link" size="sm" />
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

          <aside className="preview-hero__media" aria-label="Hero teknik özet ve BIM tanıtım videosu">
            {data.heroVideo && (
              <div className="preview-hero__video-wrap">
                <video
                  className="preview-hero__video"
                  src={data.heroVideo.src}
                  poster={data.heroVideo.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            )}
            <div className="alu-stack" style={{ gap: 'var(--space-stack-sm)', position: 'relative', zIndex: 1 }}>
              <p className="preview-kicker" style={{ margin: 0 }}>
                Mimari · Mühendislik · İnşaat
              </p>
              <p className="alu-body-sm">
                ALLPLAN platformu, disiplinler arası BIM iş akışları ve yerel teknik destek için tek giriş noktası.
              </p>
              <div className="alu-cluster" style={{ gap: '0.5rem' }}>
                <span className="alu-badge">29+ Yıllık Tecrübe</span>
                <span className="alu-badge">500+ Aktif Müşteri</span>
                <span className="alu-badge">50+ Uzman Kadro</span>
                <span className="alu-badge">10K+ Tamamlanan Proje</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* H02: QuickLinks */}
      <section className="preview-section--subtle" aria-label="Hızlı erişimler">
        <div className="alu-container preview-quicklinks">
          {data.quickLinks.map(([label, href]) => (
            <Link key={href} className="alu-button alu-button--ghost alu-button--sm" href={href}>
              <span>{label}</span>
              <AluIcon name="arrow-right" size="sm" />
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
            {data.roles.map((role) => {
              const isSelected = role.id === activeRole.id;
              const iconName = ROLE_ICONS[role.id] || 'layers';
              return (
                <button
                  key={role.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className="alu-role"
                  onClick={() => setRoleId(role.id)}
                >
                  <div className="alu-cluster" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <span className="alu-cluster" style={{ gap: '0.5rem' }}>
                      <span className="alu-role__icon">
                        <AluIcon name={iconName} size="md" />
                      </span>
                      <span className="alu-role__title">{role.label}</span>
                    </span>
                    {isSelected && (
                      <span className="alu-badge alu-badge--accent">
                        <AluIcon name="check" size="sm" />
                      </span>
                    )}
                  </div>
                  <span className="alu-role__desc">{role.title}</span>
                </button>
              );
            })}
          </div>

          <div className="preview-role-copy" aria-live="polite">
            <div className="alu-stack">
              <div className="alu-cluster">
                <span className="alu-badge alu-badge--accent">
                  <AluIcon name={ROLE_ICONS[activeRole.id] || 'layers'} size="sm" />
                  <span>{activeRole.label}</span>
                </span>
              </div>
              <h3 className="alu-h2">{activeRole.title}</h3>
              <p className="alu-body">{activeRole.description}</p>
              <div>
                <Link className="alu-button alu-button--secondary alu-button--md" href={activeRole.href}>
                  <span>Bu akışı detaylı incele</span>
                  <AluIcon name="arrow-right" size="sm" />
                </Link>
              </div>
            </div>
            <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
              {activeRole.image && (
                <div className="alu-card__media alu-card__media--hero">
                  <img src={activeRole.image} alt={activeRole.title} loading="lazy" />
                </div>
              )}
              <div className="alu-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))' }}>
                {activeRole.features.map((feat) => (
                  <article key={feat} className="alu-card">
                    <div className="alu-cluster" style={{ gap: '0.5rem' }}>
                      <span style={{ color: 'var(--accent-fg)' }}>
                        <AluIcon name="check" size="sm" />
                      </span>
                      <h4 className="alu-card__title" style={{ fontSize: 'var(--type-body-size)' }}>
                        {feat}
                      </h4>
                    </div>
                  </article>
                ))}
              </div>
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
                    {product.image && (
                      <div className="alu-card__media">
                        <img src={product.image} alt={product.title} loading="lazy" />
                      </div>
                    )}
                    <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                      <span className="alu-card__eyebrow">ALLPLAN</span>
                      {isRelated && (
                        <span className="alu-badge alu-badge--accent">
                          <AluIcon name="check" size="sm" />
                          <span>İlgili yol</span>
                        </span>
                      )}
                    </div>
                    <div className="alu-card__body">
                      <h3 className="alu-card__title">{product.title}</h3>
                      <p className="alu-body-sm">{product.description}</p>
                    </div>
                    <div className="alu-card__footer">
                      <Link className="alu-link alu-link--standalone" href={product.href}>
                        <span>Ürünü İncele</span>
                        <AluIcon name="arrow-right" size="sm" />
                      </Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* H04: Solutions (Bento Grid with Visuals) */}
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
                {item.image && (
                  <div className="alu-card__media">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                )}
                <span className="alu-card__eyebrow">{item.subtitle}</span>
                <div className="alu-card__body">
                  <h3 className="alu-card__title">{item.title}</h3>
                  <p className="alu-body-sm">{item.description}</p>
                </div>
                <div className="alu-card__footer">
                  <Link className="alu-link alu-link--standalone" href={item.href}>
                    <span>{item.cta}</span>
                    <AluIcon name="arrow-right" size="sm" />
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
              <AluIcon name="download" size="sm" />
              <span>{data.packageAccess.cta}</span>
            </a>
          </div>
          <div className="alu-grid preview-package-grid">
            {data.packages.map((pkg) => (
              <article key={pkg.id} className="alu-card">
                <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                  <span className="alu-card__eyebrow">PDF · TR</span>
                  <span className="alu-badge">
                    <AluIcon name="file-text" size="sm" />
                    <span>V2026</span>
                  </span>
                </div>
                <div className="alu-card__body">
                  <h3 className="alu-card__title">{pkg.title}</h3>
                  <p className="alu-body-sm">{pkg.description}</p>
                </div>
                <div className="alu-card__footer">
                  <a
                    className="alu-link alu-link--standalone"
                    href={data.packageAccess.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AluIcon name="download" size="sm" />
                    <span>Karşılaştırma Tablosunu İndir (PDF)</span>
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
                  const iconName = SERVICE_ICONS[item.title] || 'layers';
                  return (
                    <article key={item.title} className="alu-card">
                      <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                        <span className="alu-support-card__icon">
                          <AluIcon name={iconName} size="md" />
                        </span>
                        <span className="alu-card__eyebrow">{SERVICE_GROUPS[activeGroupIdx][0]}</span>
                      </div>
                      <div className="alu-card__body">
                        <h3 className="alu-card__title">{item.title}</h3>
                        <p className="alu-body-sm">{item.description}</p>
                      </div>
                      <div className="alu-card__footer">
                        {isExt ? (
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
                    const iconName = SERVICE_ICONS[item.title] || 'layers';
                    return (
                      <article key={`all-${item.title}`} className="alu-card">
                        <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                          <span className="alu-support-card__icon">
                            <AluIcon name={iconName} size="md" />
                          </span>
                          <span className="alu-card__eyebrow">{groupTitle}</span>
                        </div>
                        <div className="alu-card__body">
                          <h4 className="alu-card__title">{item.title}</h4>
                          <p className="alu-body-sm">{item.description}</p>
                        </div>
                        <div className="alu-card__footer">
                          {isExt ? (
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
                  <span>{data.bimflex.cta}</span>
                  <AluIcon name="arrow-right" size="sm" />
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
              <span>{data.innovationsMeta.cta}</span>
              <AluIcon name="arrow-right" size="sm" />
            </Link>
          </div>
          <div className="alu-grid preview-innovations-grid">
            {data.innovations.map((card) => (
              <article key={card.id} className="alu-card">
                {card.image && (
                  <div className="alu-card__media">
                    <img src={card.image} alt={card.title} loading="lazy" />
                  </div>
                )}
                <div className="alu-cluster">
                  <span className="alu-badge alu-badge--accent">
                    <AluIcon name="sparkles" size="sm" />
                    <span>{card.badge}</span>
                  </span>
                </div>
                <div className="alu-card__body">
                  <h3 className="alu-card__title">{card.title}</h3>
                  <p className="alu-body-sm">{card.description}</p>
                </div>
              </article>
            ))}
          </div>

          {/* OpenBIM & Technology Partners Strip */}
          {data.partners && data.partners.length > 0 && (
            <div className="alu-partner-strip" aria-label="Teknoloji ve OpenBIM İş Ortakları">
              <span className="preview-kicker">OPENBIM VE TEKNOLOJİ EKOSİSTEMİ</span>
              <div className="alu-partner-strip__grid">
                {data.partners.map((partner) => (
                  <div key={partner.name} className="alu-partner-strip__item" title={partner.name}>
                    <img src={partner.logo} alt={partner.name} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
