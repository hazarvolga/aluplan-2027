import type { SolutionDirectoryGroup } from '@/lib/site-data';
import { SolutionDirectoryCard } from './SolutionDirectoryCard';
import { SolutionOverviewCards } from './SolutionOverviewCards';

export function SolutionHubSection({ hub }: { hub: SolutionDirectoryGroup }) {
  const isBuildingExample = hub.hubPath === '/solutions-v2/building-design';
  const buildingItems = isBuildingExample
    ? hub.hubItems.map((item) => ({
        ...item,
        image: hub.catalogItems.find((catalogItem) => catalogItem.href === item.href)?.image,
      }))
    : [];

  return (
    <section
      className="preview-section"
      aria-label={`${hub.title} çözümleri`}
      data-solution-directory="hub"
    >
      <div className="alu-container">
        {isBuildingExample ? <SolutionOverviewCards items={buildingItems} headingLevel={2} /> : <div className="alu-spec-grid">
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
