'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { StructuredTrainingTabs } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

/** Keep every source panel in HTML; selection only controls its visibility. */
export function TrainingTabs({ content }: { content: StructuredTrainingTabs }) {
  const [selectedKey, setSelectedKey] = useState(content.tabs[0]?.key);
  if (content.tabs.length === 0) return null;

  return (
    <section className="preview-section" aria-labelledby="training-tabs-heading">
      <div className="alu-container alu-stack">
        <h2 id="training-tabs-heading" className="alu-h2">{content.title}</h2>
        <div className="alu-wf-cats" role="tablist" aria-label={content.title}>
          {content.tabs.map((tab, index) => (
            <button
              key={tab.key}
              type="button"
              id={`training-tab-${tab.key}`}
              role="tab"
              aria-selected={selectedKey === tab.key}
              aria-controls={`training-panel-${tab.key}`}
              tabIndex={selectedKey === tab.key ? 0 : -1}
              className={`alu-wf-cat-btn${selectedKey === tab.key ? ' alu-wf-cat-btn--active' : ''}`}
              onClick={() => setSelectedKey(tab.key)}
              onKeyDown={(event) => {
                const nextIndex = event.key === 'Home' ? 0
                  : event.key === 'End' ? content.tabs.length - 1
                  : event.key === 'ArrowRight' ? (index + 1) % content.tabs.length
                  : event.key === 'ArrowLeft' ? (index - 1 + content.tabs.length) % content.tabs.length
                  : null;
                if (nextIndex === null) return;
                event.preventDefault();
                const next = content.tabs[nextIndex];
                setSelectedKey(next.key);
                document.getElementById(`training-tab-${next.key}`)?.focus();
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {content.tabs.map((tab) => (
          <div
            key={tab.key}
            id={`training-panel-${tab.key}`}
            role="tabpanel"
            aria-labelledby={`training-tab-${tab.key}`}
            tabIndex={0}
            hidden={selectedKey !== tab.key}
          >
            <article className="alu-service-card alu-stack">
              <h3 className="alu-h3">{tab.title}</h3>
              {tab.paragraphs.map((paragraph, index) => (
                <p key={index} className="alu-body">{paragraph}</p>
              ))}
              {tab.features.length > 0 && (
                <ul className="alu-intro-split__bullets">
                  {tab.features.map((feature, index) => (
                    <li key={index} className="alu-intro-split__bullet">
                      <span className="alu-intro-split__bullet-icon"><AluIcon name="check" size="sm" /></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tab.imageSrc && (
                <img src={tab.imageSrc} alt="" loading="lazy" style={{ width: '100%', maxWidth: '32rem', height: 'auto' }} />
              )}
              <div className="alu-cluster">
                {tab.href.startsWith('/') ? (
                  <Link href={tab.href} className="alu-button alu-button--primary alu-button--md">{tab.linkLabel}</Link>
                ) : (
                  <a href={tab.href} target="_blank" rel="noopener noreferrer" className="alu-button alu-button--primary alu-button--md">
                    <span>{tab.linkLabel}</span><AluIcon name="external-link" size="sm" />
                  </a>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
