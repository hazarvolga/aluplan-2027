import Link from 'next/link';
import styles from './AkademiFooter.module.css';

/** Minimal academy footer: legal/KVKK and a single link back to the main site. */
export function AkademiFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`alu-container ${styles.inner}`}>
        <span className={styles.copy}>Aluplan Akademi · ALLPLAN Türkçe eğitim programı</span>
        <nav className={styles.legal} aria-label="Yasal ve site bağlantıları">
          <Link href="/kvkk" className={styles.link}>KVKK</Link>
          <Link href="/gizlilik-politikasi" className={styles.link}>Gizlilik</Link>
          <Link href="/" className={styles.link}>Aluplan ana sitesi →</Link>
        </nav>
      </div>
    </footer>
  );
}
