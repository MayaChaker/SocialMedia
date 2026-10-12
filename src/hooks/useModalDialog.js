import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Shared behaviour for modal surfaces (cart drawer, quick view, filters, mobile menu).
 * While `open` it locks page scroll, moves focus inside `containerRef`, keeps Tab
 * cycling within it, closes on Escape, and finally returns focus to the opener.
 */
export function useModalDialog(open, containerRef, onClose, initialFocusRef) {
  // Callers often pass an inline function; keep the latest one without re-running the effect.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () => [...(containerRef.current?.querySelectorAll(FOCUSABLE) ?? [])];
    const frame = requestAnimationFrame(() =>
      (initialFocusRef?.current ?? focusable()[0])?.focus(),
    );

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, [open, containerRef, initialFocusRef]);
}
