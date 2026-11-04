import type { ReactNode } from 'react';
import styles from './CompactPageHero.module.css';
import { HeroBottomLine } from './HeroBottomLine';

interface CompactPageHeroProps {
  kicker?: string;
  title: string;
  lead: string;
  children?: ReactNode;
}

export function CompactPageHero({ kicker, title, lead, children }: CompactPageHeroProps) {
  return (
    <header className={styles.hero} style={{ position: 'relative' }}>
      <div className="alu-container">
        {kicker && <span className="alu-badge alu-badge--accent">{kicker}</span>}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>{lead}</p>
        {children}
      </div>
      <HeroBottomLine />
    </header>
  );
}
