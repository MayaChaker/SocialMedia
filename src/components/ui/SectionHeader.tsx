import Link from "next/link";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  title: string;
  /** Closing words set in italic, e.g. title "New" + emphasis "in". */
  emphasis?: string;
  /** Small caps line above the title. */
  eyebrow?: string;
  /** "View all" style link on the right. */
  link?: { label: string; href: string };
  id?: string;
}

/** The heading row every section of the site starts with. */
export default function SectionHeader({ title, emphasis, eyebrow, link, id }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titles}>
        {eyebrow && <p className="text-label text-muted">{eyebrow}</p>}
        <h2 id={id}>
          {title}
          {emphasis && <em> {emphasis}</em>}
        </h2>
      </div>
      {link && (
        <Link href={link.href} className={styles.link}>
          {link.label}
        </Link>
      )}
    </header>
  );
}
