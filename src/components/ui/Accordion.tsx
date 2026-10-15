import type { ReactNode } from "react";
import { Add } from "@mui/icons-material";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

/** Native <details> sections: keyboard and screen-reader support come from the browser. */
export default function Accordion({
  items,
  defaultOpen,
}: {
  items: AccordionItem[];
  /** Id of the item open on first render. */
  defaultOpen?: string;
}) {
  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <details key={item.id} className={styles.item} open={item.id === defaultOpen}>
          <summary className={styles.summary}>
            <span>{item.title}</span>
            <Add className={styles.icon} aria-hidden="true" />
          </summary>
          <div className={styles.content}>{item.content}</div>
        </details>
      ))}
    </div>
  );
}
