import Link from "next/link";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  title: string;
  /** Small caps line above the title. */
  eyebrow?: string;
  /** "View all" style link on the right. */
  link?: { label: string; href: string };
  id?: string;
}

/** The heading row every section of the site starts with. */
export default function SectionHeader({ title, eyebrow, link, id }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titles}>
        {eyebrow && <p className="text-h6 text-muted">{eyebrow}</p>}
        <h2 id={id}>{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className={styles.link}>
          {link.label}
        </Link>
      )}
    </header>
  );
}
