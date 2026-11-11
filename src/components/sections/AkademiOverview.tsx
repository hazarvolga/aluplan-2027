import type { ReactElement } from 'react';
import { AluIcon } from '@/components/ui/AluIcon';
import { akademiProgram } from '@/data/akademi-content';
import { CompactPageHero } from './CompactPageHero';
import { DebugComponentLabel } from './DebugComponentLabel';
import { SectionHeader } from './SectionHeader';
import { Callout, LevelCard } from '@/components/akademi/kit';
import { RevealList } from '@/components/akademi/motion/RevealList';
import { AkademiJsonLd } from '@/components/akademi/AkademiJsonLd';
import { AkademiKatalogBolumu } from './AkademiKatalogBolumu';
import styles from './AkademiOverview.module.css';

export function AkademiOverview({ seviye, rol, sure }: { seviye?: string; rol?: string; sure?: string }): ReactElement {
  const {
    hero: akademiHero,
    levels: akademiLevels,
    runningProject: akademiRunningProject,
    lessonParts: akademiLessonParts,
    progressNote: akademiProgressNote,
    certificate: akademiCertificate,
  } = akademiProgram;

  return (
    <div className={styles.page}>
      <AkademiJsonLd />
      <DebugComponentLabel name="CompactPageHero">
        <CompactPageHero title={akademiHero.title} lead={akademiHero.lead}>
          <div className={styles.heroActions}>
            <a className="alu-button alu-button--primary alu-button--md" href="#katalog">Katalog ve yolları gör</a>
          </div>
        </CompactPageHero>
      </DebugComponentLabel>

      <AkademiKatalogBolumu seviye={seviye} rol={rol} sure={sure} baseHref="/akademi" />

      <DebugComponentLabel name="AkademiLevels (kit)">
        <section id="seviyeler" className={styles.band} aria-labelledby="akademi-seviyeler">
          <div className="alu-container">
            <SectionHeader id="akademi-seviyeler" kicker="PROGRAM" title="Dört seviye, dört disiplin kolu" lead="Seviye 1, 2 ve 4 herkes için ortaktır. Seviye 3’te mimari, betonarme, prekast ve çelik ya da altyapı kollarından birini seçersiniz; kolların süreleri eşittir. Süreler taslaktır." />
            <RevealList className={styles.levelGrid}>
              {akademiLevels.map((level) => (
                <li key={level.number} className={styles.levelGridItem}>
                  <LevelCard level={level} />
                </li>
              ))}
            </RevealList>
          </div>
        </section>
      </DebugComponentLabel>

      <DebugComponentLabel name="AkademiRunningProject (özel)">
        <section className={styles.band} aria-labelledby="akademi-proje">
          <div className="alu-container">
            <SectionHeader id="akademi-proje" kicker="UYGULAMA" title={akademiRunningProject.title} lead={akademiRunningProject.lead} />
            <ol className={styles.projectSteps}>
              {akademiRunningProject.steps.map((step) => (
                <li key={step.level} className={styles.projectStep}>
                  <span className={styles.projectLevel}>{step.level}</span>
                  <span className={styles.text}>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </DebugComponentLabel>

      <DebugComponentLabel name="AkademiLessonFormat (özel)">
        <section className={styles.band} aria-labelledby="akademi-ders">
          <div className="alu-container">
            <SectionHeader id="akademi-ders" kicker="DERS YAPISI" title="Her ders aynı düzende ilerler" />
            <ul className={styles.partGrid}>
              {akademiLessonParts.map((part) => (
                <li key={part.title} className={styles.part}>
                  <span className={styles.icon} aria-hidden="true"><AluIcon name={part.icon} size="md" /></span>
                  <h3 className={styles.cardTitle}>{part.title}</h3>
                  <p className={styles.text}>{part.text}</p>
                </li>
              ))}
            </ul>
            <div className={styles.noteWrap}>
              <Callout label="Öz değerlendirme">
                <p>{akademiProgressNote}</p>
              </Callout>
            </div>
          </div>
        </section>
      </DebugComponentLabel>

      <DebugComponentLabel name="AkademiNextSteps (özel)">
        <section className={`${styles.band} ${styles.lastBand}`} aria-labelledby="akademi-sonraki">
          <div className="alu-container">
            <SectionHeader id="akademi-sonraki" kicker="SONRAKI ADIM" title="Sertifika" />
            <div className={styles.split}>
              <article className={styles.panel}>
                <span className={styles.icon} aria-hidden="true"><AluIcon name="award" size="md" /></span>
                <h3 className={styles.cardTitle}>{akademiCertificate.title}</h3>
                <p className={styles.text}>{akademiCertificate.text}</p>
                <a className="alu-button alu-button--primary alu-button--md" href={akademiCertificate.action.href}>{akademiCertificate.action.label}</a>
              </article>
            </div>
          </div>
        </section>
      </DebugComponentLabel>
    </div>
  );
}
