"use client";

import { useEffect } from "react";

/**
 * Marks the document once React has hydrated. Animated components set their own start
 * states in layout effects before this runs, so CSS can stop hiding [data-reveal] content.
 */
export default function MotionReady() {
  useEffect(() => {
    document.documentElement.setAttribute("data-motion-ready", "");
  }, []);
  return null;
}
