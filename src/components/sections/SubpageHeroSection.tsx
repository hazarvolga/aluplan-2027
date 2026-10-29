import Link from 'next/link';
import type { ReactElement } from 'react';
import type { ContentImage, PageRecord } from '@/lib/site-data';
import { MAIN_QUOTE_FORM_URL, TRIAL_CTA_URL } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import type { SubpageHeroPresentation } from './subpage-hero-presentation';

interface SubpageHeroSectionProps {
  page: PageRecord;
  heroImage: ContentImage | null;
  presentation: SubpageHeroPresentation;
  backgroundSrc: string | null;
  sectionBadgeLabel: string;
  isLegalPage: boolean;
}

export function SubpageHeroSection({
  page,
  heroImage,
  presentation,
  backgroundSrc,
  sectionBadgeLabel,
  isLegalPage
}: SubpageHeroSectionProps): ReactElement {
  const showFramedMedia = Boolean(heroImage) && presentation === 'framed';

  return (
    <section
      className={`alu-subpage-hero ${presentation === 'background-only' ? 'alu-subpage-hero--background-only' : ''}`}
      aria-labelledby="page-h1"
    >
      {backgroundSrc && (
        <div
          className="alu-subpage-hero__bg"
          style={{ backgroundImage: `url(${backgroundSrc})` }}
          aria-hidden="true"
        />
      )}
      <div className="alu-subpage-hero__scrim" aria-hidden="true" />

      <div
        className={`alu-container alu-subpage-hero__inner ${showFramedMedia ? 'alu-subpage-hero__grid' : 'alu-stack'}`}
        style={{ gap: 'var(--space-stack-xl)' }}
      >
        <div
          className="alu-stack alu-subpage-hero__content-panel"
          style={{ gap: 'var(--space-stack-md)' }}
        >
          <nav aria-label="Sayfa konumu (Breadcrumb)">
            <ol className="alu-breadcrumb">
              {page.breadcrumbs.map((crumb, idx) => (
                <li key={crumb.href + idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-application-jsx-compact)' }}>
                  {idx > 0 && <AluIcon name="chevron-right" size="sm" />}
                  {idx < page.breadcrumbs.length - 1 ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span aria-current="page" style={{ color: 'var(--text-primary)' }}>
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="alu-cluster">
            <span className="alu-badge alu-badge--accent">
              <AluIcon name="layers" size="sm" />
              <span>{sectionBadgeLabel}</span>
            </span>
            <span className="alu-badge">ALLPLAN TÜRKİYE</span>
          </div>

          <h1 id="page-h1" className="alu-display" style={{ margin: 0 }}>
            {page.h1}
          </h1>

          <p className="alu-body-lg preview-meta" style={{ margin: 0 }}>
            {page.description}
          </p>

          {!isLegalPage && page.path !== '/about' && (
            <div className="alu-cluster" style={{ marginTop: 'var(--space-stack-sm)' }}>
              <a
                href={MAIN_QUOTE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="alu-button alu-button--primary alu-button--lg"
              >
                <span>Teklif Talep Formu</span>
                <AluIcon name="external-link" size="sm" />
              </a>
              <a
                href={TRIAL_CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="alu-button alu-button--secondary alu-button--lg"
              >
                <span>Ücretsiz Deneme</span>
                <AluIcon name="external-link" size="sm" />
              </a>
              {page.path.startsWith('/products') && (
                <a
                  href="/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alu-button alu-button--ghost alu-button--md"
                >
                  <AluIcon name="file-text" size="sm" />
                  <span>Paket Karşılaştırma PDF</span>
                </a>
              )}
            </div>
          )}
        </div>

        {showFramedMedia && heroImage && (
          <figure className="alu-subpage-hero__media">
            <div className="alu-subpage-hero__media-frame">
              <img src={heroImage.src} alt={heroImage.alt || page.h1} />
            </div>
            {heroImage.alt && (
              <figcaption className="alu-subpage-hero__caption">
                <AluIcon name="sparkles" size="sm" />
                <span>{heroImage.alt}</span>
              </figcaption>
            )}
          </figure>
        )}

        {!showFramedMedia && heroImage && (
          <img
            className="alu-visually-hidden"
            src={heroImage.src}
            alt={heroImage.alt || page.h1}
          />
        )}
      </div>
    </section>
  );
}
