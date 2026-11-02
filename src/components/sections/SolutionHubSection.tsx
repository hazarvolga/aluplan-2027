import type { SolutionDirectoryGroup } from '@/lib/site-data';
import { SolutionDirectoryCard } from './SolutionDirectoryCard';

export function SolutionHubSection({ hub }: { hub: SolutionDirectoryGroup }) {
  return (
    <section
      className="preview-section"
      aria-label={`${hub.title} çözümleri`}
      data-solution-directory="hub"
    >
      <div className="alu-container">
        <div className="alu-spec-grid">
          {hub.hubItems.map((item, index) => (
            <SolutionDirectoryCard
              key={`${item.title}-${item.href}`}
              item={item}
              index={index}
              label={hub.title}
              headingLevel={2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
