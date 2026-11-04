'use client';

import React from 'react';
import Link from 'next/link';
import { getHomepageData, TRIAL_CTA_URL, MAIN_QUOTE_FORM_URL } from '@/lib/site-shared';
import { AluIcon } from '@/components/ui/AluIcon';
import { ProfessionalServicesSection } from './ProfessionalServicesSection';
import { HomepageMaxPreviewHero } from './HomepageMaxPreviewHero';
import { HomepageProductPreviewTabs } from './HomepageProductPreviewTabs';
import { DisciplineWorkflowSection } from './DisciplineWorkflowSection';
import { HomepageProductHeading } from './HomepageProductHeading';
import { HeroBottomLine } from './HeroBottomLine';
import styles from './HomepageSectionIntro.module.css';
import { DebugComponentLabel } from './DebugComponentLabel';

const data = getHomepageData();
const releaseCountryLabel = `${data.releaseLabel} · TÜRKİYE`;
const releaseMonitorLabel = `${data.releaseLabel} · ${data.heroContent.monitorLabel}`;
const packageMatrixSuffix = ` · ${data.packageMatrixLabel}`;

const previewSolutionImages: Record<string, string> = {
  '/cozumler/bina-tasarimi': '/assets/previews/solutions/building-web.jpg',
  '/cozumler/altyapi-tasarimi': '/assets/previews/solutions/infrastructure-web.jpg',
  '/cozumler/insaat-planlamasi': '/assets/previews/solutions/construction-web.jpg',
  '/eklentiler': '/assets/previews/solutions/addons-web.jpg',
  '/cozumler/diger-urunler': '/assets/previews/solutions/other-web.jpg',
};

// Pre-generated variants avoid runtime image transforms and serve only the
// dimensions needed by the homepage cards. Original files remain available.
const optimizedHomepageImages: Record<string, string> = Object.fromEntries([
  ...Object.values(previewSolutionImages),
  '/assets/bimflex/doseme-bosluk-model.png',
  '/assets/bimflex/kiris-model.png',
  '/assets/bimflex/kolon-model.png',
].map((src) => [src, `/assets/optimized/homepage/${src.split('/').pop()!.replace(/\.[^.]+$/, '')}`]));

function homepageImage(src: string) {
  if (src === '/assets/bimflex/flexsoft-logo.png') {
    return { src: '/assets/optimized/homepage/flexsoft-logo-512.webp', srcSet: '/assets/optimized/homepage/flexsoft-logo-160.webp 160w, /assets/optimized/homepage/flexsoft-logo-320.webp 320w, /assets/optimized/homepage/flexsoft-logo-512.webp 512w' };
  }
  const base = optimizedHomepageImages[src];
  if (!base) return { src };
  const largest = src.endsWith('.png') ? 1440 : 1200;
  return { src: `${base}-${largest}.webp`, srcSet: `${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-${largest}.webp ${largest}w` };
}

export function HomepageView({ previewMaxHero = false }: { previewMaxHero?: boolean }) {
  return (
    <>
      {/* H01: Flagship Cinematic BIM Hero */}
      {previewMaxHero ? <DebugComponentLabel name="HomepageMaxPreviewHero"><HomepageMaxPreviewHero /></DebugComponentLabel> : <DebugComponentLabel name="homepageHero (özel)"><section className="alu-hero-stage" aria-labelledby="hero-title">
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
              <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-dense)' }}>
                <span className="alu-badge alu-badge--accent">
                  <AluIcon name="sparkles" size="sm" />
                  <span>{releaseCountryLabel}</span>
                </span>
                <span className="alu-badge">{data.heroContent.distributorLabel}</span>
              </div>

              <h1 id="hero-title" className="alu-display alu-hero-stage__title">
                {data.heroContent.title}
              </h1>

              <p className="alu-body-lg alu-hero-stage__lead">
                {data.heroContent.description}
              </p>

              <div className="alu-cluster" role="group" aria-label="Ana eylemler" style={{ gap: 'var(--space-application-jsx-wide)' }}>
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
                {data.heroContent.tags.map((tag) => (
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
                  <span>{releaseMonitorLabel}</span>
                </span>
                <span className="alu-caption">{data.heroContent.monitorProtocol}</span>
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
                    {data.heroContent.monitorDisciplines}
                  </p>
                  <p className="alu-body-sm" style={{ margin: 'var(--space-application-jsx-tight) 0 0 0' }}>
                    {data.heroContent.monitorDescription}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
        <HeroBottomLine />
      </section></DebugComponentLabel>}

      {/* H02: QuickLinks Command Ribbon */}
      {previewMaxHero ? <><DebugComponentLabel name="HomepageProductHeading"><section className={styles.intro} aria-labelledby="homepage-products-heading"><div className="alu-container"><HomepageProductHeading /></div></section></DebugComponentLabel><DebugComponentLabel name="HomepageProductPreviewTabs"><HomepageProductPreviewTabs /></DebugComponentLabel></> : <DebugComponentLabel name="quickRibbon (özel)"><section className="alu-quick-ribbon" aria-label="Hızlı erişimler">
        <div className="alu-container alu-quick-ribbon__grid">
          {data.quickLinks.map(([label, href], idx) => (
            <Link key={href} className="alu-quick-ribbon__item" href={href}>
              <span className="alu-quick-ribbon__index">0{idx + 1}</span>
              <span className="alu-quick-ribbon__label">{label}</span>
              <AluIcon name="arrow-right" size="sm" />
            </Link>
          ))}
        </div>
      </section></DebugComponentLabel>}

      <DebugComponentLabel name="DisciplineWorkflowSection"><DisciplineWorkflowSection id="products" roles={previewMaxHero ? data.roles.map(role => ({ ...role, image: ({ architect: '/assets/previews/workflow/architecture-web.jpg', engineer: '/assets/previews/workflow/engineering-web.jpg', fabricator: '/assets/previews/workflow/precast-web.jpg' } as Record<string, string>)[role.id] ?? role.image })) : data.roles} products={data.products} releaseLabel={data.releaseLabel} trialHref={TRIAL_CTA_URL} productsHref="/products" /></DebugComponentLabel>

      {/* H04: Solutions Asymmetric Bento Grid */}
      <DebugComponentLabel name="homepageSolutions (özel)"><section id="solutions" className={`preview-section preview-section--subtle ${styles.solutions}`} aria-labelledby="solutions-heading">
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
                    {...homepageImage(previewMaxHero ? previewSolutionImages[item.href] ?? item.image : item.image)}
                    sizes="(max-width: 767px) 100vw, 50vw"
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
      </section></DebugComponentLabel>

      {/* H05: Package Comparison / TechSpecs */}
      {!previewMaxHero && <DebugComponentLabel name="packageComparison (özel)"><section id="package-comparison" className="preview-section" aria-labelledby="packages-heading">
        <div className="alu-container">
          <div className="alu-techspecs-banner">
            <div className="alu-techspecs-banner__header">
              <div className="alu-stack">
                <span className="preview-kicker">{data.packageAccess.eyebrow}{packageMatrixSuffix}</span>
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
      </section></DebugComponentLabel>}

      {/* H06: Professional Services (the 2027 release lists these on /kaynaklar instead) */}
      {!previewMaxHero && <DebugComponentLabel name="ProfessionalServicesSection"><ProfessionalServicesSection /></DebugComponentLabel>}

      {/* H07: BIMFlex Spotlight */}
      <DebugComponentLabel name="homepageBimflex (özel)"><section id="bimflex" className="preview-section" aria-labelledby="bimflex-heading">
        <div className="alu-container">
          <div className="preview-bimflex">
            <div className="alu-stack preview-bimflex__content" style={{ gap: 'var(--space-stack-lg)' }}>
              <div className="alu-cluster">
                <span className="alu-badge alu-badge--accent">{data.bimflex.eyebrow}</span>
                <span className="alu-badge">{data.bimflex.label}</span>
              </div>
              <img
                className="preview-bimflex__logo"
                {...homepageImage(data.bimflex.logo.src)}
                sizes="80px"
                alt={data.bimflex.logo.alt}
                loading="lazy"
                width={512}
                height={512}
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
                  <img {...homepageImage(visual.src)} sizes="(max-width: 767px) 100vw, 35vw" alt={visual.alt} loading="lazy" />
                  <figcaption>{visual.alt}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section></DebugComponentLabel>

    </>
  );
}
