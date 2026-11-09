import type { ReactElement } from 'react';
import type { LessonVideo as LessonVideoData } from '@/data/akademi-content';
import styles from './LessonVideo.module.css';

/**
 * Embedded tutorial video in a responsive 16:9 frame, or a labelled placeholder
 * slot when no url is set yet. The placeholder names the video topic so the
 * right clip can be sourced and dropped in later; the iframe is lazy-loaded.
 */
export function LessonVideo({ video }: { video: LessonVideoData }): ReactElement {
  const { url, title, source, placeholder } = video;
  const isPlaceholder = placeholder || !url;

  if (isPlaceholder) {
    return (
      <figure className={styles.video}>
        <div className={`${styles.frame} ${styles.placeholder}`}>
          <span className={styles.phLabel}>VİDEO</span>
          <span className={styles.phTitle}>{title ?? 'Eğitim videosu'}</span>
          <span className={styles.phNote}>Bu konuda video buraya eklenecek</span>
        </div>
      </figure>
    );
  }

  return (
    <figure className={styles.video}>
      <div className={styles.frame}>
        <iframe
          className={styles.iframe}
          src={url}
          title={title ?? 'ALLPLAN eğitim videosu'}
          loading="lazy"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
      {(title || source) && (
        <figcaption className={styles.caption}>
          {title && <span className={styles.captionText}>{title}</span>}
          {source && <span className={styles.source}>{source}</span>}
        </figcaption>
      )}
    </figure>
  );
}
