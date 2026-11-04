import { DebugComponentLabel } from './DebugComponentLabel';
import { getHomepageData } from '@/lib/site-shared';
import { CompactPageHero } from './CompactPageHero';
import styles from './ResourcesDirectory.module.css';
import { SupportGridCards } from './SupportGridCards';
import { FeaturedSupportCards } from './FeaturedSupportCards';
import { SectionHeader } from './SectionHeader';

type Service = ReturnType<typeof getHomepageData>['services'][number];
type GroupLayout = 'support' | 'grid';

const HIDDEN_GROUP = 'Partner erişimi';
const PAGE_TITLE = 'Öğrenme, Teknik Destek ve Lisans Kaynakları';
const PAGE_KICKER = 'PROFESYONEL HİZMETLER VE DESTEK MERKEZİ';
const GROUP_LAYOUTS: Record<string, GroupLayout> = {
  'Öğren ve yardım al': 'support'
};
const FEATURED_SERVICES = ['Teknik Destek', 'Destek Platformu', 'ALLPLAN FAQ', 'Sistem Gereksinimleri', 'Connect: Giriş', 'Deklarasyon Formu'];

const data = getHomepageData();
const servicesByTitle = new Map<string, Service>(data.services.map((service) => [service.title, service]));
const groups = data.serviceGroups
  .filter((group) => group.title !== HIDDEN_GROUP)
  .map((group, index) => ({
    id: `kaynak-grubu-${index + 1}`,
    title: group.title,
    layout: GROUP_LAYOUTS[group.title] ?? ('grid' as GroupLayout),
    services: group.serviceTitles.map((title) => {
      const service = servicesByTitle.get(title);
      if (!service) throw new Error(`ResourcesDirectory: service "${title}" is missing from the homepage data`);
      return service;
    })
  }));
const totalServices = groups.reduce((sum, group) => sum + group.services.length, 0);

export function ResourcesDirectory() {
  return (
    <div className={styles.page}>
      <DebugComponentLabel name="CompactPageHero"><CompactPageHero
        kicker={PAGE_KICKER}
        title={PAGE_TITLE}
        lead={`Eğitim, Microsoft Teams canlı bağlantı ve allplan.net.tr/tr ticket platformu dahil ${totalServices} profesyonel hizmet ve teknik kaynağa tek merkezden ulaşın.`}
      >
        <nav className={styles.chips} aria-label="Kaynak kategorileri">
          {groups.map((group) => (
            <a key={group.id} className={styles.chip} href={`#${group.id}`}>
              <span>{group.title}</span>
              <span className={styles.count}>{group.services.length}</span>
            </a>
          ))}
        </nav>
      </CompactPageHero></DebugComponentLabel>
      <div>
        {groups.map((group, index) => (
          <DebugComponentLabel key={group.id} name={`resourcesGroup: ${group.layout} (özel)`}><section id={group.id} className={`${styles.band} ${index === groups.length - 1 ? styles.lastBand : ''}`} aria-labelledby={`${group.id}-title`}>
            <div className="alu-container">
              <div className={styles.groupTitle}><SectionHeader id={`${group.id}-title`} title={group.title} /></div>
              <FeaturedSupportCards services={group.services.filter(service => FEATURED_SERVICES.includes(service.title))} />
              <SupportGridCards services={group.services.filter(service => !FEATURED_SERVICES.includes(service.title))} />
            </div>
          </section></DebugComponentLabel>
        ))}
      </div>
    </div>
  );
}
