'use client';

import React, { useState } from 'react';
import type { StructuredWorkflowTabsSection } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { handleStructuredTabKey } from './structured-tab-key';
import { SectionHeader } from './SectionHeader';


export function WorkflowSection({
  content: wfTabs,
  onVideo,
  onImage
}: {
  content: StructuredWorkflowTabsSection;
  onVideo: (video: { youtubeId?: string; videoSrc?: string; title: string }) => void;
  onImage: (image: { src: string; title: string }) => void;
}) {
  const [activeWfCatIdx, setActiveWfCatIdx] = useState<number>(0);
  const [activeWfItemIdx, setActiveWfItemIdx] = useState<number>(0);
  const safeCatIdx = wfTabs.categories.length > 0
    ? Math.min(activeWfCatIdx, wfTabs.categories.length - 1) : 0;
  const currentWfCat = wfTabs.categories[safeCatIdx];
  const safeItemIdx = currentWfCat && currentWfCat.items.length > 0
    ? Math.min(activeWfItemIdx, currentWfCat.items.length - 1) : 0;
  const currentWfItem = currentWfCat?.items[safeItemIdx];

  return (
    <>
      {wfTabs && wfTabs.categories.length > 0 && currentWfCat && (
        <section className="preview-section preview-section--subtle" aria-label={wfTabs.title}>
          <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
            <SectionHeader kicker={wfTabs.kicker} title={wfTabs.title} lead={wfTabs.subtitle} />

            {/* Category Tabs Bar */}
            <div className="alu-wf-cats" role="tablist" aria-label={wfTabs.title}>
              {wfTabs.categories.map((cat, cIdx) => {
                const isCatActive = cIdx === safeCatIdx;
                return (
                  <button
                    key={cat.key || cIdx}
                    type="button"
                    role="tab"
                    id={`workflow-category-tab-${cIdx}`}
                    aria-controls="workflow-category-panel"
                    aria-selected={isCatActive}
                    tabIndex={isCatActive ? 0 : -1}
                    onKeyDown={(event) => handleStructuredTabKey(event, cIdx, wfTabs.categories.length, (nextIndex) => {
                      setActiveWfCatIdx(nextIndex);
                      setActiveWfItemIdx(0);
                    })}
                    className={`alu-wf-cat-btn${isCatActive ? ' alu-wf-cat-btn--active' : ''}`}
                    onClick={() => {
                      setActiveWfCatIdx(cIdx);
                      setActiveWfItemIdx(0);
                    }}
                  >
                    <span className="alu-wf-cat-btn__num">0{cIdx + 1}</span>
                    <span>{cat.label}</span>
                    <span className="alu-wf-cat-btn__count">{cat.items.length}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Category Split Stage: Left Sub-Tab List + Right Showcase Card */}
            <div
              className="alu-wf-stage"
              id="workflow-category-panel"
              role="tabpanel"
              aria-labelledby={`workflow-category-tab-${safeCatIdx}`}
              tabIndex={0}
            >
              <div className="alu-wf-sublist" role="tablist" aria-label={currentWfCat.label} aria-orientation="vertical">
                {currentWfCat.items.map((subItem, sIdx) => {
                  const isSubActive = sIdx === safeItemIdx;
                  return (
                    <button
                      key={`${subItem.title}-${sIdx}`}
                      type="button"
                      role="tab"
                      id={`workflow-item-tab-${safeCatIdx}-${sIdx}`}
                      aria-controls="workflow-item-panel"
                      aria-selected={isSubActive}
                      tabIndex={isSubActive ? 0 : -1}
                      onKeyDown={(event) => handleStructuredTabKey(event, sIdx, currentWfCat.items.length, setActiveWfItemIdx, true)}
                      className={`alu-wf-subbtn${isSubActive ? ' alu-wf-subbtn--active' : ''}`}
                      onClick={() => setActiveWfItemIdx(sIdx)}
                    >
                      <span className="alu-wf-subbtn__num">
                        {sIdx + 1 < 10 ? `0${sIdx + 1}` : sIdx + 1}
                      </span>
                      <span className="alu-wf-subbtn__title">{subItem.title}</span>
                      {subItem.youtubeId && (
                        <span className="alu-wf-subbtn__video-dot" title="Video içerir">
                          <AluIcon name="circle-play" size="sm" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {currentWfItem && (
                <article
                  className="alu-wf-detail"
                  key={`${safeCatIdx}-${safeItemIdx}`}
                  id="workflow-item-panel"
                  role="tabpanel"
                  aria-labelledby={`workflow-item-tab-${safeCatIdx}-${safeItemIdx}`}
                  tabIndex={0}
                >
                  {currentWfItem.imageSrc && (
                    <div
                      className="alu-wf-detail__media"
                      role="button"
                      tabIndex={0}
                      aria-label={
                        currentWfItem.youtubeId
                          ? `${currentWfItem.title} videosunu oynat`
                          : `${currentWfItem.title} görselini büyüt`
                      }
                      onClick={() => {
                        if (currentWfItem.youtubeId) {
                          onVideo({
                            youtubeId: currentWfItem.youtubeId,
                            title: currentWfItem.title
                          });
                        } else if (currentWfItem.imageSrc) {
                          onImage({
                            src: currentWfItem.imageSrc,
                            title: currentWfItem.title
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (currentWfItem.youtubeId) {
                            onVideo({
                              youtubeId: currentWfItem.youtubeId,
                              title: currentWfItem.title
                            });
                          } else if (currentWfItem.imageSrc) {
                            onImage({
                              src: currentWfItem.imageSrc,
                              title: currentWfItem.title
                            });
                          }
                        }
                      }}
                    >
                      <img
                        src={currentWfItem.imageSrc}
                        alt={currentWfItem.title}
                        loading="lazy"
                      />
                      {currentWfItem.youtubeId && (
                        <span className="alu-media-card__play" aria-hidden="true">
                          <span className="alu-media-card__play-circle">
                            <AluIcon name="circle-play" size="lg" />
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="alu-wf-detail__body">
                    <div className="alu-cluster" style={{ justifyContent: 'space-between' }}>
                      <span className="preview-kicker">
                        {currentWfCat.label.toUpperCase()} · {safeItemIdx + 1} /{' '}
                        {currentWfCat.items.length}
                      </span>
                      {currentWfItem.badge && (
                        <span className="alu-badge alu-badge--accent">
                          {currentWfItem.badge}
                        </span>
                      )}
                    </div>

                    {currentWfItem.subtitle && (
                      <p className="alu-wf-detail__subtitle">{currentWfItem.subtitle}</p>
                    )}

                    <h3 className="alu-h2" style={{ margin: 0 }}>
                      {currentWfItem.title}
                    </h3>

                    <p className="alu-body" style={{ margin: 0 }}>
                      {currentWfItem.description}
                    </p>

                    {currentWfItem.bullets && currentWfItem.bullets.length > 0 && (
                      <ul className="alu-media-card__bullets">
                        {currentWfItem.bullets.map((b, bIdx) => (
                          <li key={bIdx}>
                            <AluIcon name="check" size="sm" />
                            <span>{b.replace(/^•\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {currentWfItem.youtubeId && (
                      <div style={{ marginTop: 'var(--space-application-jsx-regular)' }}>
                        <button
                          type="button"
                          className="alu-button alu-button--primary alu-button--md"
                          onClick={() =>
                            onVideo({
                              youtubeId: currentWfItem.youtubeId!,
                              title: currentWfItem.title
                            })
                          }
                        >
                          <AluIcon name="circle-play" size="sm" />
                          <span>Videoyu Görüntüle</span>
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
