import type { ReactElement } from 'react';
import { akademiLevels } from '@/data/akademi';
import type { AkademiLevel, AkademiModule } from '@/data/akademi';
import { CompactPageHero } from './CompactPageHero';
import { DebugComponentLabel } from './DebugComponentLabel';
import { SectionHeader } from './SectionHeader';
import { MetaRow, ModuleCard } from '@/components/akademi/kit';
import { AkademiJsonLd } from '@/components/akademi/AkademiJsonLd';
import styles from './AkademiLevelDetail.module.css';

function totalHours(modules: readonly AkademiModule[]): number {
  return modules.reduce((sum, module) => sum + module.hours, 0);
}

function levelHours(level: AkademiLevel): number {
  if (level.modules) return totalHours(level.modules);
  if (level.tracks) return totalHours(level.tracks[0]?.modules ?? []);
  return 0;
}

function unitCount(level: AkademiLevel): number {
  if (level.modules) return level.modules.length;
  if (level.tracks) return level.tracks.length;
  return 0;
}

export function AkademiLevelDetail({ level }: { level: AkademiLevel }): ReactElement {
  const index = akademiLevels.findIndex((item) => item.slug === level.slug);
  const previous = index > 0 ? akademiLevels[index - 1] : undefined;
  const next = index < akademiLevels.length - 1 ? akademiLevels[index + 1] : undefined;

  const metaItems = [
    { k: 'Rol', v: level.role },
    { k: 'Yapı', v: level.shared ? 'Ortak çekirdek' : 'Disiplin kolları' },
    { k: 'Süre', v: level.shared ? `${levelHours(level)} saat` : `Kol başına ${levelHours(level)} saat` },
    { k: level.shared ? 'Modül' : 'Kol', v: String(unitCount(level)) },
  ];

  return (
    <div className={styles.page}>
      <AkademiJsonLd level={level} />
      <DebugComponentLabel name="AkademiLevelDetail (özel)">
        <CompactPageHero
          kicker={`SEVİYE ${level.number} · ${level.shared ? 'ORTAK' : 'DİSİPLİN KOLLARI'}`}
          title={`Seviye ${level.number} · ${level.title}`}
          lead={level.summary}
        >
          <div className={styles.heroMeta}>
            <MetaRow items={metaItems} />
          </div>
          <div className={styles.heroActions}>
            <a className="alu-button alu-button--secondary alu-button--md" href="/akademi#seviyeler">
              Tüm program
            </a>
          </div>
        </CompactPageHero>
      </DebugComponentLabel>

      {level.modules && (
        <DebugComponentLabel name="AkademiLevelModules (kit)">
          <section className={styles.band} aria-labelledby="seviye-moduller">
            <div className="alu-container">
              <SectionHeader
                id="seviye-moduller"
                kicker="MODÜLLER"
                title="Bu seviyedeki modüller"
                lead="Her modül kısa anlatım, adım adım uygulama ve öz değerlendirme quiziyle ilerler."
              />
              <ul className={styles.moduleGrid}>
                {level.modules.map((module) => (
                  <li key={module.code} className={styles.moduleGridItem}>
                    <ModuleCard module={module} />
                  </li>
                ))}
              </ul>
              <p className={styles.total}>Toplam {levelHours(level)} saat</p>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      {level.tracks && (
        <DebugComponentLabel name="AkademiLevelTracks (kit)">
          <section className={styles.band} aria-labelledby="seviye-kollar">
            <div className="alu-container">
              <SectionHeader
                id="seviye-kollar"
                kicker="DİSİPLİN KOLLARI"
                title="Mesleğinize göre bir kol seçin"
                lead="Kolların süreleri eşittir; birini seçip o alanda derinleşirsiniz."
              />
              <ul className={styles.tracks}>
                {level.tracks.map((track) => {
                  const single = track.modules.length === 1;
                  return (
                    <li key={track.title} className={styles.track}>
                      <h3 className={styles.trackTitle}>{track.title}</h3>
                      <p className={styles.trackSummary}>{track.summary}</p>
                      <ul className={styles.moduleGrid}>
                        {track.modules.map((module) => (
                          <li key={module.code} className={styles.moduleGridItem}>
                            <ModuleCard module={module} showHours={!single} />
                          </li>
                        ))}
                      </ul>
                      <p className={styles.total}>{totalHours(track.modules)} saat</p>
                    </li>
                  );
                })}
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
