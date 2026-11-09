import type { ReactElement, ReactNode } from 'react';
import { CompactPageHero } from './CompactPageHero';
import { SectionHeader } from './SectionHeader';
import { CommandTable } from '@/components/akademi/kit';
import { temelModellemeLessons } from '@/data/temel-modelleme';
import type { TmLesson } from '@/data/temel-modelleme';
import styles from './TmLessonDetail.module.css';

/** Render **bold** spans and strip `code` backticks from source text (injection-safe). */
function withEmphasis(text: string): ReactNode[] {
  return text.split('**').map((part, i) => {
    const clean = part.replace(/`/g, '');
    return i % 2 === 1 ? <strong key={i}>{clean}</strong> : clean;
  });
}

function TmImages({ srcs, label }: { srcs: readonly string[]; label: string }): ReactElement | null {
  if (!srcs.length) return null;
  return (
    <div className={styles.shots}>
      {srcs.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element -- static /public asset
        <img key={src} className={styles.shot} src={src} alt={`${label} — ekran görüntüsü`} loading="lazy" decoding="async" />
      ))}
    </div>
  );
}

export function TmLessonDetail({ lesson }: { lesson: TmLesson }): ReactElement {
  const ordered = temelModellemeLessons;
  const index = ordered.findIndex((l) => l.slug === lesson.slug);
  const previous = index > 0 ? ordered[index - 1] : undefined;
  const next = index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined;

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Konum">
        <a href="/akademi">Akademi</a>
        <span aria-hidden="true" className={styles.sep}>/</span>
        <a href="/akademi/temel-modelleme">Temel Modelleme</a>
        <span aria-hidden="true" className={styles.sep}>/</span>
        <span aria-current="page">{lesson.title}</span>
      </nav>

      <CompactPageHero title={lesson.title} lead={lesson.objectives[0]} />

      {lesson.objectives.length > 0 && (
        <section className={styles.band} aria-labelledby="tm-hedef">
          <div className="alu-container">
            <SectionHeader id="tm-hedef" kicker="BU DERSTE" title="Neler yapacaksınız" />
            <ul className={styles.objectives}>
              {lesson.objectives.map((o, i) => (
                <li key={i} className={styles.objective}>{o}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {lesson.steps.length > 0 && (
        <section className={styles.band} aria-labelledby="tm-adimlar">
          <div className="alu-container">
            <SectionHeader id="tm-adimlar" kicker="UYGULAMA" title="Adım adım" lead="Her adımı kendi ALLPLAN’ınızda, sırayla uygulayın. Ekran görüntülü anlatımlar aşağıdaki kaynak makalelerdedir." />
            <ol className={styles.steps}>
              {lesson.steps.map((s, i) => (
                <li key={i} className={styles.step}>
                  <span className={styles.stepNo}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.stepBody}>
                    <h3 className={styles.stepHeading}>{s.heading}</h3>
                    <p className={styles.stepText}>{withEmphasis(s.body)}</p>
                    <TmImages srcs={s.figures} label={s.heading} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {lesson.commands.length > 0 && (
        <section className={styles.band} aria-labelledby="tm-komut">
          <div className="alu-container">
            <SectionHeader id="tm-komut" kicker="KOMUTLAR" title="Komut, menü yolu ve kısayol" lead="Türkçe arayüz adları (orijinaliyle); kendi sürümünüzde doğrulayın." />
            <CommandTable commands={lesson.commands} />
          </div>
        </section>
      )}

      {lesson.articles.length > 0 && (
        <section className={styles.band} aria-labelledby="tm-makale">
          <div className="alu-container">
            <SectionHeader id="tm-makale" kicker="KAYNAK MAKALELER" title="Derinleşmek için" lead="ALLPLAN Türkçe destek içeriğinden ilgili makaleler. Başlığa tıklayınca açılır." />
            <ul className={styles.articleList}>
              {lesson.articles.map((a) => (
                <li key={a.id} className={styles.articleItem}>
                  <details className={styles.article}>
                    <summary className={styles.articleHead}>{a.title}</summary>
                    <div className={styles.articleBody}>
                      {a.body.split('\n').filter(Boolean).map((p, i) => (
                        <p key={i} className={styles.articleP}>{withEmphasis(p)}</p>
                      ))}
                      <TmImages srcs={a.figures} label={a.title} />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(lesson.media.pdfs.length > 0 || lesson.media.samples.length > 0) && (
        <section className={styles.band} aria-labelledby="tm-indir">
          <div className="alu-container">
            <SectionHeader id="tm-indir" kicker="DOSYALAR" title="PDF ve örnek dosyalar" lead="İlgili kaynak dosyalar (bağlantılar hazırlanınca eklenecek)." />
            <ul className={styles.files}>
              {lesson.media.pdfs.map((f) => (
                <li key={f} className={styles.file}><span className={styles.fileKind}>PDF</span> {f}</li>
              ))}
              {lesson.media.samples.map((f) => (
                <li key={f} className={styles.file}><span className={styles.fileKind}>CAD</span> {f}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <nav className={`${styles.band} ${styles.lastBand}`} aria-label="Dersler arası gezinme">
        <div className={`alu-container ${styles.lessonNav}`}>
          {previous ? (
            <a className={styles.navLink} href={`/akademi/temel-modelleme/${previous.slug}`}>
              <span className={styles.navDir}>← Önceki ders</span>
              <span className={styles.navTitle}>{previous.title}</span>
            </a>
          ) : <span />}
          {next && (
            <a className={`${styles.navLink} ${styles.navNext}`} href={`/akademi/temel-modelleme/${next.slug}`}>
              <span className={styles.navDir}>Sonraki ders →</span>
              <span className={styles.navTitle}>{next.title}</span>
            </a>
          )}
        </div>
      </nav>
    </div>
  );
}
