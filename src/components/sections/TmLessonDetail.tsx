import type { ReactElement, ReactNode } from 'react';
import { CompactPageHero } from './CompactPageHero';
import { SectionHeader } from './SectionHeader';
import { CommandTable, LessonImage, LessonToc, PrevNextNav } from '@/components/akademi/kit';
import { AkademiQuiz } from '@/components/akademi/AkademiQuiz';
import { ConsentEmbed } from '@/components/ui/ConsentEmbed';
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
        <LessonImage key={src} src={src} alt={`${label} — ekran görüntüsü`} className={styles.shot} />
      ))}
    </div>
  );
}

export function TmLessonDetail({
  lesson,
  allLessons = temelModellemeLessons,
  basePath = '/akademi/temel-modelleme',
  breadcrumbLabel = 'Temel Modelleme',
}: {
  lesson: TmLesson;
  allLessons?: readonly TmLesson[];
  basePath?: string;
  breadcrumbLabel?: string;
}): ReactElement {
  const embeddableVideos = lesson.media.videos.filter((v) => Boolean(v.youtubeId));
  const ordered = allLessons;
  const index = ordered.findIndex((l) => l.slug === lesson.slug);
  const previous = index > 0 ? ordered[index - 1] : undefined;
  const next = index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined;

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Konum">
        <a href="/akademi">Akademi</a>
        <span aria-hidden="true" className={styles.sep}>/</span>
        <a href={basePath}>{breadcrumbLabel}</a>
        <span aria-hidden="true" className={styles.sep}>/</span>
        <span aria-current="page">{lesson.title}</span>
      </nav>

      <CompactPageHero title={lesson.title} lead={lesson.objectives[0]} />

      <LessonToc slug={lesson.slug} />

      {lesson.intro && (
        <section className={styles.band}>
          <div className="alu-container">
            <p className={styles.intro}>{withEmphasis(lesson.intro)}</p>
          </div>
        </section>
      )}

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
            <SectionHeader id="tm-adimlar" kicker="UYGULAMA" title="Adım adım" lead="Her adımı kendi ALLPLAN’ınızda, sırayla uygulayın." />
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

      {lesson.checkpoint && (
        <section className={styles.band} aria-labelledby="tm-kontrol">
          <div className="alu-container">
            <div className={styles.checkpoint}>
              <span id="tm-kontrol" className={styles.checkpointLabel}>Doğru yaptıysanız</span>
              <p className={styles.checkpointText}>{withEmphasis(lesson.checkpoint)}</p>
            </div>
          </div>
        </section>
      )}

      {lesson.pitfalls && lesson.pitfalls.length > 0 && (
        <section className={styles.band} aria-labelledby="tm-dikkat">
          <div className="alu-container">
            <SectionHeader id="tm-dikkat" kicker="DİKKAT" title="Takılırsanız" lead="Bu derste sık karşılaşılan sorun ve çözümü." />
            <ul className={styles.pitfalls}>
              {lesson.pitfalls.map((p, i) => (
                <li key={i} className={styles.pitfall}>
                  <span className={styles.pitfallLabel}>Sık yapılan hata</span>
                  <h3 className={styles.pitfallTitle}>{p.title}</h3>
                  {p.body.split('\n').filter(Boolean).map((para, j) => (
                    <p key={j} className={styles.pitfallBody}>{withEmphasis(para)}</p>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {lesson.exercise && (
        <section className={styles.band} aria-labelledby="tm-uygulama">
          <div className="alu-container">
            <SectionHeader id="tm-uygulama" kicker="UYGULAMA GÖREVİ" title="Şimdi siz deneyin" lead="Adım adım tarif yok: aşağıdaki görevi kendi başınıza yapın, sonra beklenen sonuçla karşılaştırın." />
            <div className={styles.exercise}>
              <p className={styles.exerciseTask}>{withEmphasis(lesson.exercise.task)}</p>
              {lesson.exercise.startFile && (
                <p className={styles.exerciseMeta}><span className={styles.exerciseMetaK}>Başlangıç</span> {lesson.exercise.startFile}</p>
              )}
              {lesson.exercise.hint && (
                <details className={styles.exerciseFold}>
                  <summary className={styles.exerciseSummary}>İpucu</summary>
                  <p className={styles.exerciseFoldText}>{withEmphasis(lesson.exercise.hint)}</p>
                </details>
              )}
              <details className={styles.exerciseFold}>
                <summary className={styles.exerciseSummary}>Beklenen sonuç</summary>
                <p className={styles.exerciseFoldText}>{withEmphasis(lesson.exercise.expected)}</p>
              </details>
            </div>
          </div>
        </section>
      )}

      {lesson.quiz && lesson.quiz.length > 0 && (
        <section className={styles.band} aria-labelledby="tm-quiz">
          <div className="alu-container">
            <SectionHeader id="tm-quiz" kicker="ÖLÇME" title="Kendinizi sınayın" lead="Dersin kazanımlarını kısa bir testle yoklayın. Her soruda bir seçenek seçin; doğru cevabı ve açıklamasını hemen görürsünüz." />
            <AkademiQuiz moduleCode={lesson.slug} questions={lesson.quiz} />
          </div>
        </section>
      )}

      {embeddableVideos.length > 0 && (
        <section className={styles.band} aria-labelledby="tm-video">
          <div className="alu-container">
            <SectionHeader id="tm-video" kicker="İLGİLİ VİDEO" title="Konuyu videoda izleyin" lead="ALLPLAN kanallarındaki açık videolar. Dersin birincil anlatımı adımlar ve ekran görüntüleridir; video destekleyicidir." />
            <ul className={styles.videoList}>
              {embeddableVideos.map((v) => (
                <li key={v.youtubeId} className={styles.videoItem}>
                  <div className={styles.videoWrap}>
                    <ConsentEmbed
                      src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                      title={v.title}
                      className={styles.videoFrame}
                      fill
                    />
                  </div>
                  <p className={styles.videoCaption}>
                    {v.title}
                    {v.note && <span className={styles.videoNote}> · {v.note}</span>}
                  </p>
                </li>
              ))}
            </ul>
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

      {lesson.deepDive ? (
        <section className={styles.band} aria-labelledby="tm-derin">
          <div className="alu-container">
            <SectionHeader id="tm-derin" kicker="DERİNLEMESİNE" title="Sık karşılaşılan durumlar" lead="Dersin konusunu uygulamada bir adım öteye taşıyan gerçek senaryolar ve çözümleri." />
            <div className={styles.deepDive}>
              {lesson.deepDive.blocks.map((b, i) => {
                if (b.type === 'heading') {
                  return <h3 key={i} className={styles.deepHeading}>{b.text}</h3>;
                }
                if (b.type === 'image') {
                  return (
                    <figure key={i} className={styles.deepFigure}>
                      <LessonImage src={b.src} alt={b.caption ?? 'Ekran görüntüsü'} caption={b.caption} className={styles.deepImg} />
                      {b.caption ? <figcaption className={styles.deepCaption}>{b.caption}</figcaption> : null}
                    </figure>
                  );
                }
                return <p key={i} className={styles.deepText}>{withEmphasis(b.text)}</p>;
              })}
            </div>
          </div>
        </section>
      ) : null}

      <PrevNextNav
        label="Dersler arası gezinme"
        previous={previous ? { href: `${basePath}/${previous.slug}`, title: previous.title } : undefined}
        next={next ? { href: `${basePath}/${next.slug}`, title: next.title } : undefined}
      />
    </div>
  );
}
