import Link from 'next/link';
import { getHomepageData } from '@/lib/site-shared';
import { AluIcon } from '@/components/ui/AluIcon';
import type { AluIconName } from '@/components/ui/AluIcon';
import { CompactPageHero } from './CompactPageHero';
import styles from './ResourcesDirectory.module.css';

type Service = ReturnType<typeof getHomepageData>['services'][number];
type GroupLayout = 'support' | 'list' | 'grid';
type ActionTone = 'primary' | 'outline' | 'text';

const HIDDEN_GROUP = 'Partner erişimi';
const PAGE_TITLE = 'Öğrenme, Teknik Destek ve Lisans Kaynakları';
const PAGE_KICKER = 'PROFESYONEL HİZMETLER VE DESTEK MERKEZİ';
const GROUP_LAYOUTS: Record<string, GroupLayout> = {
  'Öğren ve yardım al': 'support',
  'Yazılım ve lisans işlemleri': 'list'
};
const FEATURED_SERVICES = new Set(['Teknik Destek', 'Destek Platformu']);
const TONE_CLASS: Record<ActionTone, string> = {
  primary: 'alu-button alu-button--primary alu-button--md',
  outline: 'alu-button alu-button--secondary alu-button--md',
  text: 'alu-link alu-link--standalone'
};

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

function ServiceAction({ service, tone }: { service: Service; tone: ActionTone }) {
  const className = TONE_CLASS[tone];
  const label = `${service.cta}: ${service.title}`;
  if (service.href.startsWith('http')) {
    return (
      <a className={className} href={service.href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (yeni sekmede açılır)`}>
        <span>{service.cta}</span>
        <AluIcon name="external-link" size="sm" />
      </a>
    );
  }
  if (service.href.startsWith('/docs/')) {
    return (
      <a className={className} href={service.href} aria-label={label}>
        <span>{service.cta}</span>
        <AluIcon name="download" size="sm" />
      </a>
    );
  }
  return (
    <Link className={className} href={service.href} aria-label={label}>
      <span>{service.cta}</span>
      <AluIcon name="arrow-right" size="sm" />
    </Link>
  );
}

function BareIcon({ service }: { service: Service }) {
  return (
    <span className={styles.bareIcon} aria-hidden="true">
      <AluIcon name={service.icon as AluIconName} size="md" />
    </span>
  );
}

function Tile({ service }: { service: Service }) {
  return (
    <li className={styles.tile}>
      <div className={styles.tileHead}>
        <h3 className={styles.itemTitle}>{service.title}</h3>
        <BareIcon service={service} />
      </div>
      <p className={styles.text}>{service.description}</p>
      <div className={styles.tileAction}>
        <ServiceAction service={service} tone="text" />
      </div>
    </li>
  );
}

function SupportGroup({ services }: { services: Service[] }) {
  return (
    <>
      <ul className={styles.featuredRow}>
        {services.filter((service) => FEATURED_SERVICES.has(service.title)).map((service) => (
          <li key={service.title} className={styles.featured}>
            <div className={styles.tileHead}>
              <h3 className={styles.featuredTitle}>{service.title}</h3>
              <BareIcon service={service} />
            </div>
            <p className={styles.featuredText}>{service.description}</p>
            <div className={styles.tileAction}>
              <ServiceAction service={service} tone="primary" />
            </div>
          </li>
        ))}
      </ul>
      <ul className={styles.tiles}>
        {services.filter((service) => !FEATURED_SERVICES.has(service.title)).map((service) => (
          <Tile key={service.title} service={service} />
        ))}
      </ul>
    </>
  );
}

function ListGroup({ services }: { services: Service[] }) {
  return (
    <ul className={styles.rows}>
      {services.map((service) => (
        <li key={service.title} className={styles.row}>
          <BareIcon service={service} />
          <div className={styles.rowText}>
            <h3 className={styles.itemTitle}>{service.title}</h3>
            <p className={styles.text}>{service.description}</p>
          </div>
          <div className={styles.rowAction}>
            <ServiceAction service={service} tone="outline" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function GridGroup({ services }: { services: Service[] }) {
  return (
    <ul className={styles.tiles}>
      {services.map((service) => (
        <Tile key={service.title} service={service} />
      ))}
    </ul>
  );
}

export function ResourcesDirectory() {
  return (
    <div className={styles.page}>
      <CompactPageHero
        crumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Kaynaklar' }]}
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
      </CompactPageHero>
      <div>
        {groups.map((group) => (
          <section key={group.id} id={group.id} className={styles.band} aria-labelledby={`${group.id}-title`}>
            <div className="alu-container">
              <h2 id={`${group.id}-title`} className={styles.groupTitle}>{group.title}</h2>
              {group.layout === 'support' && <SupportGroup services={group.services} />}
              {group.layout === 'list' && <ListGroup services={group.services} />}
              {group.layout === 'grid' && <GridGroup services={group.services} />}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
