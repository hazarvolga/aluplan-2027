import type { CSSProperties } from 'react';
import styles from './ProductHero.module.css';

type Action = { label: string; href: string; variant: 'primary' | 'secondary' };

interface ProductHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  actions: readonly Action[];
  /** Short bullet points shown under the lead. */
  highlights?: readonly string[];
  /** `compact` is the page standard; `showcase` is the taller landing hero (display-size title). */
  variant?: 'compact' | 'showcase';
}

export function ProductHero({ eyebrow, title, description, image, actions, highlights, variant = 'compact' }: ProductHeroProps) {
  return <section className={variant === 'showcase' ? `${styles.hero} ${styles.showcase}` : styles.hero} style={{ '--hero-image': `url("${image}")` } as CSSProperties}>
    <div className={`alu-container ${styles.content}`}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{description}</p>
      {highlights && highlights.length > 0 && <ul className={styles.highlights}>{highlights.map(item => <li key={item}>{item}</li>)}</ul>}
      <div className={styles.actions}>{actions.map(action => <a key={action.href} className={`alu-button alu-button--${action.variant} alu-button--md`} href={action.href}>{action.label}</a>)}</div>
    </div>
  </section>;
}
