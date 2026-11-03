'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AllplanMaxPreviewPage.module.css';

const AUTOPLAY_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
const VISIBILITY_MARGIN = '200px';

export function AllplanMaxFeatureClip({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
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
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: VISIBILITY_MARGIN });
    observer.observe(video);
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

  return <video
    ref={videoRef}
    className={styles.featureClip}
    muted
    loop
    playsInline
    controls
    preload={visible && !canAutoplay ? 'metadata' : 'none'}
    src={visible ? `${src}#t=0.1` : undefined}
    aria-label={`${title} görsel tanıtımı`}
  />;
}
