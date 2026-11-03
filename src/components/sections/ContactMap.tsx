import styles from './ContactMap.module.css';
import { ConsentEmbed } from '@/components/ui/ConsentEmbed';

export function ContactMap({ src, title }: { src: string; title: string }) {
  return (
    <section className={styles.map} aria-labelledby="contact-map-heading">
      <span className="preview-kicker">KONUM</span>
      <h2 id="contact-map-heading" className="alu-h2">Bize ulaşın</h2>
      <ConsentEmbed src={src} title={title} />
    </section>
  );
}
