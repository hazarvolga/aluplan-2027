import Link from 'next/link';

import type { SolutionDirectoryItem } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

export function SolutionDirectoryCard({
  item,
  index,
  label,
  headingLevel
}: {
  item: SolutionDirectoryItem;
  index: number;
  label: string;
  headingLevel: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const number = String(index + 1).padStart(2, '0');
  const content = (
    <>
      {item.image && (
        <span className="alu-solution-card__media" aria-hidden="true">
          <img src={item.image.src} alt="" loading="lazy" />
        </span>
      )}
      <div className="alu-spec-card__header">
        <span className="alu-spec-card__num">{number}</span>
        <span className="alu-card__eyebrow">{label}</span>
      </div>
      <Heading className="alu-h3" style={{ margin: 0 }}>
        {item.title}
      </Heading>
      <p className="alu-body-sm" style={{ margin: 0 }}>
        {item.description}
      </p>
      <span className="alu-solution-card__action" aria-hidden="true">
        <span>{item.external ? 'Siteyi Ziyaret Et' : 'Detayları İncele'}</span>
        <AluIcon name={item.external ? 'arrow-up-right' : 'chevron-right'} size="sm" />
      </span>
    </>
  );

  if (item.external) {
    return (
      <a
        className="alu-spec-card alu-solution-card"
        data-solution-card
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link className="alu-spec-card alu-solution-card" data-solution-card href={item.href}>
      {content}
    </Link>
  );
}
