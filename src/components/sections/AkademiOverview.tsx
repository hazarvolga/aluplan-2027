import type { ReactElement } from 'react';
import { AluIcon } from '@/components/ui/AluIcon';
import {
  akademiCertificate,
  akademiEntryPaths,
  akademiHero,
  akademiKnowledgeBase,
  akademiLessonParts,
  akademiLevels,
  akademiProgressNote,
  akademiRunningProject,
} from '@/data/akademi';
import type { AkademiLevel, AkademiModule } from '@/data/akademi';
import { CompactPageHero } from './CompactPageHero';
import { DebugComponentLabel } from './DebugComponentLabel';
import { SectionHeader } from './SectionHeader';
import styles from './AkademiOverview.module.css';

function totalHours(modules: readonly AkademiModule[]): number {
  return modules.reduce((sum, module) => sum + module.hours, 0);
}

function ModuleList({ modules }: { modules: readonly AkademiModule[] }): ReactElement {
  return (
    <ul className={styles.modules}>
      {modules.map((module) => (
        <li key={module.code} className={styles.module}>
          <span className={styles.moduleCode}>{module.code}</span>
          <span className={styles.moduleTitle}>
            {module.title}
            {module.proposed && <span className={styles.proposed}>önerilen</span>}
          </span>
          <span className={styles.moduleHours}>{module.hours} sa</span>
        </li>
      ))}
    </ul>
  );
}

function LevelCard({ level }: { level: AkademiLevel }): ReactElement {
  return (
    <li className={`${styles.level} ${level.shared ? '' : styles.levelTracks}`}>
      <div className={styles.levelHead}>
        <span className={styles.levelNumber} aria-hidden="true">{level.number}</span>
        <div>
          <h3 className={styles.levelTitle}>Seviye {level.number} · {level.title}</h3>
          <p className={styles.levelRole}>{level.role} · {level.shared ? 'Ortak çekirdek' : 'Disiplin kolları'}</p>
        </div>
      </div>
      <p className={styles.text}>{level.summary}</p>
      {level.modules && (
        <>
          <ModuleList modules={level.modules} />
          <p className={styles.levelTotal}>Toplam {totalHours(level.modules)} saat</p>
        </>
      )}
      {level.tracks && (
        <ul className={styles.tracks}>
          {level.tracks.map((track) => (
            <li key={track.title} className={styles.track}>
              <h4 className={styles.trackTitle}>{track.title}</h4>
              <p className={styles.text}>{track.summary}</p>
              <ModuleList modules={track.modules} />
              <p className={styles.levelTotal}>{totalHours(track.modules)} saat</p>
            </li>
          ))}
        </ul>
      )}
      <a className={`alu-button alu-button--ghost alu-button--sm ${styles.levelLink}`} href={`/akademi/${level.slug}`}>
        Seviye {level.number} detayını inceleyin →
      </a>
    </li>
  );
}

export function AkademiOverview(): ReactElement {
  return (
    <div className={styles.page}>
      <DebugComponentLabel name="CompactPageHero">
        <CompactPageHero kicker={akademiHero.kicker} title={akademiHero.title} lead={akademiHero.lead}>
          <div className={styles.heroActions}>
            <a className="alu-button alu-button--primary alu-button--md" href="#seviyeler">Programı inceleyin</a>
            <a className="alu-button alu-button--secondary alu-button--md" href="#baslangic">Nereden başlamalıyım?</a>
          </div>
        </CompactPageHero>
      </DebugComponentLabel>

      <DebugComponentLabel name="AkademiEntryPaths (özel)">
        <section id="baslangic" className={styles.band} aria-labelledby="akademi-baslangic">
          <div className="alu-container">
            <SectionHeader id="akademi-baslangic" kicker="BAŞLANGIÇ" title="Nereden başlamalısınız?" lead="Aynı program, iki farklı giriş noktası. Daha önce başka bir BIM yazılımı kullandıysanız temelleri tekrar etmenize gerek yok." />
            <ul className={styles.entryGrid}>
              {akademiEntryPaths.map((path) => (
                <li key={path.title} className={styles.entry}>
                  <span className={styles.icon} aria-hidden="true"><AluIcon name={path.icon} size="md" /></span>
                  <h3 className={styles.cardTitle}>{path.title}</h3>
                  <p className={styles.levelRole}>{path.audience}</p>
                  <ol className={styles.steps}>
                    {path.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </DebugComponentLabel>

      <DebugComponentLabel name="AkademiLevels (özel)">
        <section id="seviyeler" className={styles.band} aria-labelledby="akademi-seviyeler">
          <div className="alu-container">
            <SectionHeader id="akademi-seviyeler" kicker="PROGRAM" title="Dört seviye, dört disiplin kolu" lead="Seviye 1, 2 ve 4 herkes için ortaktır. Seviye 3’te mimari, betonarme, prekast ve çelik ya da altyapı kollarından birini seçersiniz; kolların süreleri eşittir. Süreler taslaktır." />
            <ol className={styles.levels}>
              {akademiLevels.map((level) => <LevelCard key={level.number} level={level} />)}
            </ol>
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
            <p className={styles.note}><span aria-hidden="true"><AluIcon name="info" size="sm" /></span> {akademiProgressNote}</p>
          </div>
        </section>
      </DebugComponentLabel>

      <DebugComponentLabel name="AkademiNextSteps (özel)">
        <section className={`${styles.band} ${styles.lastBand}`} aria-labelledby="akademi-sonraki">
          <div className="alu-container">
            <SectionHeader id="akademi-sonraki" kicker="SONRAKI ADIM" title="Sertifika ve bilgi bankası" />
            <div className={styles.split}>
              <article className={styles.panel}>
                <span className={styles.icon} aria-hidden="true"><AluIcon name="award" size="md" /></span>
                <h3 className={styles.cardTitle}>{akademiCertificate.title}</h3>
                <p className={styles.text}>{akademiCertificate.text}</p>
                <a className="alu-button alu-button--primary alu-button--md" href={akademiCertificate.action.href}>{akademiCertificate.action.label}</a>
              </article>
              <article className={styles.panel}>
                <span className={styles.icon} aria-hidden="true"><AluIcon name="file-text" size="md" /></span>
                <h3 className={styles.cardTitle}>{akademiKnowledgeBase.title}</h3>
                <p className={styles.text}>{akademiKnowledgeBase.text}</p>
              </article>
            </div>
          </div>
        </section>
      </DebugComponentLabel>
    </div>
  );
}
