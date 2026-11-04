import Link from 'next/link';
import { AluIcon } from '@/components/ui/AluIcon';
import { HomepageView } from './HomepageView';
import styles from './Homepage2027PreviewView.module.css';
import { DebugComponentLabel } from './DebugComponentLabel';

export function Homepage2027PreviewView() {
  return <>
    <HomepageView previewMaxHero />
    <DebugComponentLabel name="lifecycleLink (özel)"><section className={styles.lifecycle} aria-label="Ürün yaşam döngüsü">
      <div className={`alu-container ${styles.row}`}>
        <p>ALLPLAN ürün yaşam döngüsü ve sürüm desteği hakkında bilgi alın.</p>
        <Link href="/product-lifecycle">Ürün yaşam döngüsünü inceleyin <AluIcon name="arrow-right" size="sm" /></Link>
      </div>
    </section></DebugComponentLabel>

  </>;
}
