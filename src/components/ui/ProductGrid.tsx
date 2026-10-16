import type { ReactNode } from "react";
import styles from "./ProductGrid.module.css";

/**
 * The product grid of every listing: 2 columns on phones, 3 on tablets, 4 on
 * desktop. Columns follow the grid's own width, so it also fits beside a sidebar.
 */
export default function ProductGrid({
  children,
  maxColumns = 4,
}: {
  children: ReactNode;
  /** Three columns at most, e.g. beside a sidebar where four would make small cards. */
  maxColumns?: 3 | 4;
}) {
  return (
    <div className={styles.frame}>
      <ul className={maxColumns === 3 ? `${styles.grid} ${styles.max3}` : styles.grid}>
        {children}
      </ul>
    </div>
  );
}

/** One cell of the grid. */
export function ProductGridItem({ children }: { children: ReactNode }) {
  return <li className={styles.item}>{children}</li>;
}
