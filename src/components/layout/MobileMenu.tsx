"use client";

import Link from "next/link";
import { ExpandMore } from "@mui/icons-material";
import { NAVIGATION, menuColumns } from "../../data/navigation";
import Drawer from "../ui/Drawer";
import SearchBar from "./SearchBar";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/** The phone and tablet menu: the same items as the mega-menu, in a left drawer. */
export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left">
      <div className={styles.menu}>
        <SearchBar id="menuSearch" onSearch={onClose} />
        <nav aria-label="Main">
          <ul className={styles.items}>
            {NAVIGATION.map((item) => {
              const columns = menuColumns(item);
              if (!columns.length)
                return (
                  <li key={item.label}>
                    <Link href={item.href} className={styles.top} onClick={onClose}>
                      {item.label}
                    </Link>
                  </li>
                );
              return (
                <li key={item.label}>
                  <details className={styles.group}>
                    <summary className={styles.top}>
                      {item.label}
                      <ExpandMore aria-hidden="true" />
                    </summary>
                    {columns.map((column) => (
                      <div key={column.title} className={styles.column}>
                        <h3 className="text-h6 text-muted">{column.title}</h3>
                        <ul>
                          {column.links.map((link) => (
                            <li key={link.href}>
                              <Link href={link.href} onClick={onClose}>
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </details>
                </li>
              );
            })}
          </ul>
        </nav>
        <ul className={styles.account}>
          <li>
            <Link href="/profile" onClick={onClose}>
              Account
            </Link>
          </li>
          <li>
            <Link href="/wishlist" onClick={onClose}>
              Wishlist
            </Link>
          </li>
        </ul>
      </div>
    </Drawer>
  );
}
