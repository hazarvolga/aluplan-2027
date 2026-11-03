'use client';
import { useId, useState } from 'react';
import styles from './ProjectCarousel.module.css';

type Project = { title: string; location: string; href: string; image: string; alt: string };
export function ProjectCarousel({ id, eyebrow, title, projects }: { id?: string; eyebrow: string; title: string; projects: readonly Project[] }) {
  const [selected, setSelected] = useState(0);
  const headingId = useId();
  if (!projects.length) return null;
  const index = selected < projects.length ? selected : 0;
  const project = projects[index];
  const move = (step: number) => setSelected((index + step + projects.length) % projects.length);
  return <section id={id} className={styles.section} aria-labelledby={headingId} aria-roledescription="proje galerisi">
    <div className={`alu-container ${styles.header}`}><div><p className={styles.eyebrow}>{eyebrow}</p><h2 id={headingId}>{title}</h2></div><div className={styles.controls}><button type="button" onClick={() => move(-1)} aria-label="Önceki proje">←</button><button type="button" onClick={() => move(1)} aria-label="Sonraki proje">→</button></div></div>
    <div className="alu-container"><div className={styles.slide} role="group" aria-roledescription="proje" aria-label={`${index + 1} / ${projects.length}`}>
      {projects.map((item, i) => <img key={item.image} className={`${styles.image} ${i === index ? styles.imageActive : ''}`} src={item.image} alt={i === index ? item.alt : ''} aria-hidden={i !== index} width={1536} height={864} loading="lazy" />)}
      <div className={`alu-container ${styles.overlay}`}><div className={styles.card}><p className={styles.count} aria-live="polite">{index + 1} / {projects.length}</p><h3>{project.title}</h3><p>{project.location}</p><a href={project.href}>Projeyi inceleyin ↗</a></div></div>
    </div>
    </div>
    <div className={`alu-container ${styles.dots}`} aria-label="Proje seçimi">{projects.map((item, i) => <button type="button" key={item.title} aria-label={`${item.title} projesini göster`} aria-current={i === index ? 'true' : undefined} onClick={() => setSelected(i)}><span /></button>)}</div>
  </section>;
}
