import type { Transition } from "framer-motion";

/** Spring for panels animated with Framer Motion (the bag drawer). */
export const MOTION: Readonly<Record<"drawer", Transition>> = Object.freeze({
  drawer: { type: "spring", stiffness: 320, damping: 34 },
});
