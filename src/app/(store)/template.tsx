"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { MOTION } from "../../theme/tokens";

// Templates re-mount on navigation, which gives each page a short fade-in.
export default function StoreTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={MOTION.page}>
      {children}
    </motion.div>
  );
}
