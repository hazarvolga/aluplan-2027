import type { PageRecord } from '@/lib/site-data';
import { SectionHeader } from './SectionHeader';
import { visibleSectionItems } from './SectionLinks';
import { SolutionOverviewCards } from './SolutionOverviewCards';
import styles from './CdsAddonPageContent.module.css';

export function CdsAddonPageContent({ page }: { page: PageRecord }) {
  const introductions = page.sections.filter((section) => section.level === 2 && !section.image);
  const modules = page.sections.filter((section) => section.level === 3 && section.link);
  const items = modules.map((section) => ({
    title: section.heading,
    href: section.link!.href,
    description: '',
    external: false,
    image: section.image,
  }));
  const paragraphsByHref = Object.fromEntries(modules.map((section) => [
    section.link!.href, visibleSectionItems(section),
  ]));

  return (
    <section className="preview-section" aria-label="Sayfa içeriği">
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        {introductions.map((section, index) => (
          <div className="alu-stack" style={{ gap: 'var(--space-stack-sm)' }} key={`${section.heading}-${index}`}>
            <SectionHeader title={section.heading} />
            {visibleSectionItems(section).map((paragraph, paragraphIndex) => (
              <p className="alu-body" key={paragraphIndex} style={{ margin: 0 }}>{paragraph}</p>
            ))}
          </div>
        ))}
        <div className={styles.modules}>
          <SolutionOverviewCards items={items} headingLevel={3} paragraphsByHref={paragraphsByHref} actionLabel="İncele" />
        </div>
      </div>
    </section>
  );
}
