import { useId } from 'react';
import styles from './CustomerTestimonials.module.css';

type Testimonial = { quote: string; name: string; role?: string; source?: string; action?: { href: string; label: string } };
export function CustomerTestimonials({ title, items }: { title: string; items: readonly Testimonial[] }) {
  const headingId = useId();
  return <section className={styles.testimonials} aria-labelledby={headingId}>
    <div className="alu-container">
      <div className={styles.testimonialsHeader}><h2 id={headingId}>{title}</h2></div>
      <div className={styles.testimonialsGrid}>{items.map((item, index) => <figure className={styles.testimonial} key={`${index}-${item.name}`}>
        <blockquote className={styles.testimonialQuote}>“{item.quote}”</blockquote>
        <figcaption className={styles.testimonialAuthor}><strong>{item.name}</strong>{item.role && <span>{item.role}</span>}{item.source && <small>{item.source}</small>}{item.action && <a href={item.action.href}>{item.action.label}</a>}</figcaption>
      </figure>)}</div>
    </div>
  </section>;
}
