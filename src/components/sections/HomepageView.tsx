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
  'Teknik Destek': 'life-buoy',
  'Destek Platformu': 'life-buoy',
  Danışmanlık: 'users',
  Sertifika: 'award',
  Download: 'download',
  'Connect: Giriş': 'key',
  'Admin Lisans : Lisans Yöneticisi Bilgi Formu': 'shield',
  'CodeMeter WebDepot': 'key',
  'Deklarasyon Formu': 'file-text',
  'ALLPLAN FAQ': 'circle-help',
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

const ROLE_ACCENTS: Record<string, string> = {
  architect: '#3B82F6', // MİMAR — Blue
  engineer: '#10B981',  // MÜHENDİS — Emerald
  fabricator: '#F59E0B' // PREKAST — Amber
};

export function HomepageView() {
  const [roleId, setRoleId] = useState<string>(data.roles[0].id);
  const [activeGroupIdx, setActiveGroupIdx] = useState<number>(0);
  const [showAllServices, setShowAllServices] = useState<boolean>(false);

  const activeRole = data.roles.find((r) => r.id === roleId) || data.roles[0];
  const serviceByName = new Map(data.services.map((s) => [s.title, s]));

  return (
    <>
      {/* H01: Flagship Cinematic BIM Hero */}
      <section className="alu-hero-stage" aria-labelledby="hero-title">
        {data.heroVideo && (
          <div className="alu-hero-stage__backdrop" aria-hidden="true">
            <video
              className="alu-hero-stage__bg-video"
              src={data.heroVideo.src}
              poster={data.heroVideo.poster}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="alu-hero-stage__scrim" />
          </div>
        )}

        <div className="alu-container alu-hero-stage__inner">
          <div className="alu-hero-stage__grid">
            <div className="alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
              <div className="alu-cluster" style={{ gap: '0.625rem' }}>
                <span className="alu-badge alu-badge--accent">
                  <AluIcon name="sparkles" size="sm" />
                  <span>ALLPLAN 2026 · TÜRKİYE</span>
                </span>
                <span className="alu-badge">1995&apos;ten beri Yetkili Distribütör</span>
              </div>

              <h1 id="hero-title" className="alu-display alu-hero-stage__title">
                DAHA İYİ BİR GELECEK İNŞA ETMEK İÇİN TASARLANDI
              </h1>

              <p className="alu-body-lg alu-hero-stage__lead">
                Yenilikçi AEC iş akışları, parametrik donatı ve çelik otomasyonu ile bulut tabanlı OpenBIM iş birliği sayesinde tasarım aşamasından şantiyeye kadar hatasız projeler.
              </p>

              <div className="alu-cluster" role="group" aria-label="Ana eylemler" style={{ gap: '0.875rem' }}>
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

              <div className="alu-hero-tags" aria-label="Teknik yetenek etiketleri">
                {HERO_TAGS.map((tag) => (
                  <span key={tag} className="alu-hero-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <aside className="alu-hero-monitor" aria-label="ALLPLAN BIM Canlı Görünüm">
              <div className="alu-hero-monitor__header">
                <span className="alu-hero-monitor__status">
                  <span className="alu-hero-monitor__dot" />
                  <span>ALLPLAN 2026 · BIM ENGINE</span>
                </span>
                <span className="alu-caption">IFC 4.3 · OPENBIM</span>
              </div>
              {data.heroVideo && (
                <div className="alu-hero-monitor__viewport">
                  <video
                    className="alu-hero-monitor__video"
                    src={data.heroVideo.src}
                    poster={data.heroVideo.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              )}
              <div className="alu-hero-monitor__footer">
                <div>
                  <p className="preview-kicker" style={{ margin: 0 }}>
                    MİMARİ · MÜHENDİSLİK · ALTYAPI · PREKAST
                  </p>
                  <p className="alu-body-sm" style={{ margin: '0.25rem 0 0 0' }}>
                    Disiplinler arası BIM koordinasyonu ve yerel mühendislik desteği için tek platform.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* H02: QuickLinks Command Ribbon */}
      <section className="alu-quick-ribbon" aria-label="Hızlı erişimler">
        <div className="alu-container alu-quick-ribbon__grid">
          {data.quickLinks.map(([label, href], idx) => (
            <Link key={href} className="alu-quick-ribbon__item" href={href}>
              <span className="alu-quick-ribbon__index">0{idx + 1}</span>
              <span className="alu-quick-ribbon__label">{label}</span>
              <AluIcon name="arrow-right" size="sm" />
            </Link>
          ))}
        </div>
      </section>

      {/* H03: Interactive Role Stage + 6 Permanent Products (PathwayProductSystem) */}
      <section
        id="products"
        className="preview-section alu-pathway-section"
        aria-labelledby="products-heading"
        style={
          {
            '--role-accent': ROLE_ACCENTS[activeRole.id] || '#3B82F6'
          } as React.CSSProperties
        }
      >
        {/* Dynamic Ambient Glow based on Active Role */}
        <div className="alu-pathway-glow" aria-hidden="true" />

        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)', position: 'relative', zIndex: 2 }}>
          <div className="alu-pathway-header">
            <span className="preview-kicker">ROLÜNÜZÜ SEÇİN · ROL VE ÜRÜN MİMARİSİ</span>
            <h2 id="products-heading" className="alu-h1">
              Disiplininize Özel BIM İş Akışı
            </h2>
            <p className="alu-body preview-meta" style={{ maxWidth: '58ch', marginInline: 'auto' }}>
              Size en uygun iş akışını ve ürün paketini keşfedin. Seçtiğiniz disipline göre önerilen ALLPLAN paketleri aşağıda otomatik olarak öne çıkar.
            </p>
          </div>

          {/* Role Tabs (MİMAR / MÜHENDİS / PREKAST) */}
          <div className="alu-pathway-tabs" role="tablist" aria-label="Rolünüzü seçin">
            {data.roles.map((role, rIdx) => {
              const isSelected = role.id === activeRole.id;
              const iconName = ROLE_ICONS[role.id] || 'layers';
              const roleColor = ROLE_ACCENTS[role.id] || '#3B82F6';
              return (
                <button
                  key={role.id}
                  id={`pathway-tab-${role.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`pathway-panel-${role.id}`}
                  className={`alu-pathway-tab${isSelected ? ' alu-pathway-tab--active' : ''}`}
                  style={{ '--tab-accent': roleColor } as React.CSSProperties}
                  onClick={() => setRoleId(role.id)}
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

          {/* Active Role Content (Split View with Smooth Keyed Entrance & Staggered Features) */}
          <div
            id={`pathway-panel-${activeRole.id}`}
            role="tabpanel"
            aria-labelledby={`pathway-tab-${activeRole.id}`}
            className="alu-pathway-split"
            aria-live="polite"
          >
            {/* Left: Animated Role Title, Description & CTA */}
            <div key={activeRole.id + '-text'} className="alu-pathway-split__left">
              <div className="alu-cluster" style={{ gap: '0.625rem' }}>
                <span className="alu-pathway-role-badge">
                  <AluIcon name={ROLE_ICONS[activeRole.id] || 'layers'} size="sm" />
                  <span>{activeRole.label} İŞ AKIŞI</span>
                </span>
                <span className="alu-caption">ALLPLAN 2026</span>
              </div>

              <h3 className="alu-pathway-split__title">{activeRole.title}</h3>

              <p className="alu-pathway-split__desc">{activeRole.description}</p>

              <div className="alu-cluster" style={{ gap: '0.875rem', paddingTop: '0.5rem' }}>
                <Link className="alu-pathway-cta" href={activeRole.href}>
                  <span>Bu Akışı Detaylı İncele</span>
                  <span className="alu-pathway-cta__arrow">
                    <AluIcon name="arrow-right" size="sm" />
                  </span>
                </Link>
                <a
                  className="alu-button alu-button--secondary alu-button--md"
                  href={TRIAL_CTA_URL}
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
              <div className="alu-pathway-features-grid">
                {activeRole.features.map((feat, fIdx) => (
                  <div
                    key={activeRole.id + '-feature-' + fIdx}
                    className="alu-pathway-feature-card"
                    style={{ animationDelay: `${fIdx * 85}ms` }}
                  >
                    <span className="alu-pathway-feature-card__icon" aria-hidden="true">
                      <AluIcon name="check" size="sm" />
                    </span>
                    <span className="alu-pathway-feature-card__text">{feat}</span>
                  </div>
                ))}
              </div>

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
                SEÇİLİ ROL İÇİN ÖNERİLEN PAKETLER ÖNE ÇIKARILDI ({activeRole.label})
              </span>
              <Link className="alu-link alu-link--standalone" href="/products">
                <span>Tüm Ürün Ailesi</span>
                <AluIcon name="arrow-right" size="sm" />
              </Link>
            </div>

            <div className="alu-products-showcase">
              {data.products.map((product, pIdx) => {
                const isHighlighted = product.relatedRoles.includes(activeRole.id);
                return (
                  <Link
                    key={product.id}
                    href={product.href}
                    className={`alu-product-card${
                      isHighlighted ? ' alu-product-card--highlighted' : ' alu-product-card--dimmed'
                    }`}
                  >
                    {product.image && (
                      <div className="alu-product-card__media">
                        <img src={product.image} alt={product.title} loading="lazy" />
                        <span className="alu-product-card__tier">0{pIdx + 1}</span>
                        {isHighlighted && (
                          <span className="alu-product-card__recommended">
                            <span className="alu-product-card__pulse-dot" />
                            <span>{activeRole.label} İÇİN ÖNERİLEN</span>
                          </span>
                        )}
                      </div>
                    )}
                    <div className="alu-product-card__body">
                      <div className="alu-product-card__top-row">
                        <span className="alu-product-card__box-icon">
                          <AluIcon name="boxes" size="md" />
                        </span>
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

      {/* H04: Solutions Asymmetric Bento Grid */}
      <section id="solutions" className="preview-section preview-section--subtle" aria-labelledby="solutions-heading">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="preview-section-heading">
            <div className="alu-stack">
              <span className="preview-kicker">ÇÖZÜM EKOSİSTEMİ</span>
              <h2 id="solutions-heading" className="alu-h1">
                Tek Platform. Tüm Mühendislik Disiplinleri.
              </h2>
              <p className="alu-body preview-meta">
                Bina tasarımından parametrik köprü ve altyapı mühendisliğine, prekast üretiminden yerel BIM eklentilerine kadar uçtan uca entegre çözümler.
              </p>
            </div>
            <Link className="alu-button alu-button--secondary alu-button--md" href="/solutions">
              <span>Tüm Çözümleri Keşfet</span>
              <AluIcon name="arrow-right" size="sm" />
            </Link>
          </div>

          <div className="alu-bento-grid">
            {data.solutions.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                className={`alu-bento-card alu-bento-card--${idx + 1}`}
              >
                {item.image && (
                  <img
                    className="alu-bento-card__bg"
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />
                )}
                <div className="alu-bento-card__scrim" />
                <div className="alu-bento-card__top">
                  <span className="alu-badge alu-badge--accent">{item.subtitle}</span>
                  <span className="alu-bento-card__index">0{idx + 1}</span>
                </div>
                <div className="alu-bento-card__bottom">
                  <h3 className="alu-bento-card__title">{item.title}</h3>
                  <p className="alu-bento-card__desc">{item.description}</p>
                  <span className="alu-bento-card__cta">
                    <span>{item.cta}</span>
                    <AluIcon name="arrow-up-right" size="sm" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* H05: Package Comparison / TechSpecs */}
      <section id="package-comparison" className="preview-section" aria-labelledby="packages-heading">
        <div className="alu-container">
          <div className="alu-techspecs-banner">
            <div className="alu-techspecs-banner__header">
              <div className="alu-stack">
                <span className="preview-kicker">{data.packageAccess.eyebrow} · Q3 2026 MATRİSİ</span>
                <h2 id="packages-heading" className="alu-h1">
                  {data.packageAccess.title}
                </h2>
                <p className="alu-body preview-meta">{data.packageAccess.description}</p>
              </div>
              <div className="alu-cluster">
                <a
                  className="alu-button alu-button--primary alu-button--lg"
                  href={data.packageAccess.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AluIcon name="download" size="sm" />
                  <span>{data.packageAccess.cta}</span>
                </a>
                <Link className="alu-button alu-button--secondary alu-button--lg" href="/paket-karsilastirma">
                  <span>Karşılaştırma Sayfası</span>
                  <AluIcon name="arrow-right" size="sm" />
                </Link>
              </div>
            </div>

            <div className="alu-techspecs-grid">
              {data.packages.map((pkg, idx) => (
                <a
                  key={pkg.id}
                  href={data.packageAccess.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alu-techspec-item"
                >
                  <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                    <span className="alu-techspec-item__num">0{idx + 1}</span>
                    <span className="alu-badge">
                      <AluIcon name="file-text" size="sm" />
                      <span>PDF · TR</span>
                    </span>
                  </div>
                  <h3 className="alu-card__title">{pkg.title}</h3>
                  <p className="alu-body-sm">{pkg.description}</p>
                  <span className="alu-link alu-link--standalone" style={{ marginTop: 'auto' }}>
                    <AluIcon name="download" size="sm" />
                    <span>Karşılaştırma Tablosunu İndir (PDF)</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* H06: Professional Services (20 items) */}
      <section id="professional-services" className="preview-section preview-section--subtle" aria-labelledby="services-heading">
        <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
          <div className="preview-section-heading">
            <div className="alu-stack">
              <span className="preview-kicker">PROFESYONEL HİZMETLER VE DESTEK MERKEZİ</span>
              <h2 id="services-heading" className="alu-h1">
                Öğrenme, Teknik Destek ve Lisans Kaynakları
              </h2>
              <p className="alu-body preview-meta">
                Eğitim, Microsoft Teams canlı bağlantı ve allplan.net.tr/tr ticket platformu dahil 20 profesyonel hizmet ve teknik kaynağa tek merkezden ulaşın.
              </p>
            </div>
            <button
              type="button"
              className="alu-button alu-button--secondary alu-button--md"
              onClick={() => setShowAllServices((prev) => !prev)}
            >
              <AluIcon name="layers" size="sm" />
              <span>{showAllServices ? 'Kategori Görünümüne Dön' : 'Tüm 20 Kaynağı Tek Listede Aç'}</span>
            </button>
          </div>

          <div className="alu-service-pills" role="tablist" aria-label="Hizmet kategorileri">
            {SERVICE_GROUPS.map(([groupTitle, names], idx) => (
              <button
                key={groupTitle}
                type="button"
                role="tab"
                aria-selected={activeGroupIdx === idx}
                className={`alu-service-pill${activeGroupIdx === idx ? ' alu-service-pill--active' : ''}`}
                onClick={() => {
                  setActiveGroupIdx(idx);
                  setShowAllServices(false);
                }}
              >
                <span>{groupTitle}</span>
                <span className="alu-service-pill__count">{names.length}</span>
              </button>
            ))}
          </div>

          <div className="alu-tabs__panel">
            <div className="alu-services-grid">
              {SERVICE_GROUPS[activeGroupIdx][1].map((serviceName) => {
                const item = serviceByName.get(serviceName);
                if (!item) return null;
                const isExt = item.href.startsWith('http');
                const iconName = SERVICE_ICONS[item.title] || 'layers';
                return (
                  <article key={item.title} className="alu-service-card">
                    <div className="alu-service-card__top">
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

          {/* Complete 20/20 Directory (Accessible in DOM & toggleable) */}
          <div className="alu-stack" style={{ display: showAllServices ? 'flex' : 'none' }}>
            <h3 className="alu-h3">Tüm Hizmet ve Kaynak Dizini (20/20)</h3>
            {SERVICE_GROUPS.map(([groupTitle, names]) => (
              <div key={groupTitle} className="alu-stack" style={{ gap: 'var(--space-stack-md)', paddingTop: '1rem' }}>
                <div className="alu-cluster" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: '0.5rem' }}>
                  <span className="alu-h4">{groupTitle}</span>
                  <span className="alu-badge">{names.length} kayıt</span>
                </div>
                <div className="alu-services-grid">
                  {names.map((name) => {
                    const item = serviceByName.get(name);
                    if (!item) return null;
                    const isExt = item.href.startsWith('http');
                    const iconName = SERVICE_ICONS[item.title] || 'layers';
                    return (
                      <article key={`all-${item.title}`} className="alu-service-card">
                        <div className="alu-service-card__top">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H07: BIMFlex Spotlight */}
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
              <h3 className="alu-h3" style={{ color: 'var(--accent-fg)' }}>
                {data.bimflex.claim}
              </h3>
              <p className="alu-body">{data.bimflex.description}</p>
              <p className="alu-caption">{data.bimflex.relationship}</p>
              <div className="alu-cluster">
                <Link className="alu-button alu-button--primary alu-button--lg" href={data.bimflex.href}>
                  <span>{data.bimflex.cta}</span>
                  <AluIcon name="arrow-right" size="sm" />
                </Link>
                <a
                  className="alu-button alu-button--secondary alu-button--lg"
                  href={MAIN_QUOTE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>BIMFlex Teklifi İste</span>
                  <AluIcon name="external-link" size="sm" />
                </a>
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

      {/* H08: ALLPLAN 2026 Innovations + OpenBIM Partner Ecosystem */}
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
            <Link className="alu-button alu-button--primary alu-button--md" href={data.innovationsMeta.href}>
              <span>{data.innovationsMeta.cta}</span>
              <AluIcon name="arrow-right" size="sm" />
            </Link>
          </div>

          <div className="alu-innovations-showcase">
            {data.innovations.map((card, idx) => (
              <article key={card.id} className="alu-innovation-card">
                {card.image && (
                  <div className="alu-innovation-card__media">
                    <img src={card.image} alt={card.title} loading="lazy" />
                    <div className="alu-innovation-card__overlay">
                      <span className="alu-badge alu-badge--accent">
                        <AluIcon name="sparkles" size="sm" />
                        <span>{card.badge}</span>
                      </span>
                      <span className="alu-innovation-card__num">0{idx + 1}</span>
                    </div>
                  </div>
                )}
                <div className="alu-innovation-card__body">
                  <h3 className="alu-card__title">{card.title}</h3>
                  <p className="alu-body">{card.description}</p>
                  <Link className="alu-link alu-link--standalone" href="/products/allplan-2026-yenilikler" style={{ marginTop: 'auto' }}>
                    <span>Özelliği İncele</span>
                    <AluIcon name="arrow-right" size="sm" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* OpenBIM & Technology Partners Strip */}
          {data.partners && data.partners.length > 0 && (
            <div className="alu-partner-strip" aria-label="Teknoloji ve OpenBIM İş Ortakları">
              <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                <span className="preview-kicker">OPENBIM VE TEKNOLOJİ EKOSİSTEMİ ENTEGRASYONLARI</span>
                <span className="alu-caption">IFC 4.3 · BCF · Doğrudan Veri Değişimi</span>
              </div>
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
