import type { CSSProperties } from 'react';
import styles from './ProductHero.module.css';
import { HeroBottomLine } from './HeroBottomLine';

type Action = { label: string; href: string; variant: 'primary' | 'secondary' };

interface ProductHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  optimizedImages?: { mobile: string; desktop: string };
  actions: readonly Action[];
  /** Short bullet points shown under the lead. */
  highlights?: readonly string[];
  /** `compact` is the page standard; `showcase` is the taller landing hero (display-size title). */
  variant?: 'compact' | 'showcase';
}

export function ProductHero({ eyebrow, title, description, image, optimizedImages, actions, highlights, variant = 'compact' }: ProductHeroProps) {
  const style = {
    '--hero-image': `url("${image}")`,
    ...(optimizedImages && {
      '--hero-image-optimized': `image-set(url("${optimizedImages.desktop}") type("image/webp"), url("${image}"))`,
      '--hero-image-optimized-mobile': `image-set(url("${optimizedImages.mobile}") type("image/webp"), url("${image}"))`,
    }),
  } as CSSProperties;
  return <section className={variant === 'showcase' ? `${styles.hero} ${styles.showcase}` : styles.hero} style={style}>
    <div className={`alu-container ${styles.content}`}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{description}</p>
      {highlights && highlights.length > 0 && <ul className={styles.highlights}>{highlights.map(item => <li key={item}>{item}</li>)}</ul>}
      <div className={styles.actions}>{actions.map(action => <a key={action.href} className={`alu-button alu-button--${action.variant} alu-button--md`} href={action.href}>{action.label}</a>)}</div>
    </div>
    <HeroBottomLine />
  </section>;
}
