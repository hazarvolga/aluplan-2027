import type { ReactNode } from 'react';
import Link from 'next/link';
import styles from './CompactPageHero.module.css';
import { HeroBottomLine } from './HeroBottomLine';

export interface HeroCrumb {
  label: string;
  href?: string;
}

interface CompactPageHeroProps {
  crumbs: HeroCrumb[];
  kicker?: string;
  title: string;
  lead: string;
  children?: ReactNode;
}

export function CompactPageHero({ crumbs, kicker, title, lead, children }: CompactPageHeroProps) {
  return (
    <header className={styles.hero} style={{ position: 'relative' }}>
      <div className="alu-container">
        <nav className={styles.breadcrumb} aria-label="Sayfa yolu">
          {crumbs.map((crumb, index) => (
            <span key={crumb.label} className={styles.crumb}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
            </span>
          ))}
        </nav>
        {kicker && <span className="alu-badge alu-badge--accent">{kicker}</span>}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>{lead}</p>
        {children}
      </div>
      <HeroBottomLine />
    </header>
  );
}
