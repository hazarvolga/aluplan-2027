import type { CSSProperties } from 'react';
import styles from './ProductHero.module.css';

type Action = { label: string; href: string; variant: 'primary' | 'secondary' };
export function ProductHero({ eyebrow, title, description, image, actions }: { eyebrow: string; title: string; description: string; image: string; actions: readonly Action[] }) {
  return <section className={styles.hero} style={{ '--hero-image': `url("${image}")` } as CSSProperties}>
    <div className={`alu-container ${styles.content}`}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{description}</p>
      <div className={styles.actions}>{actions.map(action => <a key={action.href} className={`alu-button alu-button--${action.variant} alu-button--md`} href={action.href}>{action.label}</a>)}</div>
    </div>
  </section>;
}
