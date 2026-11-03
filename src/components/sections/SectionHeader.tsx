import type { ReactElement } from 'react';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  lead?: string;
  /** Id of the heading, for `aria-labelledby` on the section. */
  id?: string;
  /** Page-title blocks use `h1`; every other section uses `h2`. */
  as?: 'h1' | 'h2';
}

/** The one section header of the site: left-aligned kicker, heading at the section scale, optional lead. */
export function SectionHeader({ kicker, title, lead, id, as = 'h2' }: SectionHeaderProps): ReactElement {
  const Heading = as;
  return (
    <div className="alu-section-header">
      {kicker && <span className="preview-kicker">{kicker}</span>}
      <Heading id={id} className={as === 'h1' ? 'alu-h1' : 'alu-h2'} style={{ margin: 0 }}>
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
