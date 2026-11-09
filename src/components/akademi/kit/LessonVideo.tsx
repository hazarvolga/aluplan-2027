import type { ReactElement } from 'react';
import type { LessonVideo as LessonVideoData } from '@/data/akademi-content';
import styles from './LessonVideo.module.css';

/**
 * Embedded tutorial video in a responsive 16:9 frame. The iframe is lazy-loaded
 * and the title is announced to assistive tech. `url` must be a provider embed
 * URL (Vimeo player or YouTube embed) served from a domain that allows embedding.
 */
export function LessonVideo({ video }: { video: LessonVideoData }): ReactElement {
  const { url, title, source } = video;
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
