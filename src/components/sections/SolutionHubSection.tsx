import type { SolutionDirectoryGroup } from '@/lib/site-data';
import { SolutionDirectoryCard } from './SolutionDirectoryCard';
import { SolutionOverviewCards } from './SolutionOverviewCards';

export function SolutionHubSection({ hub }: { hub: SolutionDirectoryGroup }) {
  const items = hub.hubItems.map((item) => {
    const catalogItem = hub.catalogItems.find((candidate) => candidate.href === item.href)
      ?? (item.href === '/solutions/ax3000' && item.title === 'AX3000 MEP'
        ? hub.catalogItems.find((candidate) => candidate.href === '/solutions/ax3000-mekanik-tesisat' && candidate.title === item.title)
        : undefined);
    return { ...item, image: catalogItem?.image };
  });
  const hasAllImages = items.every((item) => item.image);

  return (
    <section
      className="preview-section"
      aria-label={`${hub.title} çözümleri`}
      data-solution-directory="hub"
    >
      <div className="alu-container">
        {hasAllImages ? <SolutionOverviewCards items={items} headingLevel={2} /> : <div className="alu-spec-grid">
          {hub.hubItems.map((item, index) => (
            <SolutionDirectoryCard
              key={`${item.title}-${item.href}`}
              item={item}
              index={index}
              label={hub.title}
              headingLevel={2}
            />
          ))}
        </div>}
      </div>
    </section>
  );
}
