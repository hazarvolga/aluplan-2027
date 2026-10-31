import { useId } from 'react';
import styles from './IntroSplitSection.module.css';

type IntroSplitSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  factsTitle: string;
  facts: readonly string[];
  action?: { label: string; href: string };
};

export function IntroSplitSection({ eyebrow, title, description, factsTitle, facts, action }: IntroSplitSectionProps) {
  const titleId = useId();
  return <section className={styles.intro} aria-labelledby={titleId}>
    <div className="alu-container">
      <div className={styles.introGrid}>
        <div className={styles.introMain}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={titleId}>{title}</h2>
          <p>{description}</p>
        </div>
        <div className={styles.introFacts}>
          <h3>{factsTitle}</h3>
          {facts.map((fact, index) => <p key={`${index}-${fact}`}>{fact}</p>)}
          {action && <a href={action.href}>{action.label}</a>}
        </div>
      </div>
    </div>
  </section>;
}
