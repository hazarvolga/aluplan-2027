import type { ReactElement } from 'react';
import { AluIcon } from '@/components/ui/AluIcon';
import { akademiLevels } from '@/data/akademi';
import type { AkademiLevel, AkademiModule } from '@/data/akademi';
import { CompactPageHero } from './CompactPageHero';
import { DebugComponentLabel } from './DebugComponentLabel';
import { SectionHeader } from './SectionHeader';
import styles from './AkademiLevelDetail.module.css';

function totalHours(modules: readonly AkademiModule[]): number {
  return modules.reduce((sum, module) => sum + module.hours, 0);
}

function ModuleCard({ module }: { module: AkademiModule }): ReactElement {
  return (
    <li className={styles.module}>
      <div className={styles.moduleHead}>
        <span className={styles.moduleCode}>{module.code}</span>
        <h3 className={styles.moduleTitle}>
          {module.title}
          {module.proposed && <span className={styles.proposed}>önerilen</span>}
        </h3>
        <span className={styles.moduleHours}>{module.hours} sa</span>
      </div>
      {module.outcomes && (
        <ul className={styles.outcomes}>
          {module.outcomes.map((outcome) => (
            <li key={outcome} className={styles.outcome}>
              <span className={styles.outcomeIcon} aria-hidden="true"><AluIcon name="check" size="sm" /></span>
              {outcome}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function levelHours(level: AkademiLevel): number {
  if (level.modules) return totalHours(level.modules);
  if (level.tracks) return totalHours(level.tracks[0]?.modules ?? []);
  return 0;
}

export function AkademiLevelDetail({ level }: { level: AkademiLevel }): ReactElement {
  const index = akademiLevels.findIndex((item) => item.slug === level.slug);
  const previous = index > 0 ? akademiLevels[index - 1] : undefined;
  const next = index < akademiLevels.length - 1 ? akademiLevels[index + 1] : undefined;

  return (
    <div className={styles.page}>
      <DebugComponentLabel name="AkademiLevelDetail (özel)">
        <CompactPageHero
          kicker={`SEVİYE ${level.number} · ${level.shared ? 'ORTAK' : 'DISIPLIN KOLLARI'}`}
          title={`Seviye ${level.number} · ${level.title}`}
          lead={level.summary}
        >
          <p className={styles.meta}>
            <span className={styles.icon} aria-hidden="true"><AluIcon name="users" size="sm" /></span>
            {level.role} · {level.shared ? 'Ortak çekirdek' : 'Dört eşit süreli koldan biri'} ·{' '}
            {level.shared ? `${levelHours(level)} saat` : `kol başına ${levelHours(level)} saat`}
          </p>
          <div className={styles.heroActions}>
            <a className="alu-button alu-button--secondary alu-button--md" href="/akademi#seviyeler">
              Tüm program
            </a>
          </div>
        </CompactPageHero>
      </DebugComponentLabel>

      {level.modules && (
        <DebugComponentLabel name="AkademiLevelModules (özel)">
          <section className={styles.band} aria-labelledby="seviye-moduller">
            <div className="alu-container">
              <SectionHeader
                id="seviye-moduller"
                kicker="MODÜLLER"
                title="Bu seviyedeki modüller"
                lead="Her modül kısa anlatım, adım adım uygulama ve öz değerlendirme quiziyle ilerler."
              />
              <ul className={styles.modules}>
                {level.modules.map((module) => <ModuleCard key={module.code} module={module} />)}
              </ul>
              <p className={styles.total}>Toplam {levelHours(level)} saat</p>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      {level.tracks && (
        <DebugComponentLabel name="AkademiLevelTracks (özel)">
          <section className={styles.band} aria-labelledby="seviye-kollar">
            <div className="alu-container">
              <SectionHeader
                id="seviye-kollar"
                kicker="DİSİPLİN KOLLARI"
                title="Mesleğinize göre bir kol seçin"
                lead="Kolların süreleri eşittir; birini seçip o alanda derinleşirsiniz."
              />
              <ul className={styles.tracks}>
                {level.tracks.map((track) => (
                  <li key={track.title} className={styles.track}>
                    <h3 className={styles.trackTitle}>{track.title}</h3>
                    <p className={styles.trackSummary}>{track.summary}</p>
                    <ul className={styles.modules}>
                      {track.modules.map((module) => <ModuleCard key={module.code} module={module} />)}
                    </ul>
                    <p className={styles.total}>{totalHours(track.modules)} saat</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      <DebugComponentLabel name="AkademiLevelNav (özel)">
        <nav className={`${styles.band} ${styles.lastBand}`} aria-label="Seviyeler arası gezinme">
          <div className={`alu-container ${styles.levelNav}`}>
            {previous ? (
              <a className={styles.navLink} href={`/akademi/${previous.slug}`}>
                <span className={styles.navDir}>← Önceki</span>
                <span className={styles.navTitle}>Seviye {previous.number} · {previous.title}</span>
              </a>
            ) : <span />}
            {next && (
              <a className={`${styles.navLink} ${styles.navNext}`} href={`/akademi/${next.slug}`}>
                <span className={styles.navDir}>Sonraki →</span>
                <span className={styles.navTitle}>Seviye {next.number} · {next.title}</span>
              </a>
            )}
          </div>
        </nav>
      </DebugComponentLabel>
    </div>
  );
}
