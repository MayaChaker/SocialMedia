"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { MenuColumn } from "../../data/navigation";
import styles from "./Footer.module.css";

const DESKTOP = "(min-width: 768px)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * A footer link column. On phones it is a closed accordion so the footer stays short;
 * from tablet width it is always open. The server renders it open, so links are in the HTML.
 */
export default function FooterColumn({ column }: { column: MenuColumn }) {
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
  const [openOnPhone, setOpenOnPhone] = useState(false);

  return (
    <details
      className={styles.column}
      open={wide || openOnPhone}
      onToggle={(event) => {
        if (!wide) setOpenOnPhone(event.currentTarget.open);
      }}
    >
      <summary className="text-label">{column.title}</summary>
      <ul>
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
    </details>
  );
}
