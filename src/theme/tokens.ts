import type { Transition } from "framer-motion";

export const MOTION: Readonly<Record<"page" | "drawer", Transition>> = Object.freeze({
  page: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  drawer: { type: "spring", stiffness: 320, damping: 34 },
});
