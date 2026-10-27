'use client';

import type { ReactElement } from 'react';

import type { StructuredSplitCallout } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

interface SplitCalloutVideoRequest {
  youtubeId?: string;
  videoSrc?: string;
  title: string;
}

interface SplitCalloutImageRequest {
  src: string;
  title: string;
}

interface SplitCalloutSectionProps {
  callouts: StructuredSplitCallout[];
  itemKeyPrefix: 'callout-top' | 'callout-bottom';
  onVideo: (video: SplitCalloutVideoRequest) => void;
  onImage: (image: SplitCalloutImageRequest) => void;
}

export function SplitCalloutSection({
  callouts,
  itemKeyPrefix,
  onVideo,
  onImage
}: SplitCalloutSectionProps): ReactElement {
  return (
    <>
      {callouts.map((callout, index) => {
        const hasYoutubeVideo = Boolean(callout.youtubeId);
        const hasLocalVideo = Boolean(callout.videoSrc);
        const hasVideo = hasYoutubeVideo || hasLocalVideo;
        const thumbSrc =
          callout.imageSrc ||
          (callout.youtubeId
            ? `https://img.youtube.com/vi/${callout.youtubeId}/hqdefault.jpg`
            : '');
        const isReversed = callout.reverse ?? index % 2 === 1;
        const hasMedia = hasVideo || Boolean(thumbSrc);
        const paragraphs =
          callout.paragraphs && callout.paragraphs.length > 0
            ? callout.paragraphs
            : callout.description
              ? [callout.description]
              : [];

        return (
          <section
            key={callout.sourceId || `${itemKeyPrefix}-${callout.title}-${index}`}
            className="preview-section preview-section--subtle"
            aria-label={callout.title}
            data-source-id={callout.sourceId}
          >
            <div className="alu-container">
              <div
                className={`alu-scia-callout${
                  isReversed ? ' alu-scia-callout--reverse' : ''
                }${hasMedia ? '' : ' alu-scia-callout--content-only'}`}
              >
                {hasMedia && <div
                  className={`alu-scia-callout__media${
                    hasVideo || thumbSrc ? ' alu-scia-callout__media--interactive' : ''
                  }`}
                  role={hasVideo || thumbSrc ? 'button' : undefined}
                  tabIndex={hasVideo || thumbSrc ? 0 : undefined}
                  aria-label={
                    hasVideo
                      ? `${callout.title} videosunu pop-up pencerede oynat`
                      : `${callout.title} görselini büyüt`
                  }
                  onClick={() => {
                    if (callout.youtubeId) {
                      onVideo({
                        youtubeId: callout.youtubeId,
                        title: callout.title
                      });
                    } else if (callout.videoSrc) {
                      onVideo({
                        videoSrc: callout.videoSrc,
                        title: callout.title
                      });
                    } else if (thumbSrc) {
                      onImage({
                        src: thumbSrc,
                        title: callout.title
                      });
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      if (callout.youtubeId) {
                        onVideo({
                          youtubeId: callout.youtubeId,
                          title: callout.title
                        });
                      } else if (callout.videoSrc) {
                        onVideo({
                          videoSrc: callout.videoSrc,
                          title: callout.title
                        });
                      } else if (thumbSrc) {
                        onImage({
                          src: thumbSrc,
                          title: callout.title
                        });
                      }
                    }
                  }}
                >
                  {hasLocalVideo && callout.videoSrc ? (
                    <video
                      src={callout.videoSrc}
                      poster={callout.imageSrc || undefined}
                      muted
                      playsInline
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : thumbSrc ? (
                    <img src={thumbSrc} alt={callout.title} loading="lazy" />
                  ) : null}

                  <div className="alu-media-card__scrim" aria-hidden="true" />

                  {hasVideo ? (
                    <>
                      <span className="alu-media-card__video-badge">
                        <AluIcon name="video" size="sm" />
                        <span>POPUP VİDEO</span>
                      </span>
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
                </div>}

                <div className="alu-scia-callout__content">
                  {callout.kicker && (
                    <span className="preview-kicker">{callout.kicker}</span>
                  )}
                  <h2 className="alu-h2" style={{ margin: 0 }}>
                    {callout.title}
                  </h2>
                  {callout.lead && (
                    <p className="alu-scia-callout__lead">{callout.lead}</p>
                  )}
                  {callout.subheading && (
                    <h3 className="alu-h4" style={{ margin: 0, color: 'var(--accent-fg)' }}>
                      {callout.subheading}
                    </h3>
                  )}
                  {paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="alu-body" style={{ margin: 0 }}>
                      {paragraph}
                    </p>
                  ))}
                  {callout.bullets && callout.bullets.length > 0 && (
                    <ul className="alu-media-card__bullets" style={{ marginTop: 'var(--space-application-jsx-tight)' }}>
                      {callout.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>
                          <AluIcon name="check" size="sm" />
                          <span>{bullet.replace(/^•\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="alu-cluster" style={{ marginTop: 'var(--space-application-jsx-regular)' }}>
                    {hasVideo && (
                      <button
                        type="button"
                        className="alu-button alu-button--primary alu-button--md"
                        onClick={() => {
                          if (callout.youtubeId) {
                            onVideo({
                              youtubeId: callout.youtubeId,
                              title: callout.title
                            });
                          } else if (callout.videoSrc) {
                            onVideo({
                              videoSrc: callout.videoSrc,
                              title: callout.title
                            });
                          }
                        }}
                      >
                        <AluIcon name="circle-play" size="sm" />
                        <span>Videoyu İzle</span>
                      </button>
                    )}
                    {callout.ctaHref && (
                      <a
                        href={callout.ctaHref}
                        target={callout.external ? '_blank' : undefined}
                        rel={callout.external ? 'noopener noreferrer' : undefined}
                        className="alu-button alu-button--secondary alu-button--md"
                      >
                        <span>{callout.ctaText || 'Detayları İnceleyin'}</span>
                        <AluIcon name="external-link" size="sm" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
