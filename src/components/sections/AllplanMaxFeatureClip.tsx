'use client';

import { useEffect, useState } from 'react';
import styles from './AllplanMaxPreviewPage.module.css';

export function AllplanMaxFeatureClip({ src, title }: { src: string; title: string }) {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return <video key={String(reducedMotion)} className={styles.featureClip} muted loop playsInline autoPlay={!reducedMotion} controls preload="metadata" aria-label={`${title} görsel tanıtımı`}>
    <source src={src} type="video/mp4" />
  </video>;
}
