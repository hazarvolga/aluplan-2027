import Link from 'next/link';
import { getImageProps } from 'next/image';
import type { ReactElement } from 'react';
import type { ContentImage, PageRecord } from '@/lib/site-data';
import { MAIN_QUOTE_FORM_URL, TRIAL_CTA_URL } from '@/lib/site-shared';
import { AluIcon } from '@/components/ui/AluIcon';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { heroLead } from '@/lib/hero-lead';
import { HeroBottomLine } from './HeroBottomLine';
import type {
  HeroBackgroundSources,
  HeroVisualAssetKind,
  HeroVisualFamilyId,
  SubpageHeroPresentation
} from './subpage-hero-presentation';

interface SubpageHeroSectionProps {
  page: PageRecord;
  heroImage: ContentImage | null;
  presentation: SubpageHeroPresentation;
  background: HeroBackgroundSources | null;
  familyId: HeroVisualFamilyId | null;
  assetKind: HeroVisualAssetKind;
  sectionBadgeLabel: string;
  isLegalPage: boolean;
}

export function SubpageHeroSection({
  page,
  heroImage,
  presentation,
  background,
  familyId,
  assetKind,
  sectionBadgeLabel,
  isLegalPage
}: SubpageHeroSectionProps): ReactElement {
  const scalypsoTrial = page.path.startsWith('/solutions/scalypso/')
    ? (page.contentLinks.find((link) => link.text === 'Deneme Lisansı İste')?.href ?? MAIN_QUOTE_FORM_URL)
    : undefined;
  const showFramedMedia = Boolean(heroImage) && presentation === 'framed';
  const responsiveBackground = background ? (() => {
    const common = { alt: '', fill: true, sizes: '100vw', loading: 'eager' } as const;
    const { props: { srcSet: desktopSrcSet, ...desktopImageProps } } = getImageProps({
      ...common,
      src: background.desktopSrc
    });
    const { props: { srcSet: mobileSrcSet } } = getImageProps({
      ...common,
      src: background.mobileSrc
    });

    return { desktopImageProps, desktopSrcSet, mobileSrcSet };
  })() : null;

  return (
    <section
      className={`alu-subpage-hero ${presentation === 'background-only' ? 'alu-subpage-hero--background-only' : ''}`}
      aria-labelledby="page-h1"
      data-hero-family={familyId || undefined}
      data-hero-source={assetKind}
    >
      {responsiveBackground && (
        <picture className="alu-subpage-hero__bg" aria-hidden="true">
          <source media="(max-width: 40rem)" srcSet={responsiveBackground.mobileSrcSet} />
          <img
            {...responsiveBackground.desktopImageProps}
            srcSet={responsiveBackground.desktopSrcSet}
            fetchPriority="high"
          />
        </picture>
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
              <span>{page.path === '/products/sds2-home' ? 'SDS2 by ALLPLAN' : sectionBadgeLabel}</span>
            </span>
            <span className="alu-badge">ALLPLAN TÜRKİYE</span>
          </div>

          <h1 id="page-h1" className="alu-h1" style={{ margin: 0 }}>
            {page.h1}
          </h1>

          <p className="alu-body-lg preview-meta" style={{ margin: 0 }}>
            {heroLead(page.h1, page.description)}
          </p>

          {!isLegalPage && page.path !== '/about' && (
            <div className="alu-cluster" style={{ marginTop: 'var(--space-stack-sm)' }}>
              <a
                href={MAIN_QUOTE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="alu-button alu-button--primary alu-button--md"
              >
                <span>Teklif Talep Formu</span>
                <AluIcon name="external-link" size="sm" />
              </a>
              <a
                href={scalypsoTrial ?? TRIAL_CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="alu-button alu-button--secondary alu-button--md"
              >
                <span>{scalypsoTrial ? 'Deneme Lisansı İste' : 'Ücretsiz Deneme'}</span>
                <AluIcon name="external-link" size="sm" />
              </a>
              {page.path.startsWith('/products') && (
                !isReleaseContentEnabled() ? (
                  <a href="/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf" target="_blank" rel="noopener noreferrer" className="alu-button alu-button--ghost alu-button--md">
                    <AluIcon name="file-text" size="sm" />
                    <span>Paket Karşılaştırma PDF</span>
                  </a>
                ) : (
                  <Link href="/paket-karsilastirma" className="alu-button alu-button--ghost alu-button--md">
                    <AluIcon name="file-text" size="sm" />
                    <span>Paketleri karşılaştırın</span>
                  </Link>
                )
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
      </div>
      <HeroBottomLine />
    </section>
  );
}
