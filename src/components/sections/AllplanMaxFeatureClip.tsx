'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AllplanMaxFeatureClip.module.css';

const AUTOPLAY_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
const VISIBILITY_MARGIN = '200px';

export function AllplanMaxFeatureClip({ src, poster, title }: { src: string; poster: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(AUTOPLAY_QUERY);
    const update = () => setCanAutoplay(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: VISIBILITY_MARGIN });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible) return;
    if (canAutoplay) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [visible, canAutoplay]);

  return <div ref={containerRef} className={styles.container}>{visible && <video
    ref={videoRef}
    className={styles.video}
    muted
    loop
    playsInline
    controls
    preload={visible && !canAutoplay ? 'metadata' : 'none'}
    poster={poster}
    src={`${src}#t=0.1`}
    aria-label={`${title} görsel tanıtımı`}
  />}</div>;
}
