'use client';

import { usePathname } from 'next/navigation';
import styles from './HeroBottomLine.module.css';

export function HeroBottomLine() {
  const pathname = usePathname();
  return <span key={pathname} className={styles.line} data-hero-bottom-line aria-hidden="true" />;
}
