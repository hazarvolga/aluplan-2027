import Link from 'next/link';
import type { SolutionDirectoryItem } from '@/lib/site-data';
import styles from './ProductsOverview.module.css';

export function SolutionOverviewCards({ items, headingLevel, paragraphsByHref, actionLabel }: { items: SolutionDirectoryItem[]; headingLevel: 2 | 3; paragraphsByHref?: Readonly<Record<string, readonly string[]>>; actionLabel?: string }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <div className={styles.products}>
      {items.map((item, index) => (
        <article className={index === 0 ? `${styles.product} ${styles.featured}` : styles.product} key={`${item.title}-${item.href}`}>
          <Link className={styles.productLink} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} aria-label={item.external ? `${item.title}: Siteyi ziyaret et (yeni sekmede açılır)` : `${item.title}: ${actionLabel ?? 'Detayları incele'}`}>
            {item.image && <div className={styles.media}>
              <img src={item.image.src} alt={item.image.alt} loading="lazy" />
              <span className={styles.mediaAction} aria-hidden="true">{item.external ? 'Siteyi Ziyaret Et ↗' : `${actionLabel ?? 'Detayları İncele'} ↗`}</span>
            </div>}
            <div className={styles.content}>
              <Heading className={styles.title}>{item.title}</Heading>
              {(paragraphsByHref?.[item.href] ?? [item.description]).map((paragraph, index) => <p className={styles.description} key={index}>{paragraph}</p>)}
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
