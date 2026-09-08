import Link from "next/link";
import styles from "./service-breadcrumbs.module.css";

export function ServiceBreadcrumbs({ items }) {
  return (
    <nav aria-label="Brödsmulor" className={styles.breadcrumbs}>
      <ol>
        {items.map((item, index) => <li key={item.href}>
          {index === items.length - 1
            ? <span aria-current="page">{item.name}</span>
            : <Link href={item.href}>{item.name}</Link>}
        </li>)}
      </ol>
    </nav>
  );
}
