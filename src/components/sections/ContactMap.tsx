import styles from './ContactMap.module.css';
import { ConsentEmbed } from '@/components/ui/ConsentEmbed';
import { SectionHeader } from './SectionHeader';

export function ContactMap({ src, title }: { src: string; title: string }) {
  return (
    <section className={styles.map} aria-labelledby="contact-map-heading">
      <SectionHeader kicker="KONUM" title="Bize ulaşın" id="contact-map-heading" />
      <ConsentEmbed src={src} title={title} />
    </section>
  );
}
