"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION, menuColumns } from "../../data/navigation";
import styles from "./MegaMenu.module.css";

const isCurrent = (pathname: string, href: string) => {
  const path = href.split("?")[0] ?? href;
  return pathname === path || pathname.startsWith(`${path}/`);
};

/** Leave the panel after choosing a link, so it does not stay open on the next page. */
const releaseFocus = () => (document.activeElement as HTMLElement | null)?.blur();

/**
 * Desktop navigation. Hovering or focusing an item opens its panel of subcategories
 * and featured brands; items without a panel (New) are plain links.
 */
export default function MegaMenu() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="Main">
      <ul className={styles.items}>
        {NAVIGATION.map((item) => {
          const columns = menuColumns(item);
          const current = isCurrent(pathname, item.href);
          return (
            <li key={item.label} className={styles.item}>
              <Link
                href={item.href}
                className={styles.top}
                aria-current={current ? "page" : undefined}
                onClick={releaseFocus}
              >
                {item.label}
              </Link>
              {columns.length > 0 && (
                <div className={styles.panel}>
                  <div className={`container ${styles.columns}`}>
                    {columns.map((column) => (
                      <div key={column.title}>
                        <h2 className="text-h6 text-muted">{column.title}</h2>
                        <ul>
                          {column.links.map((link) => (
                            <li key={link.href}>
                              <Link href={link.href} onClick={releaseFocus}>
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
