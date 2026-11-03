import { AluIcon } from '@/components/ui/AluIcon';
import { recordedWebinars } from '@/data/recorded-webinars';
import type { RecordedWebinar } from '@/data/recorded-webinars';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-shared';
import { CompactPageHero } from './CompactPageHero';
import styles from './RecordedWebinars.module.css';

const content = recordedWebinars;

function Webinar({ webinar }: { webinar: RecordedWebinar }) {
  return (
    <li className={styles.webinar}>
      <img className={styles.thumb} src={webinar.image} alt="" loading="lazy" />
      <div className={styles.webinarBody}>
        <div className={styles.meta}>
          <span>{webinar.date}</span>
          <span className={styles.status}>{content.archiveStatus}</span>
        </div>
        <h3 className={styles.itemTitle}>{webinar.title}</h3>
        <p className={styles.text}>{webinar.description}</p>
      </div>
    </li>
  );
}

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
        <section className={styles.band} aria-label={content.archiveTitle}>
          <div className="alu-container">
            <p className={styles.sectionLead}>{content.archiveLead}</p>
            <ul className={styles.webinars}>
              {content.webinars.map((webinar) => (
                <Webinar key={`${webinar.title}-${webinar.date}`} webinar={webinar} />
              ))}
            </ul>
          </div>
        </section>

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
