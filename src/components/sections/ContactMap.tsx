import styles from './ContactMap.module.css';

export function ContactMap({ src, title }: { src: string; title: string }) {
  return (
    <section className={styles.map} aria-labelledby="contact-map-heading">
      <span className="preview-kicker">KONUM</span>
      <h2 id="contact-map-heading" className="alu-h2">Bize ulaşın</h2>
      <iframe src={src} title={title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    </section>
  );
}
