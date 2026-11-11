'use client';

import { useState, type ReactElement } from 'react';
import { MediaDialog } from '@/components/ui/MediaDialog';
import styles from './LessonImage.module.css';

interface LessonImageProps {
  src: string;
  alt: string;
  /** Shown as the dialog title; falls back to alt. */
  caption?: string;
  /** Thumbnail image class (sizing/border from the host section). */
  className?: string;
  /** Intrinsic size; reserves the image's space so the page does not shift while it loads. */
  width?: number;
  height?: number;
}

/**
 * A lesson screenshot that opens full size in a lightbox on click. Interface
 * details in a software tutorial are often too small to read inline; the
 * lightbox lets the student inspect the full-resolution capture. Reuses the
 * shared image dialog (MediaDialog + alu-video-modal image classes).
 */
export function LessonImage({ src, alt, caption, className, width, height }: LessonImageProps): ReactElement {
  const [open, setOpen] = useState(false);
  const title = caption ?? alt;
  return (
    <>
      <button type="button" className={styles.button} onClick={() => setOpen(true)} aria-label={`${title} — büyüt`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static /public asset */}
        <img className={className} src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        <span className={styles.hint} aria-hidden="true">Büyüt</span>
      </button>
      {open && (
        <MediaDialog label={title} onClose={() => setOpen(false)}>
          <div className="alu-video-modal__dialog alu-video-modal__dialog--image" onClick={(e) => e.stopPropagation()}>
            <div className="alu-video-modal__header">
              <h3 className="alu-video-modal__title">{title}</h3>
              <button
                type="button"
                className="alu-video-modal__close"
                data-media-dialog-close
                aria-label="Kapat"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="alu-video-modal__image-viewport">
              {/* eslint-disable-next-line @next/next/no-img-element -- static /public asset */}
              <img src={src} alt={alt} />
            </div>
          </div>
        </MediaDialog>
      )}
    </>
  );
}
