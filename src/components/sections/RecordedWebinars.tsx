import { AluIcon } from '@/components/ui/AluIcon';
import { recordedWebinars } from '@/data/recorded-webinars';
import type { StructuredMediaGridSection } from '@/lib/site-data';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-shared';
import { CompactPageHero } from './CompactPageHero';
import { MediaGridWithViewer } from './MediaGridWithViewer';
import styles from './RecordedWebinars.module.css';

const content = recordedWebinars;

const archive: StructuredMediaGridSection = {
  title: content.archiveTitle,
  subtitle: content.archiveLead,
  columns: 3,
  items: content.webinars.map((webinar) => ({
    title: webinar.title,
    badge: webinar.date,
    subtitle: webinar.source,
    description: webinar.description,
    imageSrc: webinar.image,
    youtubeId: webinar.youtubeId
  }))
};

export function RecordedWebinars() {
  return (
    <div className={styles.page}>
      <CompactPageHero
        crumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Kaynaklar', href: '/kaynaklar' }, { label: content.title }]}
        kicker={content.kicker}
        title={content.title}
        lead={content.lead}
      />
      <div>
        <MediaGridWithViewer grid={archive} itemKeyPrefix="webinar" />

        <section className={styles.band} aria-labelledby="webinar-genel-bakis">
          <div className={`alu-container ${styles.overview}`}>
            <div className={styles.overviewText}>
              <h2 id="webinar-genel-bakis" className={styles.groupTitle}>{content.overviewTitle}</h2>
              <p className={styles.text}>{content.overview}</p>
              <dl className={styles.stats}>
                {content.stats.map((stat) => (
                  <div key={stat.label} className={styles.stat}>
                    <dt>{stat.value}</dt>
                    <dd>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={styles.audience}>
              <h2 className={styles.groupTitle}>{content.audienceTitle}</h2>
              <ul className={styles.checklist}>
                {content.audience.map((item) => (
                  <li key={item}>
                    <AluIcon name="check" size="sm" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.band} aria-labelledby="webinar-kazanimlar">
          <div className="alu-container">
            <h2 id="webinar-kazanimlar" className={styles.groupTitle}>{content.benefitsTitle}</h2>
            <ul className={styles.benefits}>
              {content.benefits.map((benefit) => (
                <li key={benefit.title} className={styles.benefit}>
                  <h3 className={styles.itemTitle}>{benefit.title}</h3>
                  <p className={styles.text}>{benefit.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="webinar-cta">
          <div className={`alu-container ${styles.ctaInner}`}>
            <div>
              <h2 id="webinar-cta" className={styles.groupTitle}>{content.ctaTitle}</h2>
              <p className={styles.text}>{content.ctaText}</p>
            </div>
            <a className="alu-button alu-button--primary alu-button--md" href={MAIN_QUOTE_FORM_URL} target="_blank" rel="noopener noreferrer">
              <span>{content.ctaLabel}</span>
              <span className="alu-visually-hidden"> (yeni sekmede açılır)</span>
              <AluIcon name="external-link" size="sm" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
