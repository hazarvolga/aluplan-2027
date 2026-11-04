'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';
import type { StructuredMediaGridSection } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

export interface FuncsGridCarsProps {
  grid: StructuredMediaGridSection;
  itemKeyPrefix: string;
  onVideo: (video: { youtubeId: string; title: string }) => void;
  onImage: (image: { src: string; title: string }) => void;
}

export function FuncsGridCars({ grid, itemKeyPrefix, onVideo, onImage }: FuncsGridCarsProps): ReactElement {
  const columns = grid.columns || 3;
  return (
        <div className={`alu-media-grid alu-media-grid--cols-${columns}`}>
          {grid.items.map((item, index) => {
            const hasVideo = Boolean(item.youtubeId);
            const resolvedThumbSrc =
              item.imageSrc ||
              (item.youtubeId ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` : '');
            const hasImage = Boolean(resolvedThumbSrc);

            return (
              <article
                key={item.sourceId || `${itemKeyPrefix}-${item.title}-${index}`}
                className={`alu-media-card${hasVideo ? ' alu-media-card--video' : ''}`}
                data-source-id={item.sourceId}
              >
                {hasImage && (
                  <div
                    className="alu-media-card__thumb"
                    role="button"
                    tabIndex={0}
                    aria-label={
                      hasVideo
                        ? `${item.title} videosunu pop-up pencerede oynat`
                        : `${item.title} görselini büyüt`
                    }
                    onClick={() => {
                      if (item.youtubeId) {
                        onVideo({ youtubeId: item.youtubeId, title: item.title });
                      } else if (resolvedThumbSrc) {
                        onImage({ src: resolvedThumbSrc, title: item.title });
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        if (item.youtubeId) {
                          onVideo({ youtubeId: item.youtubeId, title: item.title });
                        } else if (resolvedThumbSrc) {
                          onImage({ src: resolvedThumbSrc, title: item.title });
                        }
                      }
                    }}
                  >
                    <img src={resolvedThumbSrc} alt={item.title} loading="lazy" />
                    <div className="alu-media-card__scrim" aria-hidden="true" />
                    {hasVideo ? (
                      <>
                        <span className="alu-media-card__play" aria-hidden="true">
                          <span className="alu-media-card__play-circle">
                            <AluIcon name="circle-play" size="lg" />
                          </span>
                        </span>
                      </>
                    ) : (
                      <span className="alu-media-card__zoom-hint" aria-hidden="true">
                        <AluIcon name="sparkles" size="sm" />
                      </span>
                    )}
                  </div>
                )}

                <div className="alu-media-card__body">
                  {(item.badge || item.subtitle) && (
                    <div className="alu-media-card__meta">
                      {item.badge && (
                        <span className="alu-badge alu-badge--accent">{item.badge}</span>
                      )}
                      {item.subtitle && (
                        <span className="alu-media-card__subtitle">{item.subtitle}</span>
                      )}
                    </div>
                  )}

                  <h3 className="alu-media-card__title">{item.title}</h3>

                  {item.description && (
                    <p className="alu-media-card__desc">{item.description}</p>
                  )}

                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="alu-media-card__bullets">
                      {item.bullets.map((b, bIdx) => (
                        <li key={bIdx}>
                          <AluIcon name="check" size="sm" />
                          <span>{b.replace(/^•\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {!hasVideo && item.href && (
                    <div className="alu-media-card__footer">
                      {item.href ? (
                        item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="alu-link alu-link--standalone"
                            aria-label={`${item.ctaText || 'Detayları İncele'}: ${item.title}`}
                          >
                            <span>{item.ctaText || 'Detayları İncele'}</span>
                            <AluIcon name="external-link" size="sm" />
                          </a>
                        ) : (
                          <Link href={item.href} className="alu-link alu-link--standalone" aria-label={`${item.ctaText || 'Detayları İncele'}: ${item.title}`}>
                            <span>{item.ctaText || 'Detayları İncele'}</span>
                            <AluIcon name="arrow-right" size="sm" />
                          </Link>
                        )
                      ) : null}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
  );
}
