import Link from 'next/link';
import type { PageSection, SectionAction, SectionLink } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

interface SectionCardLinkProps {
  link: SectionLink;
  heading: string;
}

export function SectionCardLink({ link, heading }: SectionCardLinkProps) {
  return (
    <Link href={link.href} className="alu-link alu-link--standalone" aria-label={`${link.label}: ${heading}`}>
      <span>{link.label}</span>
      <AluIcon name="arrow-right" size="sm" />
    </Link>
  );
}

interface SectionActionsProps {
  actions: SectionAction[];
  currentPath: string;
}

export function SectionActions({ actions, currentPath }: SectionActionsProps) {
  return (
    <div className="alu-cluster">
      {actions.map((action) =>
        action.external ? (
          <a
            key={action.href}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className="alu-button alu-button--secondary alu-button--md"
          >
            <span>{action.label}</span>
            <span className="alu-visually-hidden"> (yeni sekmede açılır)</span>
            <AluIcon name="external-link" size="sm" />
          </a>
        ) : (
          <Link
            key={action.href}
            href={action.href}
            aria-current={action.href === currentPath ? 'page' : undefined}
            className="alu-button alu-button--secondary alu-button--md"
          >
            <span>{action.label}</span>
          </Link>
        )
      )}
    </div>
  );
}

export function visibleSectionItems(section: PageSection): string[] {
  const linkLabels = new Set([
    ...(section.link ? [section.link.label] : []),
    ...(section.actions ?? []).map((action) => action.label)
  ]);
  return section.items.filter((item) => !linkLabels.has(item));
}
