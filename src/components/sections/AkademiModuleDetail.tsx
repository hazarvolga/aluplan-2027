import type { ReactElement } from 'react';
import { akademiProgram, levelModules } from '@/data/akademi-content';
import type { ContentLevel, ContentModule } from '@/data/akademi-content';
import { CompactPageHero } from './CompactPageHero';
import { DebugComponentLabel } from './DebugComponentLabel';
import { SectionHeader } from './SectionHeader';
import { Callout, DistributionBar, MetaRow, Timeline } from '@/components/akademi/kit';
import { AkademiJsonLd } from '@/components/akademi/AkademiJsonLd';
import styles from './AkademiModuleDetail.module.css';

/** All modules in program order, so prev/next crosses level boundaries. */
function programModules(): readonly ContentModule[] {
  return akademiProgram.levels.flatMap((level) => levelModules(level));
}

export function AkademiModuleDetail({
  module,
  level,
}: {
  module: ContentModule;
  level: ContentLevel;
}): ReactElement {
  const ordered = programModules();
  const index = ordered.findIndex((m) => m.levelSlug === module.levelSlug && m.slug === module.slug);
  const previous = index > 0 ? ordered[index - 1] : undefined;
  const next = index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined;

  const metaItems = [
    { k: 'Toplam süre', v: `${module.hours} saat` },
    { k: 'Format', v: module.format },
    { k: 'Ön koşul', v: module.prerequisite },
    { k: 'Kazanım', v: String(module.outcomes.length) },
  ];

  const kicker = [module.code, level.title.toUpperCase(), module.trackTitle?.toUpperCase()]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={styles.page}>
      <AkademiJsonLd module={module} />

      <DebugComponentLabel name="AkademiModuleBreadcrumb (özel)">
        <nav className={styles.breadcrumb} aria-label="Konum">
          <a href="/akademi">Akademi</a>
          <span aria-hidden="true" className={styles.sep}>/</span>
          <a href={`/akademi/${level.slug}`}>{level.title}</a>
          <span aria-hidden="true" className={styles.sep}>/</span>
          <span aria-current="page">{module.title}</span>
        </nav>
      </DebugComponentLabel>

      <DebugComponentLabel name="AkademiModuleHero (özel)">
        <CompactPageHero kicker={kicker} title={module.title} lead={module.summary}>
          <div className={styles.heroMeta}>
            <MetaRow items={metaItems} />
          </div>
          <div className={styles.distribution}>
            <DistributionBar segments={module.durationSplit} caption="Örnek oturum süre dağılımı" />
          </div>
        </CompactPageHero>
      </DebugComponentLabel>

      <DebugComponentLabel name="AkademiModuleOutcomes (özel)">
        <section className={styles.band} aria-labelledby="modul-kazanimlar">
          <div className="alu-container">
            <SectionHeader
              id="modul-kazanimlar"
              kicker="KAZANIMLAR"
              title="Bu modülün sonunda"
              lead="Her kazanım bir Bloom düzeyine ve bir kazanım koduna bağlıdır."
            />
            <ul className={styles.outcomes}>
              {module.outcomes.map((outcome) => (
                <li key={outcome.code || outcome.text} className={styles.outcome}>
                  <p className={styles.outcomeText}>{outcome.text}</p>
                  <span className={styles.outcomeTags}>
                    <span className={styles.bloom}>{outcome.bloom}</span>
                    {outcome.code && <span className={styles.code}>{outcome.code}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </DebugComponentLabel>

      {module.concepts && module.concepts.length > 0 && (
        <DebugComponentLabel name="AkademiModuleConcepts (özel)">
          <section className={styles.band} aria-labelledby="modul-kavramlar">
            <div className="alu-container">
              <SectionHeader id="modul-kavramlar" kicker="KAVRAMLAR" title="Temel kavramlar ve terimler" />
              <dl className={styles.concepts}>
                {module.concepts.map((concept) => (
                  <div key={concept.term} className={styles.concept}>
                    <dt className={styles.conceptTerm}>
                      {concept.term}
                      <span className={styles.conceptEn}>{concept.en}</span>
                    </dt>
                    <dd className={styles.conceptDesc}>{concept.desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      <DebugComponentLabel name="AkademiModuleFlow (kit)">
        <section className={styles.band} aria-labelledby="modul-akis">
          <div className="alu-container">
            <SectionHeader
              id="modul-akis"
              kicker="DERS AKIŞI"
              title="Örnek oturum akışı"
              lead="Dakika bazlı bir örnek oturum; süreler ve sıralama eğitmene göre uyarlanır."
            />
            <div className={styles.timeline}>
              <Timeline steps={module.sessionFlow} />
            </div>
          </div>
        </section>
      </DebugComponentLabel>

      <DebugComponentLabel name="AkademiModuleProject (özel)">
        <section className={styles.band} aria-labelledby="modul-proje">
          <div className="alu-container">
            <SectionHeader id="modul-proje" kicker="SÜREKLİ PROJE" title="Bu dersin projeye katkısı" />
            <Callout label="Sürekli proje adımı">
              <p>{module.runningProjectStep}</p>
            </Callout>
          </div>
        </section>
      </DebugComponentLabel>

      {(module.assessment || module.homework || (module.materials && module.materials.length > 0)) && (
        <DebugComponentLabel name="AkademiModuleAssessment (özel)">
          <section className={styles.band} aria-labelledby="modul-olcme">
            <div className="alu-container">
              <SectionHeader id="modul-olcme" kicker="ÖLÇME VE KAYNAKLAR" title="Ödev, ölçme ve materyaller" />
              <div className={styles.resources}>
                {module.assessment && (
                  <div className={styles.resource}>
                    <h3 className={styles.resourceTitle}>Ölçme</h3>
                    <p className={styles.resourceText}>{module.assessment}</p>
                  </div>
                )}
                {module.homework && (
                  <div className={styles.resource}>
                    <h3 className={styles.resourceTitle}>Ödev</h3>
                    <p className={styles.resourceText}>{module.homework}</p>
                  </div>
                )}
                {module.materials && module.materials.length > 0 && (
                  <div className={styles.resource}>
                    <h3 className={styles.resourceTitle}>Materyaller</h3>
                    <ul className={styles.materials}>
                      {module.materials.map((material) => (
                        <li key={material} className={styles.material}>{material}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      <DebugComponentLabel name="AkademiModuleNav (özel)">
        <nav className={`${styles.band} ${styles.lastBand}`} aria-label="Modüller arası gezinme">
          <div className={`alu-container ${styles.moduleNav}`}>
            {previous ? (
              <a className={styles.navLink} href={`/akademi/${previous.levelSlug}/${previous.slug}`}>
                <span className={styles.navDir}>← Önceki modül</span>
                <span className={styles.navTitle}>{previous.code} · {previous.title}</span>
              </a>
            ) : <span />}
            {next && (
              <a className={`${styles.navLink} ${styles.navNext}`} href={`/akademi/${next.levelSlug}/${next.slug}`}>
                <span className={styles.navDir}>Sonraki modül →</span>
                <span className={styles.navTitle}>{next.code} · {next.title}</span>
              </a>
            )}
          </div>
        </nav>
      </DebugComponentLabel>
    </div>
  );
}
