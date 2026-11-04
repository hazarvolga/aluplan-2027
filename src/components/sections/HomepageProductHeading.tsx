import styles from './HomepageProductHeading.module.css';

export function HomepageProductHeading() {
  return <div className={styles.header}>
    <span className={styles.square} aria-hidden="true" />
    <h2 id="homepage-products-heading" className={styles.title}>Her iş akışı için doğru araç</h2>
    <span className={styles.rule} aria-hidden="true" />
  </div>;
}
