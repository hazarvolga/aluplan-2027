import type { ReactElement } from 'react';
import { akademiProgram, levelModules } from '@/data/akademi-content';
import type { ContentLevel, ContentModule } from '@/data/akademi-content';
import { CompactPageHero } from './CompactPageHero';
import { DebugComponentLabel } from './DebugComponentLabel';
import { SectionHeader } from './SectionHeader';
import { Figure, Lesson } from '@/components/akademi/kit';
import { AkademiJsonLd } from '@/components/akademi/AkademiJsonLd';
import { AkademiQuiz } from '@/components/akademi/AkademiQuiz';
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
        <CompactPageHero title={module.title} lead={module.summary} />
      </DebugComponentLabel>

      {module.lesson && module.lesson.sections.length > 0 && (
        <DebugComponentLabel name="AkademiModuleLesson (ders)">
          <section className={styles.band} aria-labelledby="modul-ders">
            <div className="alu-container">
              <SectionHeader
                id="modul-ders"
                title={module.lesson.title ?? module.title}
                lead={module.lesson.subtitle}
              />
              <div className={styles.lesson}>
                <Lesson lesson={module.lesson} />
              </div>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      {module.applicationSteps && module.applicationSteps.length > 0 && (
        <DebugComponentLabel name="AkademiModuleSteps (özel)">
          <section className={styles.band} aria-labelledby="modul-uygulama">
            <div className="alu-container">
              <SectionHeader
                id="modul-uygulama"
                kicker="UYGULAMA"
                title="Adım adım uygulama"
                lead="Her kritik adımın yanında neden o şekilde yapıldığı belirtilir."
              />
              <ol className={styles.steps}>
                {module.applicationSteps.map((item, index) => (
                  <li key={index} className={styles.step}>
                    <span className={styles.stepNo}>{String(index + 1).padStart(2, '0')}</span>
                    <div className={styles.stepBody}>
                      <p className={styles.stepText}>{item.step}</p>
                      {item.why && (
                        <p className={styles.stepWhy}>
                          <span className={styles.whyLabel}>Neden?</span> {item.why}
                        </p>
                      )}
                      {item.figure && (
                        <div className={styles.stepFigure}>
                          <Figure figure={item.figure} />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      {module.commonMistakes && module.commonMistakes.length > 0 && (
        <DebugComponentLabel name="AkademiModuleMistakes (özel)">
          <section className={styles.band} aria-labelledby="modul-hatalar">
            <div className="alu-container">
              <SectionHeader
                id="modul-hatalar"
                kicker="DİKKAT"
                title="Sık yapılan hatalar"
                lead="Takılırsanız buraya bakın. Başlığa tıklayınca belirtisi ve çözümü açılır."
              />
              <ul className={styles.mistakeList}>
                {module.commonMistakes.map((item, index) => (
                  <li key={index} className={styles.mistakeItem}>
                    <details className={styles.mistake}>
                      <summary className={styles.mistakeHead}>{item.mistake}</summary>
                      <div className={styles.mistakeBody}>
                        <p className={styles.mistakeSymptom}>
                          <span className={styles.mistakeKey}>Belirti</span> {item.symptom}
                        </p>
                        <p className={styles.mistakeFix}>
                          <span className={styles.mistakeKey}>Çözüm</span> {item.fix}
                        </p>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      {module.quiz && module.quiz.length > 0 && (
        <DebugComponentLabel name="AkademiModuleQuiz (interaktif)">
          <section className={styles.band} aria-labelledby="modul-quiz">
            <div className="alu-container">
              <SectionHeader
                id="modul-quiz"
                kicker="ÖZ DEĞERLENDİRME"
                title="Ders sonu quiz"
                lead="Bir şık seçin; doğru yanıtı ve açıklamasını görün. Sonuçlar yalnızca bu tarayıcıda saklanır, sertifika yerine geçmez."
              />
              <div className={styles.quiz}>
                <AkademiQuiz moduleCode={module.code} questions={module.quiz} />
              </div>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      {module.homework && (
        <DebugComponentLabel name="AkademiModuleExercise (özel)">
          <section className={styles.band} aria-labelledby="modul-alistirma">
            <div className="alu-container">
              <p id="modul-alistirma" className="preview-kicker">Şimdi kendiniz deneyin</p>
              <p className={styles.exerciseTask}>{module.homework}</p>
            </div>
          </section>
        </DebugComponentLabel>
      )}

      {module.concepts && module.concepts.length > 0 && (
        <DebugComponentLabel name="AkademiModuleGlossary (akordeon)">
          <section className={styles.band} aria-labelledby="modul-sozluk">
            <div className="alu-container">
              <details className={styles.accordion}>
                <summary className={styles.accordionSummary}>
                  <span className={styles.accordionKicker}>SÖZLÜK</span>
                  <span id="modul-sozluk" className={styles.accordionTitle}>
                    Bu derste geçen terimler ({module.concepts.length})
                  </span>
                </summary>
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
              </details>
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
                <span className={styles.navTitle}>{previous.title}</span>
              </a>
            ) : <span />}
            {next && (
              <a className={`${styles.navLink} ${styles.navNext}`} href={`/akademi/${next.levelSlug}/${next.slug}`}>
                <span className={styles.navDir}>Sonraki modül →</span>
                <span className={styles.navTitle}>{next.title}</span>
              </a>
            )}
          </div>
        </nav>
      </DebugComponentLabel>
    </div>
  );
}
