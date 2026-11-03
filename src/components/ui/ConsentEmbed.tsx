'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AluIcon } from '@/components/ui/AluIcon';
import { useCookieConsent } from '@/lib/consent';
import { embedKind, normalizeEmbedSrc, withAutoplay } from '@/lib/embeds';
import styles from './ConsentEmbed.module.css';

const VIDEO_PERMISSIONS = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

interface ConsentEmbedProps {
  src: string;
  title: string;
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
  /** The visitor already asked for this embed (e.g. opened a video dialog), so it loads without a facade. */
  requested?: boolean;
}

export function ConsentEmbed({ src, title, className, style, fill = false, requested = false }: ConsentEmbedProps) {
  const consent = useCookieConsent();
  const [activated, setActivated] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const kind = embedKind(src);

  useEffect(() => {
    if (activated) frameRef.current?.focus();
  }, [activated]);

  if (requested || activated || consent === 'accepted') {
    return (
      <iframe
        ref={frameRef}
        src={activated ? withAutoplay(src) : normalizeEmbedSrc(src)}
        title={title}
        className={className}
        style={style}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow={kind === 'video' ? VIDEO_PERMISSIONS : undefined}
        allowFullScreen
      />
    );
  }

  const actionLabel = kind === 'video' ? 'Videoyu oynat' : 'Haritayı göster';
  const facadeClass = [styles.facade, styles[kind], fill ? styles.fill : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={facadeClass} style={style}>
      <p className={styles.title}>{title}</p>
      <button
        type="button"
        className="alu-button alu-button--secondary alu-button--md"
        aria-label={`${title}: ${actionLabel}`}
        onClick={() => setActivated(true)}
      >
        <AluIcon name={kind === 'video' ? 'circle-play' : 'map-pin'} size="sm" />
        <span>{actionLabel}</span>
      </button>
    </div>
  );
}
