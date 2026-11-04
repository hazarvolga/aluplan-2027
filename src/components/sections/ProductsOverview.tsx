'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { PageRecord } from '@/lib/site-data';
import { useFirstVisible } from './useFirstVisible';
import styles from './ProductsOverview.module.css';

// The badge is placed before each product in the source page. The inventory
// extractor attached it to the preceding section; map it by product target.
const productBadges: Record<string, string> = {
  '/products/allplan-aec': 'AMİRAL GEMİSİ',
  '/products/allplan-ultimate': 'EN KAPSAMLI',
  '/products/civil': 'ALTYAPI',
  '/products/allplan-professional': 'PROFESYONEL',
  '/products/allplan-concept': 'KONSEPT',
  '/products/precast-detail': 'PRECAST',
  '/products/allplan-basic': 'TEMEL',
};

export type ProductOverviewItem = {
  href: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  badge?: string;
  optimizedImage?: boolean;
  external?: boolean;
  sourceId?: string;
  actionLabel?: string;
};

type ProductsOverviewProps =
  | { page: PageRecord; items?: never; headingLevel?: 2 }
  | { page?: never; items: readonly ProductOverviewItem[]; headingLevel?: 2 | 3; featuredSquare?: boolean; onImage?: (image: { src: string; title: string }) => void };

export function ProductsOverview(props: ProductsOverviewProps) {
  const { page, items, headingLevel = 2 } = props;
  const featuredSquare = 'featuredSquare' in props && props.featuredSquare;
  const onImage = 'onImage' in props ? props.onImage : undefined;
  const { ref, hasAppeared, finish } = useFirstVisible();
  const products: readonly ProductOverviewItem[] = items ?? page!.sections
    .filter(section => section.link && section.image)
    .map(section => ({
      href: section.link!.href,
      title: section.heading,
      description: section.items[0],
      image: section.image!,
      badge: productBadges[section.link!.href],
    }));
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  return <div className={styles.products}>
      {products.map((product, index) => <article ref={index === 0 ? ref : undefined} className={index === 0 ? `${styles.product} ${styles.featured} ${featuredSquare ? styles.featuredSquare : ''} ${hasAppeared ? styles.appeared : ''}` : styles.product} key={product.href} data-source-id={product.sourceId}>
        <Link className={product.image ? styles.productLink : `${styles.productLink} ${styles.noMedia}`} href={product.href} target={product.external ? '_blank' : undefined} rel={product.external ? 'noopener noreferrer' : undefined} aria-label={product.external ? `${product.title}: ${product.actionLabel ?? 'Siteyi ziyaret et'} (yeni sekmede açılır)` : `${product.actionLabel ?? 'İncele'}: ${product.title}`}>
        {product.image && <div className={styles.media}>
          {product.optimizedImage
            ? <Image src={product.image.src} alt={product.image.alt} width={400} height={220} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw" onAnimationEnd={index === 0 ? finish : undefined} />
            : <img src={product.image.src} alt={product.image.alt || product.title} loading="lazy" onAnimationEnd={index === 0 ? finish : undefined} />}
          <span className={styles.mediaAction} aria-hidden="true">{product.actionLabel ?? (product.external ? 'Siteyi Ziyaret Et' : 'İncele')} ↗</span>
        </div>}
        <div className={styles.content}>
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
          <Heading className={styles.title}>{product.title}</Heading>
          <p className={styles.description}>{product.description}</p>
          {!product.image && <span className={styles.fallbackAction} aria-hidden="true">{product.actionLabel ?? (product.external ? 'Siteyi Ziyaret Et' : 'İncele')} ↗</span>}
        </div>
        </Link>
        {onImage && product.image && <button type="button" className={styles.zoomButton} aria-label={`${product.title} görselini büyüt`} onClick={() => onImage({ src: product.image!.src, title: product.title })}>Büyüt</button>}
      </article>)}
  </div>;
}
