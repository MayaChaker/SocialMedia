"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Close } from "@mui/icons-material";
import styles from "./Drawer.module.css";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Right for the bag and filters, left for the mobile menu. */
  side?: "left" | "right";
  /** Pinned under the scrolling content, e.g. the bag total and checkout button. */
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * A modal panel that slides in from the side. Built on <dialog>, so the browser
 * traps focus, closes on Escape, makes the page behind inert and restores focus.
 */
export default function Drawer({
  open,
  onClose,
  title,
  side = "right",
  footer,
  children,
}: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    if (!open) {
      if (dialog.open) dialog.close();
      return undefined;
    }
    if (!dialog.open) {
      // jsdom has no showModal; the attribute keeps tests able to see the content.
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`${styles.drawer} ${styles[side]}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Escape: let React state close it, so open and the DOM never disagree.
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // A click on the dialog box itself (not its content) is a click on the backdrop.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.head}>
          <h2 id={titleId} className="text-h4">
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Close aria-hidden="true" />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.foot}>{footer}</footer>}
      </div>
    </dialog>
  );
}
