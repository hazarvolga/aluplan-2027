import type { ReactElement } from 'react';
import type { Figure as FigureData } from '@/data/akademi-content';
import styles from './Figure.module.css';

interface FigureProps {
  figure: FigureData;
  /** Eager-load the first demo image; lazy-load the rest. */
  priority?: boolean;
}

/**
 * A real ALLPLAN screenshot with caption and attribution. The image keeps its
 * intrinsic width/height so the layout reserves space before it loads, and
 * `alt` always describes the screen for assistive tech and failed loads.
 */
export function Figure({ figure, priority = false }: FigureProps): ReactElement {
  const { src, alt, caption, source, width, height } = figure;
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static /public asset, no optimization pipeline for flagged akademi */}
        <img
          className={styles.image}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
      {(caption || source) && (
        <figcaption className={styles.caption}>
          {caption && <span className={styles.captionText}>{caption}</span>}
          {source && <span className={styles.source}>{source}</span>}
        </figcaption>
      )}
    </figure>
  );
}
