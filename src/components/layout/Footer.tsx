import Link from "next/link";
import { FOOTER_COLUMNS, LEGAL_LINKS, PAYMENT_METHODS, SOCIAL_LINKS } from "../../data/site";
import FooterColumn from "./FooterColumn";
import Newsletter from "./Newsletter";
import styles from "./Footer.module.css";

export default function Footer() {
  const columns = SOCIAL_LINKS.length
    ? [...FOOTER_COLUMNS, { title: "Follow", links: [...SOCIAL_LINKS] }]
    : FOOTER_COLUMNS;

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Newsletter />
        <div className={styles.columns}>
          {columns.map((column) => (
            <FooterColumn key={column.title} column={column} />
          ))}
        </div>
      </div>
      <p className={styles.mark} aria-hidden="true">
        VELOURA
      </p>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Veloura. All rights reserved.</p>
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
