import type { ReactElement } from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  lead?: string;
  /** Id of the heading, for `aria-labelledby` on the section. */
  id?: string;
  /** Use h3 for compact headings nested inside a section. */
  as?: 'h1' | 'h2' | 'h3';
}

/** The one section header of the site: left-aligned kicker, heading at the section scale, optional lead. */
export function SectionHeader({ kicker, title, lead, id, as = 'h2' }: SectionHeaderProps): ReactElement {
  const Heading = as;
  return (
    <div className="alu-section-header">
      {kicker && <span className="preview-kicker">{kicker}</span>}
      <Heading id={id} className={as === 'h1' ? 'alu-h1' : as === 'h3' ? 'alu-h3' : 'alu-h2'} style={{ margin: 0, ...(as === 'h3' ? { paddingTop: 'var(--space-stack-md)' } : {}) }}>
        {as === 'h3' && <span className={styles.marker} aria-hidden="true" />}
        {title}
      </Heading>
      {lead && (
        <p className="alu-body preview-meta" style={{ margin: 0, maxWidth: 'var(--container-prose)' }}>
          {lead}
        </p>
      )}
    </div>
  );
}
