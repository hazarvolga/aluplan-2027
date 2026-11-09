import type { ReactElement } from 'react';
import { akademiProgram } from '@/data/akademi-content';
import type { ContentLevel, ContentModule } from '@/data/akademi-content';
import { CompactPageHero } from './CompactPageHero';
import { DebugComponentLabel } from './DebugComponentLabel';
import { SectionHeader } from './SectionHeader';
import { ModuleCard } from '@/components/akademi/kit';
import { AkademiJsonLd } from '@/components/akademi/AkademiJsonLd';
import styles from './AkademiLevelDetail.module.css';

const akademiLevels = akademiProgram.levels;

function unitCount(level: ContentLevel): number {
  if (level.modules) return level.modules.length;
  if (level.tracks) return level.tracks.length;
  return 0;
}

export function AkademiLevelDetail({ level }: { level: ContentLevel }): ReactElement {
  const index = akademiLevels.findIndex((item) => item.slug === level.slug);
  const previous = index > 0 ? akademiLevels[index - 1] : undefined;
  const next = index < akademiLevels.length - 1 ? akademiLevels[index + 1] : undefined;

  const metaItems = [
    { k: 'Rol', v: level.role },
    { k: 'Yapı', v: level.shared ? 'Ortak çekirdek' : 'Disiplin kolları' },
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
          <dl className={styles.heroMetaFlat}>
            {metaItems.map((item) => (
              <div key={item.k} className={styles.heroMetaItem}>
                <dt className={styles.heroMetaKey}>{item.k}</dt>
                <dd className={styles.heroMetaVal}>{item.v}</dd>
              </div>
            ))}
          </dl>
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
                title="Bu seviyedeki dersler"
                lead="Her derste konuyu öğrenir, ekranda görür, adım adım uygular ve kısa bir quizle kendinizi sınarsınız."
              />
              <ul className={styles.moduleGrid}>
                {level.modules.map((module) => (
                  <li key={module.code} className={styles.moduleGridItem}>
                    <ModuleCard module={module} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      {level.slug === 'temel' && (
        <DebugComponentLabel name="AkademiLevelTmSeries (özel)">
          <section className={styles.band} aria-labelledby="seviye-tm">
            <div className="alu-container">
              <SectionHeader
                id="seviye-tm"
                kicker="UYGULAMALI SERİ"
                title="Temel Modelleme Eğitimi"
                lead="On altı uygulamalı derste bir binayı sıfırdan modellersiniz: aks, duvar, kapı/pencere, kolon/kiriş, döşeme, merdiven, temel ve çatı. Her adımda Türkçe komutlar ve ekran görüntüleri."
              />
              <a className={styles.seriesCard} href="/akademi/temel-modelleme">
                <span className={styles.seriesCardTitle}>16 uygulamalı ders · Türkçe arayüz komutları · ekran görüntülü anlatım</span>
                <span className={styles.seriesCardCta}>Seriye git →</span>
              </a>
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
                  return (
                    <li key={track.title} className={styles.track}>
                      <h3 className={styles.trackTitle}>{track.title}</h3>
                      <p className={styles.trackSummary}>{track.summary}</p>
                      <ul className={styles.moduleGrid}>
                        {track.modules.map((module) => (
                          <li key={module.code} className={styles.moduleGridItem}>
                            <ModuleCard module={module} />
                          </li>
                        ))}
                      </ul>
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
