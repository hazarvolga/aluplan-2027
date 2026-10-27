'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';

import type { StructuredContentBlock } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { BenefitsSection } from './BenefitsSection';
import { LinkGroupGridSection } from './LinkGroupGridSection';
import { MediaGridSection } from './MediaGridSection';
import { SplitCalloutSection } from './SplitCalloutSection';

interface StructuredVideoRequest {
  youtubeId?: string;
  videoSrc?: string;
  title: string;
}

interface StructuredImageRequest {
  src: string;
  title: string;
}

interface StructuredContentBlocksProps {
  blocks: StructuredContentBlock[];
  onVideo: (video: StructuredVideoRequest) => void;
  onImage: (image: StructuredImageRequest) => void;
}

function assertNever(value: never): never {
  throw new Error(`Unsupported structured content block: ${JSON.stringify(value)}`);
}

function renderBlock(
  block: StructuredContentBlock,
  onVideo: StructuredContentBlocksProps['onVideo'],
  onImage: StructuredContentBlocksProps['onImage']
): ReactElement {
  switch (block.kind) {
    case 'intro':
      const introLabel = block.content.title || block.content.kicker || 'Sayfa girişi';
      return (
        <section className="preview-section" aria-label={introLabel}>
          <div className="alu-container">
            <div className={`alu-intro-split${block.content.videoEmbedUrl || block.content.imageSrc ? '' : ' alu-intro-split--single'}`}>
              <div className="alu-intro-split__content">
                {block.content.kicker && <span className="preview-kicker">{block.content.kicker}</span>}
                {block.content.title && <h2 className="alu-h1" style={{ margin: 0 }}>{block.content.title}</h2>}
                {block.content.paragraphs?.map((paragraph, index) => (
                  <p key={index} className="alu-body">{paragraph}</p>
                ))}
                {block.content.bullets.length > 0 && (
                  <ul className="alu-intro-split__bullets">
                    {block.content.bullets.map((bullet, index) => (
                      <li key={index} className="alu-intro-split__bullet">
                        <span className="alu-intro-split__bullet-icon"><AluIcon name="check" size="sm" /></span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {block.content.actions && block.content.actions.length > 0 && (
                  <div className="alu-cluster">
                    {block.content.actions.map((action) =>
                      action.external ? (
                        <a
                          key={action.sourceId}
                          data-source-id={action.sourceId}
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="alu-button alu-button--secondary alu-button--md"
                        >
                          {action.text}
                        </a>
                      ) : (
                        <Link
                          key={action.sourceId}
                          data-source-id={action.sourceId}
                          href={action.href}
                          className="alu-button alu-button--secondary alu-button--md"
                        >
                          {action.text}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
              {block.content.videoEmbedUrl && (
                <div className="alu-intro-split__media">
                  <div className="alu-intro-split__video-frame">
                    <iframe
                      src={block.content.videoEmbedUrl}
                      title={introLabel}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
              {!block.content.videoEmbedUrl && block.content.imageSrc && (
                <div className="alu-intro-split__media">
                  <img
                    src={block.content.imageSrc}
                    alt={block.content.imageAlt || introLabel}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      );
    case 'challenges':
      return (
        <section className="preview-section preview-section--subtle" aria-label={block.title || 'Sektörel Zorluklar'}>
          <div className="alu-container">
            <div className="alu-challenges-band">
              <div className="alu-challenges-band__header">
                <span className="preview-kicker">/ SEKTÖREL ZORLUKLAR</span>
                <h2 className="alu-h3" style={{ margin: 0 }}>
                  {block.title || 'Günümüz Projelerinde Karşılaşılan Temel Zorluklar'}
                </h2>
              </div>
              <div className="alu-challenges-grid">
                {block.items.map((challenge, index) => (
                  <div key={index} className="alu-challenge-card">
                    <span className="alu-challenge-card__num">0{index + 1}</span>
                    <p className="alu-body-sm" style={{ margin: 0 }}>{challenge}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    case 'stats':
      return (
        <section className="preview-section" aria-label="Performans Göstergeleri">
          <div className="alu-container">
            <div className="alu-hero-metrics" style={{ gridTemplateColumns: `repeat(${Math.min(block.items.length, 4)}, minmax(0, 1fr))` }}>
              {block.items.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="alu-hero-metrics__item">
                  <span className="alu-hero-metrics__value">{stat.value}</span>
                  <h3 className="alu-hero-metrics__label" style={{ margin: 0 }}>{stat.label}</h3>
                  <p className="alu-body-sm" style={{ margin: 'var(--space-application-jsx-tight) 0 0 0' }}>{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'linkGroupGrid':
      return <LinkGroupGridSection grid={block.content} />;
    case 'benefits':
      return <BenefitsSection benefits={block.content} />;
    case 'mediaGrid':
      return (
        <MediaGridSection
          grid={block.content}
          itemKeyPrefix={block.sourceId}
          onVideo={onVideo}
          onImage={onImage}
        />
      );
    case 'splitCallouts':
      return (
        <SplitCalloutSection
          callouts={block.items}
          itemKeyPrefix="callout-top"
          onVideo={onVideo}
          onImage={onImage}
        />
      );
    default:
      return assertNever(block);
  }
}

export function StructuredContentBlocks({
  blocks,
  onVideo,
  onImage
}: StructuredContentBlocksProps): ReactElement {
  return (
    <>
      {blocks.map((block) => (
        <div key={block.sourceId} data-source-id={block.sourceId}>
          {renderBlock(block, onVideo, onImage)}
        </div>
      ))}
    </>
  );
}
