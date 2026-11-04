import { DebugComponentLabel } from './DebugComponentLabel';
import { BareIcon, ServiceAction, type SupportCard } from './SupportGridCards';
import styles from './ResourcesDirectory.module.css';

export function FeaturedSupportCards({ services }: { services: readonly SupportCard[] }) {
  if (services.length === 0) return null;
  return (
    <DebugComponentLabel name="FeaturedSupportCards">
      <ul className={styles.featuredRow}>
        {services.map((service) => (
          <li key={service.title} className={styles.featured}>
            <div className={styles.tileHead}>
              <h3 className={styles.featuredTitle}>{service.title}</h3>
              <BareIcon service={service} />
            </div>
            <p className={styles.featuredText}>{service.description}</p>
            <div className={styles.featuredAction}>
              <ServiceAction service={service} tone="primary" />
            </div>
          </li>
        ))}
      </ul>
    </DebugComponentLabel>
  );
}
