import Link from "next/link";
import { FOOTER_COLUMNS, LEGAL_LINKS, PAYMENT_METHODS, SOCIAL_LINKS } from "../../data/site";
import type { MenuColumn } from "../../data/navigation";
import Newsletter from "./Newsletter";
import styles from "./Footer.module.css";

function Column({ column }: { column: MenuColumn }) {
  return (
    <div>
      <h2 className="text-h6">{column.title}</h2>
      <ul className={styles.links}>
        {column.links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("mailto:") ? (
              <a href={link.href}>{link.label}</a>
            ) : (
              <Link href={link.href}>{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const columns = SOCIAL_LINKS.length
    ? [...FOOTER_COLUMNS, { title: "Socials", links: [...SOCIAL_LINKS] }]
    : FOOTER_COLUMNS;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <Newsletter />
        <div className={styles.columns}>
          {columns.map((column) => (
            <Column key={column.title} column={column} />
          ))}
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p className="text-caption text-muted">
          Veloura is a fictional store, a portfolio project by Maya Chaker. It is not affiliated
          with the brands shown, and no real orders or payments are processed. Photography from
          Unsplash.
        </p>
        {PAYMENT_METHODS.length > 0 && (
          <ul className={styles.payments} aria-label="Payment methods">
            {PAYMENT_METHODS.map((method) => (
              <li key={method}>{method}</li>
            ))}
          </ul>
        )}
        <ul className={styles.legal}>
          {LEGAL_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
