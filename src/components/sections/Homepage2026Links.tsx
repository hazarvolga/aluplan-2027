import Link from 'next/link';
import { AluIcon } from '@/components/ui/AluIcon';
import styles from './Homepage2027PreviewView.module.css';

export function Homepage2026Links() {
  return (
    <section className={styles.innovations} aria-labelledby="homepage-2026-innovations">
      <div className={`alu-container ${styles.innovationsRow}`}>
        <div><p className="preview-kicker">ALLPLAN 2026</p><h2 id="homepage-2026-innovations">ALLPLAN 2026 yeniliklerini keşfedin</h2></div>
        <div className={styles.innovationsActions}>
          <Link className="alu-button alu-button--primary alu-button--md" href="/products/allplan-2026-yenilikler">Yenilikleri inceleyin <AluIcon name="arrow-right" size="sm" /></Link>
          <Link className="alu-button alu-button--secondary alu-button--md" href="/products/allplan-2026">ALLPLAN 2026’yı inceleyin <AluIcon name="arrow-right" size="sm" /></Link>
        </div>
      </div>
    </section>
  );
}
