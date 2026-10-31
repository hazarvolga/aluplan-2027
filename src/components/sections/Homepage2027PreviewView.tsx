import Link from 'next/link';
import { AluIcon } from '@/components/ui/AluIcon';
import { HomepageView } from './HomepageView';
import styles from './Homepage2027PreviewView.module.css';

export function Homepage2027PreviewView() {
  return <>
    <HomepageView previewMaxHero />
    <section className={styles.lifecycle} aria-label="Ürün yaşam döngüsü">
      <div className={`alu-container ${styles.row}`}>
        <p>ALLPLAN ürün yaşam döngüsü ve sürüm desteği hakkında bilgi alın.</p>
        <Link href="/preview/product-lifecycle">Ürün yaşam döngüsünü inceleyin <AluIcon name="arrow-right" size="sm" /></Link>
      </div>
    </section>

  </>;
}
