import Link from 'next/link';
import type { SolutionDirectoryItem } from '@/lib/site-data';
import styles from './ProductsOverview.module.css';

export function SolutionOverviewCards({ items, headingLevel }: { items: SolutionDirectoryItem[]; headingLevel: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <div className={styles.products}>
      {items.map((item, index) => (
        <article className={index === 0 ? `${styles.product} ${styles.featured}` : styles.product} key={`${item.title}-${item.href}`}>
          <Link className={styles.productLink} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} aria-label={item.external ? `${item.title}: Siteyi ziyaret et (yeni sekmede açılır)` : `${item.title}: Detayları incele`}>
            {item.image && <div className={styles.media}>
              <img src={item.image.src} alt={item.image.alt} loading="lazy" />
              <span className={styles.mediaAction} aria-hidden="true">{item.external ? 'Siteyi Ziyaret Et ↗' : 'Detayları İncele ↗'}</span>
            </div>}
            <div className={styles.content}>
              <Heading className={styles.title}>{item.title}</Heading>
              <p className={styles.description}>{item.description}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
