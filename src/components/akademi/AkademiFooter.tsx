import Link from 'next/link';
import styles from './AkademiFooter.module.css';

const COPYRIGHT_YEAR = new Date().getFullYear();

/** Minimal academy footer: copyright notice, legal links and a single link back to the main site. */
export function AkademiFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`alu-container ${styles.inner}`}>
        <div className={styles.copyBlock}>
          <span className={styles.copy}>Aluplan Akademi · ALLPLAN Türkçe eğitim programı</span>
          <span className={styles.rights}>
            © {COPYRIGHT_YEAR} Aluplan Program Sistemleri. Ders metinleri ve ekran görüntüleri izinsiz çoğaltılamaz.
          </span>
        </div>
        <nav className={styles.legal} aria-label="Yasal ve site bağlantıları">
          <Link href="/kvkk" className={styles.link}>KVKK</Link>
          <Link href="/gizlilik-politikasi" className={styles.link}>Gizlilik</Link>
          <Link href="/kullanim-sartlari" className={styles.link}>Kullanım Şartları</Link>
          <Link href="/" className={styles.link}>Aluplan ana sitesi →</Link>
        </nav>
      </div>
    </footer>
  );
}
