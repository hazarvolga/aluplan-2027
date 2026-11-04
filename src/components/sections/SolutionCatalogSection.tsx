import type { SolutionDirectory } from '@/lib/site-data';
import { SectionHeader } from './SectionHeader';
import { SolutionOverviewCards } from './SolutionOverviewCards';
import { ProductsOverview } from './ProductsOverview';
import { DebugComponentLabel } from './DebugComponentLabel';
import catalogStyles from './SolutionCatalogSection.module.css';

export function SolutionCatalogSection({ directory }: { directory: SolutionDirectory }) {
  const { catalogIntro: intro, groups } = directory;

  return (
    <section className="preview-section" aria-label="Tüm çözümler" data-solution-directory="catalog">
      <div className="alu-container">
        <div className="alu-stack" style={{ gap: 'var(--space-stack-sm)' }}>
          <span className="preview-kicker">{intro.kicker}</span>
          <h2 className="alu-h2" style={{ margin: 0 }}>
            {intro.title}
          </h2>
          <p className="alu-body-lg" style={{ margin: 0, maxWidth: 'var(--container-application-intro-single)' }}>
            {intro.description}
          </p>
        </div>
        {groups.map((group, groupIndex) => (
          <section key={group.hubPath} className={`alu-stack ${catalogStyles.group}`} aria-labelledby={`solution-group-${groupIndex}`}>
            <SectionHeader kicker={`${String(groupIndex + 1).padStart(2, '0')} · ÇÖZÜM ALANI`} title={group.title} id={`solution-group-${groupIndex}`} />
            {group.hubPath === '/cozumler/bina-tasarimi' ? (
              <DebugComponentLabel name="ProductsOverview"><ProductsOverview items={group.catalogItems} headingLevel={3} /></DebugComponentLabel>
            ) : <SolutionOverviewCards items={group.catalogItems} headingLevel={3} />}
          </section>
        ))}
      </div>
    </section>
  );
}
