import type { SolutionDirectory } from '@/lib/site-data';
import { SolutionDirectoryCard } from './SolutionDirectoryCard';

export function SolutionCatalogSection({ directory }: { directory: SolutionDirectory }) {
  const { catalogIntro: intro, groups } = directory;

  return (
    <section className="preview-section" aria-label="Tüm çözümler" data-solution-directory="catalog">
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-2xl)' }}>
        <div className="alu-stack" style={{ gap: 'var(--space-stack-sm)' }}>
          <span className="preview-kicker">{intro.kicker}</span>
          <h2 className="alu-h1" style={{ margin: 0 }}>
            {intro.title}
          </h2>
          <p className="alu-body-lg" style={{ margin: 0, maxWidth: 'var(--container-application-intro-single)' }}>
            {intro.description}
          </p>
        </div>
        {groups.map((group, groupIndex) => (
          <section key={group.hubPath} className="alu-stack" aria-labelledby={`solution-group-${groupIndex}`}>
            <div className="alu-stack" style={{ gap: 'var(--space-stack-sm)' }}>
              <span className="preview-kicker">{String(groupIndex + 1).padStart(2, '0')} · ÇÖZÜM ALANI</span>
              <h2 id={`solution-group-${groupIndex}`} className="alu-h2" style={{ margin: 0 }}>
                {group.title}
              </h2>
            </div>
            <div className="alu-spec-grid">
              {group.catalogItems.map((item, index) => (
                <SolutionDirectoryCard
                  key={`${item.title}-${item.href}`}
                  item={item}
                  index={index}
                  label={group.title}
                  headingLevel={3}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
