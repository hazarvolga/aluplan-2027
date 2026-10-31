import styles from './PreviewClosingSection.module.css';

export type PreviewClosingItem = {
  title?: string;
  paragraphs: readonly string[];
  action?: { label: string; href: string };
};

export function PreviewClosingSection({ id, title, kicker, items }: {
  id: string;
  title: string;
  kicker?: string;
  items: readonly PreviewClosingItem[];
}) {
  return <section className={styles.section} aria-labelledby={id}>
    <div className="alu-container">
      {kicker && <p className={styles.kicker}>{kicker}</p>}
      <h2 id={id} className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {items.map((item, index) => <article className={styles.option} key={index}>
          {item.title && <h3>{item.title}</h3>}
          {item.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
          {item.action && <a className="alu-button alu-button--primary alu-button--md" href={item.action.href}>{item.action.label} ↗</a>}
        </article>)}
      </div>
    </div>
  </section>;
}
