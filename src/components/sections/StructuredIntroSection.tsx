'use client';

import type { StructuredIntro } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { ConsentEmbed } from '@/components/ui/ConsentEmbed';
import { DebugComponentLabel } from './DebugComponentLabel';
import styles from './StructuredIntroSection.module.css';

export function StructuredIntroSection({ intro, compactBullets = false }: { intro: StructuredIntro; compactBullets?: boolean }) {
  return (
    <DebugComponentLabel name="StructuredIntroSection">
      <section className="preview-section" aria-label={intro.title}>
        <div className="alu-container">
          <div className={`alu-intro-split${intro.videoEmbedUrl ? '' : ' alu-intro-split--single'}`}>
            <div className="alu-intro-split__content">
              {intro.kicker && <span className="preview-kicker">{intro.kicker}</span>}
              <h2 className="alu-h2" style={{ margin: 0 }}>{intro.title}</h2>
              {intro.paragraphs?.map((paragraph, index) => <p key={index} className="alu-body">{paragraph}</p>)}
              {intro.bullets.length > 0 && (
                <ul className={`alu-intro-split__bullets${compactBullets ? ` ${styles.compactBullets}` : ''}`}>
                  {intro.bullets.map((bullet, index) => (
                    <li key={index} className="alu-intro-split__bullet">
                      <span className="alu-intro-split__bullet-icon"><AluIcon name="check" size="sm" /></span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {intro.videoEmbedUrl && (
              <div className="alu-intro-split__media">
                <div className="alu-intro-split__video-frame">
                  <ConsentEmbed src={intro.videoEmbedUrl} title={intro.title ?? ''} fill />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </DebugComponentLabel>
  );
}
