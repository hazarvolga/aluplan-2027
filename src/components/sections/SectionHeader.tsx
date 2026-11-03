import type { ReactElement } from 'react';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  lead?: string;
}

/** The one centered header of a page section: small kicker, h2 at the section scale, optional lead. */
export function SectionHeader({ kicker, title, lead }: SectionHeaderProps): ReactElement {
  return (
    <div className="alu-section-header-center">
      {kicker && <span className="preview-kicker">{kicker}</span>}
      <h2 className="alu-h2" style={{ margin: 0 }}>
        {title}
      </h2>
      {lead && (
        <p className="alu-body preview-meta" style={{ margin: 0, maxWidth: 'var(--container-prose)' }}>
          {lead}
        </p>
      )}
    </div>
  );
}
