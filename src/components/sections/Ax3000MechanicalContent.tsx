import type { PageRecord, PageSection } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { SectionActions, SectionCardLink, visibleSectionItems } from './SectionLinks';
import styles from './Ax3000MechanicalContent.module.css';

const HEADINGS = {
  intro: 'Tüm Tesisat için Tek Yazılım',
  standards: "ALLPLAN, AX3000 tüm modülleriyle Türkçe'dir ve Türk Standartlarına göre düzenlenmiştir.",
  smart: 'Akıllı Çizim Elemanları Sayesinde Hızlı Hesaplama',
  data: 'Gelişmiş Veri Arayüzü',
  energy: 'Enerji Kimlik Belgesi',
  documents: 'Broşürler ve teknik dokümanlar tek yerde'
} as const;
const CLIMATE_IMAGE = 'iklim.png';
const LIST_BULLET = '•';

function requireSection(sections: PageSection[], heading: string): { section: PageSection; index: number } {
  const index = sections.findIndex((section) => section.heading === heading);
  if (index < 0) throw new Error(`Ax3000MechanicalContent: section "${heading}" is missing from the page data`);
  return { section: sections[index], index };
}

const text = (section: PageSection): string => visibleSectionItems(section)[0] ?? '';

function buildLayout(page: PageRecord) {
  const { sections } = page;
  const smart = requireSection(sections, HEADINGS.smart);
  const data = requireSection(sections, HEADINGS.data);
  const modules = sections.filter((section) => section.link);
  const firstModule = sections.indexOf(modules[0]);
  const climate = page.images.find((image) => image.src.endsWith(CLIMATE_IMAGE));
  return {
    intro: requireSection(sections, HEADINGS.intro).section,
    standards: requireSection(sections, HEADINGS.standards).section,
    smart: smart.section,
    features: sections.slice(smart.index + 1, data.index),
    interfaces: sections.slice(data.index + 1, firstModule),
    modules,
    energy: requireSection(sections, HEADINGS.energy).section,
    documents: requireSection(sections, HEADINGS.documents).section,
    climate
  };
}

export function Ax3000MechanicalContent({ page }: { page: PageRecord }) {
  const layout = buildLayout(page);
  return (
    <div className={styles.page}>
      <section className={styles.band} aria-labelledby="mech-intro">
        <div className={`alu-container ${styles.intro}`}>
          <div>
            <h2 id="mech-intro" className={styles.title}>{layout.intro.heading}</h2>
            <p className={styles.lead}>{text(layout.intro)}</p>
          </div>
          <div className={styles.standards}>
            <h3 className={styles.itemTitle}>{layout.standards.heading}</h3>
            <div className={styles.standardsBody}>
              <ul className={styles.checklist}>
                {layout.standards.items.filter((item) => item !== LIST_BULLET).map((item) => (
                  <li key={item}>
                    <AluIcon name="check" size="sm" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {layout.climate && <img className={styles.climate} src={layout.climate.src} alt={layout.climate.alt} loading="lazy" />}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="mech-smart">
        <div className="alu-container">
          <h2 id="mech-smart" className={styles.title}>{layout.smart.heading}</h2>
          <div className={styles.smart}>
            <figure className={styles.smartMedia}>
              {layout.smart.image && <img src={layout.smart.image.src} alt={layout.smart.image.alt || layout.smart.heading} loading="lazy" />}
              <figcaption>{text(layout.smart)}</figcaption>
            </figure>
            <div className={styles.featureList}>
              {layout.features.map((feature, index) => (
                <div key={`${feature.heading}-${index}`} className={styles.feature}>
                  <h3 className={styles.itemTitle}>{feature.heading}</h3>
                  <p>{text(feature)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="mech-data">
        <div className="alu-container">
          <h2 id="mech-data" className={styles.title}>{HEADINGS.data}</h2>
          <div className={styles.tiles}>
            {layout.interfaces.map((item) => (
              <div key={item.heading} className={styles.tile}>
                <h3 className={styles.itemTitle}>{item.heading}</h3>
                <p>{text(item)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="mech-modules">
        <div className="alu-container">
          <h2 id="mech-modules" className={styles.title}>Modüller</h2>
          <div className={`${styles.tiles} ${styles.moduleTiles}`}>
            {layout.modules.map((module) => (
              <div key={module.heading} className={`${styles.tile} ${styles.module}`}>
                <h3 className={styles.itemTitle}>{module.heading}</h3>
                <p>{text(module)}</p>
                <SectionCardLink link={module.link!} heading={module.heading} />
              </div>
            ))}
          </div>
          <div className={styles.pair}>
            {[layout.energy, layout.documents].map((section) => (
              <div key={section.heading} className={`${styles.tile} ${styles.accented}`}>
                <h3 className={styles.itemTitle}>{section.heading}</h3>
                <p>{text(section)}</p>
                {section.actions && <SectionActions actions={section.actions} currentPath={page.path} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
