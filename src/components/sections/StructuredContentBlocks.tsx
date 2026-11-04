'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';

import type { StructuredContentBlock } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { MetricCards } from './MetricCards';
import { ChallengesBand } from './ChallengesBand';
import { BenefitsSection } from './BenefitsSection';
import { LinkGroupGridSection } from './LinkGroupGridSection';
import { MediaGridSection } from './MediaGridSection';
import { SplitCalloutSection } from './SplitCalloutSection';
import { ConsentEmbed } from '@/components/ui/ConsentEmbed';
import { DebugComponentLabel } from './DebugComponentLabel';
import { ProductsOverview } from './ProductsOverview';
import { SectionHeader } from './SectionHeader';

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

function blockLabel(block: StructuredContentBlock): string {
  switch (block.kind) {
    case 'intro': return 'introSplit (özel)';
    case 'challenges': return 'challengesSection (özel)';
    case 'stats': return 'metricsSection (özel)';
    case 'linkGroupGrid': return 'LinkGroupGridSection';
    case 'benefits': return 'BenefitsSection';
    case 'mediaGrid': return block.sourceId === 'industry-products' ? 'Ürün Paketleri (özel)' : 'MediaGridSection';
    case 'splitCallouts': return 'SplitCalloutSection';
    default: return assertNever(block);
  }
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
                {block.content.title && <h2 className="alu-h2" style={{ margin: 0 }}>{block.content.title}</h2>}
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
                    <ConsentEmbed src={block.content.videoEmbedUrl} title={introLabel} fill />
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
            <ChallengesBand title={block.title || 'Günümüz Projelerinde Karşılaşılan Temel Zorluklar'} items={block.items} />
          </div>
        </section>
      );
    case 'stats':
      return (
        <section className="preview-section" aria-label="Performans Göstergeleri">
          <div className="alu-container">
            <MetricCards items={block.items} />
          </div>
        </section>
      );
    case 'linkGroupGrid':
      return <LinkGroupGridSection grid={block.content} />;
    case 'benefits':
      return <BenefitsSection benefits={block.content} />;
    case 'mediaGrid':
      if (block.sourceId === 'industry-products' && block.content.items.every(item => item.href && !item.youtubeId)) {
        const featured = block.content.items.filter(item => item.sourceId === 'industry-product-ultimate');
        const others = block.content.items.filter(item => item.sourceId !== 'industry-product-ultimate');
        return (
          <section className="preview-section" aria-label={block.content.title}>
            <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
              <SectionHeader kicker={block.content.kicker} title={block.content.title} lead={block.content.subtitle} />
              <DebugComponentLabel name="ProductsOverview"><ProductsOverview headingLevel={3} featuredSquare onImage={onImage} items={[...featured, ...others].map(item => ({
                sourceId: item.sourceId,
                href: item.href!,
                title: item.title,
                description: item.description,
                image: item.imageSrc ? { src: item.imageSrc, alt: item.title } : undefined,
                badge: item.badge ?? undefined,
                actionLabel: item.ctaText ?? undefined,
                external: item.external,
              }))} /></DebugComponentLabel>
            </div>
          </section>
        );
      }
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
  const firstChallenge = blocks.findIndex((block) => block.kind === 'challenges');
  const laterStats = firstChallenge < 0 ? [] : blocks.filter((block, index) => index > firstChallenge && block.kind === 'stats');
  const orderedBlocks = laterStats.length === 0 ? blocks : blocks.flatMap((block, index) => {
    if (index === firstChallenge) return [...laterStats, block];
    return index > firstChallenge && block.kind === 'stats' ? [] : [block];
  });

  return (
    <>
      {orderedBlocks.map((block) => (
        <div key={block.sourceId} data-source-id={block.sourceId}>
          <DebugComponentLabel name={blockLabel(block)}>
            {renderBlock(block, onVideo, onImage)}
          </DebugComponentLabel>
        </div>
      ))}
    </>
  );
}
