import { DebugComponentLabel } from './DebugComponentLabel';
import { AluIcon } from '@/components/ui/AluIcon';
import { educationPartners } from '@/data/education-partners';
import type { EducationCenter, EducationUniversity } from '@/data/education-partners';
import { CompactPageHero } from './CompactPageHero';
import styles from './EducationPartners.module.css';

const { title, intro, universitiesTitle, centersTitle, universities, centers } = educationPartners;

function University({ university }: { university: EducationUniversity }) {
  return (
    <li className={styles.tile}>
      <div className={styles.tileHead}>
        <h3 className={styles.itemTitle}>{university.name}</h3>
        <span className={styles.bareIcon} aria-hidden="true"><AluIcon name="graduation-cap" size="md" /></span>
      </div>
      {university.programs.length > 0 && (
        <ul className={styles.programs}>
          {university.programs.map((program) => (
            <li key={program}>{program}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Center({ center }: { center: EducationCenter }) {
  return (
    <li className={`${styles.tile} ${styles.center}`}>
      <div className={styles.tileHead}>
        <h3 className={styles.itemTitle}>{center.name}</h3>
        <span className={styles.bareIcon} aria-hidden="true"><AluIcon name="map-pin" size="md" /></span>
      </div>
      {center.people.map((person) => (
        <p key={person.name} className={styles.person}>
          <strong>{person.name}</strong>
          <span>{person.title}</span>
        </p>
      ))}
      <p className={styles.text}>
        {center.lines.map((line) => (
          <span key={line} className={styles.line}>{line}</span>
        ))}
      </p>
      <ul className={styles.contacts}>
        {center.contacts.map((contact) => (
          <li key={contact.label}>
            {contact.href ? <a className="alu-link" href={contact.href}>{contact.label}</a> : contact.label}
          </li>
        ))}
      </ul>
    </li>
  );
}

export function EducationPartners() {
  return (
    <div className={styles.page}>
      <DebugComponentLabel name="CompactPageHero"><CompactPageHero
        title={title}
        lead={intro}
      /></DebugComponentLabel>
      <div>
        <DebugComponentLabel name="universities (özel)"><section className={styles.band} aria-labelledby="egitim-universiteler">
          <div className="alu-container">
            <h2 id="egitim-universiteler" className={styles.groupTitle}>{universitiesTitle}</h2>
            <ul className={styles.tiles}>
              {universities.map((university) => (
                <University key={university.name} university={university} />
              ))}
            </ul>
          </div>
        </section></DebugComponentLabel>
        <DebugComponentLabel name="educationCenters (özel)"><section className={`${styles.band} ${styles.lastBand}`} aria-labelledby="egitim-merkezleri">
          <div className="alu-container">
            <h2 id="egitim-merkezleri" className={styles.groupTitle}>{centersTitle}</h2>
            <ul className={styles.tiles}>
              {centers.map((center) => (
                <Center key={center.name} center={center} />
              ))}
            </ul>
          </div>
        </section></DebugComponentLabel>
      </div>
    </div>
  );
}
