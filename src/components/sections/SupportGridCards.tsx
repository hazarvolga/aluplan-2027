import Link from 'next/link';
import { AluIcon, type AluIconName } from '@/components/ui/AluIcon';
import { DebugComponentLabel } from './DebugComponentLabel';
import styles from './ResourcesDirectory.module.css';

export type SupportCard = { title: string; description: string; cta: string; href: string; icon: string };
type Service = SupportCard;
type ActionTone = 'primary' | 'outline' | 'text';
const TONE_CLASS: Record<ActionTone, string> = {
  primary: 'alu-button alu-button--primary alu-button--md',
  outline: 'alu-button alu-button--secondary alu-button--md',
  text: 'alu-link alu-link--standalone'
};

export function ServiceAction({ service, tone }: { service: Service; tone: ActionTone }) {
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

export function BareIcon({ service }: { service: Service }) {
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

export function SupportGridCards({ services }: { services: readonly Service[] }) {
  return (
    <DebugComponentLabel name="SupportGridCards">
      <ul className={styles.tiles}>
        {services.map((service) => (
          <Tile key={service.title} service={service} />
        ))}
      </ul>
    </DebugComponentLabel>
  );
}
