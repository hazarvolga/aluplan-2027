'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';

import type {
  ContentLink,
  StructuredPageLayout,
  StructuredWorkflowLink
} from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { BenefitsSection } from './BenefitsSection';
import { FAQSection } from './FAQSection';
import { MediaGridSection } from './MediaGridSection';
import { ReferencesDirectorySection } from './ReferencesDirectorySection';
import { SplitCalloutSection } from './SplitCalloutSection';
import { WorkflowSection } from './WorkflowSection';

interface StructuredVideoRequest {
  youtubeId?: string;
  videoSrc?: string;
  title: string;
}

interface StructuredImageRequest {
  src: string;
  title: string;
}

interface StructuredPageLayoutSectionProps {
  layout: StructuredPageLayout;
  contentLinks: ContentLink[];
  activeReferenceCategoryId: string;
  referenceSearchQuery: string;
  onReferenceCategoryChange: (categoryId: string) => void;
  onReferenceSearchQueryChange: (query: string) => void;
  onVideo: (video: StructuredVideoRequest) => void;
  onImage: (image: StructuredImageRequest) => void;
}

const WORKFLOW_ACCENTS: Record<StructuredWorkflowLink['accentKey'], string> = {
  package: 'var(--workflow-package)',
  architect: 'var(--role-architect)',
  engineer: 'var(--role-engineer)',
  fabricator: 'var(--role-fabricator)'
};

export function StructuredPageLayoutSection({
  layout,
  contentLinks,
  activeReferenceCategoryId,
  referenceSearchQuery,
  onReferenceCategoryChange,
  onReferenceSearchQueryChange,
  onVideo,
  onImage
}: StructuredPageLayoutSectionProps): ReactElement {
  return (
    <div className="alu-structured-page">
      {layout.intro && (
        <section className="preview-section" aria-label={layout.intro.title}>
          <div className="alu-container">
            <div
              className={`alu-intro-split${
                layout.intro.videoEmbedUrl ? '' : ' alu-intro-split--single'
              }`}
            >
              <div className="alu-intro-split__content">
                {layout.intro.kicker && (
                  <span className="preview-kicker">{layout.intro.kicker}</span>
                )}
                <h2 className="alu-h1" style={{ margin: 0 }}>
                  {layout.intro.title}
                </h2>
                {layout.intro.paragraphs?.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex} className="alu-body">{paragraph}</p>
                ))}
                {layout.intro.bullets.length > 0 && (
                  <ul className="alu-intro-split__bullets">
                    {layout.intro.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="alu-intro-split__bullet">
                        <span className="alu-intro-split__bullet-icon">
                          <AluIcon name="check" size="sm" />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {layout.intro.videoEmbedUrl && (
                <div className="alu-intro-split__media">
                  <div className="alu-intro-split__video-frame">
                    <iframe
                      src={layout.intro.videoEmbedUrl}
                      title={layout.intro.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {layout.workflowLinks && layout.workflowLinks.length > 0 && (
        <section className="alu-workflow-ribbon-section" aria-label="Hızlı İş Akışı Bağlantıları">
          <div className="alu-container">
            <div className="alu-workflow-ribbon">
              {layout.workflowLinks.map((workflowLink, workflowIndex) => {
                const pillContent = (
                  <>
                    <span
                      className="alu-workflow-pill__dot"
                      style={{ background: WORKFLOW_ACCENTS[workflowLink.accentKey] }}
                    />
                    <span className="alu-workflow-pill__text">{workflowLink.text}</span>
                    <span className="alu-workflow-pill__arrow">
                      <AluIcon name="arrow-right" size="sm" />
                    </span>
                  </>
                );

                return workflowLink.external ? (
                  <a
                    key={`${workflowLink.href}-${workflowIndex}`}
                    href={workflowLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alu-workflow-pill"
                  >
                    {pillContent}
                  </a>
                ) : (
                  <Link
                    key={`${workflowLink.href}-${workflowIndex}`}
                    href={workflowLink.href}
                    className="alu-workflow-pill"
                  >
                    {pillContent}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {layout.stats && layout.stats.length > 0 && (
        <section className="preview-section preview-section--subtle" aria-label="Performans Göstergeleri">
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <div
              className="alu-hero-metrics"
              style={{
                gridTemplateColumns: `repeat(${Math.min(layout.stats.length, 4)}, minmax(0, 1fr))`
              }}
            >
              {layout.stats.map((stat, statIndex) => (
                <div key={`${stat.label}-${statIndex}`} className="alu-hero-metrics__item">
                  <span className="alu-hero-metrics__value">{stat.value}</span>
                  <h3 className="alu-hero-metrics__label" style={{ margin: 0 }}>
                    {stat.label}
                  </h3>
                  <p className="alu-body-sm" style={{ margin: 'var(--space-application-jsx-tight) 0 0 0' }}>
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>

            {layout.challenges && layout.challenges.length > 0 && (
              <div className="alu-challenges-band">
                <div className="alu-challenges-band__header">
                  <span className="preview-kicker">/ SEKTÖREL ZORLUKLAR</span>
                  <h3 className="alu-h3" style={{ margin: 0 }}>
                    Günümüz Projelerinde Karşılaşılan Temel Zorluklar
                  </h3>
                </div>
                <div className="alu-challenges-grid">
                  {layout.challenges.map((challenge, challengeIndex) => (
                    <div key={challengeIndex} className="alu-challenge-card">
                      <span className="alu-challenge-card__num">0{challengeIndex + 1}</span>
                      <p className="alu-body-sm" style={{ margin: 0 }}>
                        {challenge}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {layout.splitCallouts && (
        <SplitCalloutSection
          callouts={layout.splitCallouts.filter(
            (callout) =>
              callout.title !== 'Lisans ve Gereksinimler' &&
              !callout.title.includes('SCIA Engineer')
          )}
          itemKeyPrefix="callout-top"
          onVideo={onVideo}
          onImage={onImage}
        />
      )}

      {layout.benefits && layout.benefits.items.length > 0 && (
        <BenefitsSection benefits={layout.benefits} />
      )}

      {layout.coreFeatures && layout.coreFeatures.items.length > 0 && (
        <MediaGridSection
          grid={layout.coreFeatures}
          itemKeyPrefix="core-features"
          onVideo={onVideo}
          onImage={onImage}
        />
      )}

      {layout.workflowTabs && (
        <WorkflowSection
          content={layout.workflowTabs}
          onVideo={onVideo}
          onImage={onImage}
        />
      )}

      {layout.extraGrids?.map((grid, gridIndex) => (
        <MediaGridSection
          key={`extra-grid-${gridIndex}`}
          grid={grid}
          itemKeyPrefix={`extra-grid-${gridIndex}`}
          onVideo={onVideo}
          onImage={onImage}
        />
      ))}

      {layout.splitCallouts && (
        <SplitCalloutSection
          callouts={layout.splitCallouts.filter(
            (callout) =>
              callout.title === 'Lisans ve Gereksinimler' ||
              callout.title.includes('SCIA Engineer')
          )}
          itemKeyPrefix="callout-bottom"
          onVideo={onVideo}
          onImage={onImage}
        />
      )}

      {layout.faq && layout.faq.items.length > 0 && (
        <section className="preview-section preview-section--subtle" aria-label={layout.faq.title}>
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <div className="alu-section-header-center">
              <span className="preview-kicker">/ SIKÇA SORULAN SORULAR</span>
              <h2 className="alu-h1" style={{ margin: 0 }}>
                {layout.faq.title}
              </h2>
            </div>
            <div className="alu-faq-list">
              {layout.faq.items.map((faqItem, faqIndex) => (
                <details
                  key={`${faqItem.question}-${faqIndex}`}
                  className="alu-faq-item"
                  open={faqIndex === 0}
                >
                  <summary className="alu-faq-item__summary">
                    <span>{faqItem.question}</span>
                    <span className="alu-faq-item__chevron" aria-hidden="true">
                      <AluIcon name="chevron-down" size="sm" />
                    </span>
                  </summary>
                  <div className="alu-faq-item__answer">
                    {faqItem.answer.split('\n\n').map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {layout.referencesDirectory && (
        <ReferencesDirectorySection
          directory={layout.referencesDirectory}
          activeCategoryId={activeReferenceCategoryId}
          searchQuery={referenceSearchQuery}
          onCategoryChange={onReferenceCategoryChange}
          onSearchQueryChange={onReferenceSearchQueryChange}
        />
      )}

      <FAQSection faqDirectory={layout.faqDirectory} />

      {contentLinks.length > 0 && (
        <section className="preview-section" aria-label="İlgili Bağlantılar ve Dokümanlar">
          <div className="alu-container">
            <div className="alu-techspecs-banner" style={{ padding: 'var(--space-inset-lg)' }}>
              <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
                <span className="preview-kicker">İLGİLİ BAĞLANTILAR, MODÜLLER VE DOKÜMANLAR</span>
                <h2 className="alu-h3" style={{ margin: 0 }}>
                  Bu Sayfayla İlgili Hızlı Geçişler ve İndirmeler
                </h2>
                <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-dense)' }}>
                  {contentLinks.map((contentLink, linkIndex) =>
                    contentLink.external ? (
                      <a
                        key={`${contentLink.href}-${linkIndex}`}
                        href={contentLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="alu-button alu-button--secondary alu-button--sm"
                      >
                        <span>{contentLink.text}</span>
                        <AluIcon name="external-link" size="sm" />
                      </a>
                    ) : (
                      <Link
                        key={`${contentLink.href}-${linkIndex}`}
                        href={contentLink.href}
                        className="alu-button alu-button--secondary alu-button--sm"
                      >
                        <span>{contentLink.text}</span>
                        <AluIcon name="arrow-right" size="sm" />
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
