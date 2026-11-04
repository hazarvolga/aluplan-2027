import Link from 'next/link';
import styles from './PageBreadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  if (items.length < 2) return null;

  return (
    <nav className={styles.breadcrumb} aria-label="Sayfa yolu">
      <div className="alu-container">
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li key={item.label} className={styles.item}>
              {index > 0 && <span className={styles.separator} aria-hidden="true">/</span>}
              {item.href
                ? <Link href={item.href} className={styles.link}>{item.label}</Link>
                : <span aria-current="page" className={styles.current}>{item.label}</span>
              }
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
