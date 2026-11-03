import Link from 'next/link';
import type { SolutionDirectory } from '@/lib/site-data';
import { SectionHeader } from './SectionHeader';
import styles from './ProductsOverview.module.css';
import catalogStyles from './SolutionCatalogSection.module.css';

export function SolutionCatalogSection({ directory }: { directory: SolutionDirectory }) {
  const { catalogIntro: intro, groups } = directory;

  return (
    <section className="preview-section" aria-label="Tüm çözümler" data-solution-directory="catalog">
      <div className="alu-container">
        <div className="alu-stack" style={{ gap: 'var(--space-stack-sm)' }}>
          <span className="preview-kicker">{intro.kicker}</span>
          <h2 className="alu-h2" style={{ margin: 0 }}>
            {intro.title}
          </h2>
          <p className="alu-body-lg" style={{ margin: 0, maxWidth: 'var(--container-application-intro-single)' }}>
            {intro.description}
          </p>
        </div>
        {groups.map((group, groupIndex) => (
          <section key={group.hubPath} className={`alu-stack ${catalogStyles.group}`} aria-labelledby={`solution-group-${groupIndex}`}>
            <SectionHeader kicker={`${String(groupIndex + 1).padStart(2, '0')} · ÇÖZÜM ALANI`} title={group.title} id={`solution-group-${groupIndex}`} />
            <div className={styles.products}>
              {group.catalogItems.map((item, index) => (
                <article className={index === 0 ? `${styles.product} ${styles.featured}` : styles.product} key={`${item.title}-${item.href}`}>
                  <Link className={styles.productLink} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} aria-label={item.external ? `${item.title}: Siteyi ziyaret et (yeni sekmede açılır)` : `${item.title}: Detayları incele`}>
                  {item.image && <div className={styles.media}>
                    <img src={item.image.src} alt={item.image.alt} loading="lazy" />
                    <span className={styles.mediaAction} aria-hidden="true">{item.external ? 'Siteyi Ziyaret Et ↗' : 'Detayları İncele ↗'}</span>
                  </div>}
                  <div className={styles.content}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.description}>{item.description}</p>
                  </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
