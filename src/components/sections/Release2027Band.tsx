import Link from 'next/link';
import type { Release2027Band as Band } from '@/data/allplan-2027-editions';
import styles from './Release2027Band.module.css';

export function Release2027Band({ band }: { band: Band }) {
  return <section className={styles.band} aria-label="2027 yenilikleri">
    <div className={`alu-container ${styles.inner}`}>
      <div className={styles.text}><p className={styles.kicker}>SÜRÜM 2027</p><h2 className={styles.title}>{band.title}</h2></div>
      <Link className="alu-button alu-button--primary alu-button--md" href={band.href}>2027 yeniliklerini inceleyin</Link>
    </div>
  </section>;
}
