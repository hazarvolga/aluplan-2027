import type { ReactNode } from 'react';
import styles from './FeatureRow.module.css';
import { DebugComponentLabel } from './DebugComponentLabel';

type FeatureRowProps = {
  index: number;
  title: string;
  media: ReactNode;
  kicker?: string;
  headingLevel?: 2 | 3;
  mediaFit?: 'cover' | 'contain';
  children: ReactNode;
};

const rowNumber = (index: number) => String(index + 1).padStart(2, '0');

/** Vertical stack of FeatureRow items; every second row puts its media on the right. */
export function FeatureRowList({ children }: { children: ReactNode }) {
  return <DebugComponentLabel name="FeatureRowList"><div className={styles.list}>{children}</div></DebugComponentLabel>;
}

/** Card with media on one side and text on the other: the shared feature row of product and solution pages. */
export function FeatureRow({ index, title, media, kicker, headingLevel = 3, mediaFit = 'cover', children }: FeatureRowProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const rowClass = index % 2 === 1 ? `${styles.row} ${styles.reverse}` : styles.row;
  return <DebugComponentLabel name="FeatureRow"><article className={rowClass}>
    <div className={mediaFit === 'contain' ? `${styles.media} ${styles.contain}` : styles.media}>
      {media}
      <span className={styles.index} aria-hidden="true">{rowNumber(index)}</span>
    </div>
    <div className={styles.content}>
      {kicker && <span className="preview-kicker">{kicker}</span>}
      <Heading className={styles.title}>{title}</Heading>
      <div className={styles.body}>{children}</div>
    </div>
  </article></DebugComponentLabel>;
}
