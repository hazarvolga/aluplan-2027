import type { DocumentGroup } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

interface DocumentGroupsSectionProps {
  groups: DocumentGroup[];
}

export function DocumentGroupsSection({ groups }: DocumentGroupsSectionProps) {
  return (
    <>
      {groups.map((group) => (
        <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="alu-stack">
          <p className="preview-kicker">AX3000 / {group.documents.length} doküman</p>
          <h2 id={`${group.id}-title`} className="alu-h2">{group.title}</h2>
          <p className="alu-body">{group.description}</p>
          <div className="alu-spec-grid">
            {group.documents.map((doc) => {
              const downloadLabel = doc.format === 'PDF' ? 'PDF İndir' : 'Word İndir';
              return (
              <article key={doc.filename} className="alu-spec-card">
                <div className="alu-spec-card__header">
                  <span className="alu-badge">{doc.badge}</span>
                  <span className="alu-card__eyebrow">{doc.language} · {doc.format}</span>
                </div>
                <h3 className="alu-h4">{doc.title}</h3>
                <p className="alu-body-sm">{doc.description}</p>
                <p className="alu-body-sm">{doc.detail} · {doc.size}</p>
                <a
                  className="alu-button alu-button--primary alu-button--md"
                  href={doc.href}
                  download={doc.filename}
                  aria-label={`${downloadLabel}: ${doc.title} (${doc.language})`}
                >
                  <AluIcon name="download" size="sm" />
                  <span>{downloadLabel}</span>
                </a>
              </article>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
