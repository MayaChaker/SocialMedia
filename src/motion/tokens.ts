/**
 * Motion tokens for GSAP timelines (seconds and GSAP ease names).
 * CSS transitions use the matching custom properties in src/styles/tokens.css,
 * so a hover and a scroll reveal share one rhythm. See docs/motion.md.
 */

export const DURATION = {
  /** Feedback that must feel immediate: a counter tick, a pressed state. */
  instant: 0.12,
  /** Hovers and small state changes. */
  quick: 0.24,
  /** UI transitions: drawers, shade changes, cross-fades. */
  base: 0.48,
  /** Content reveals as they enter the viewport. */
  slow: 0.9,
  /** The single orchestrated moment: the homepage opening. */
  cinematic: 1.3,
} as const;

export const EASE = {
  /** Entrances: fast start, long soft landing. */
  out: "expo.out",
  /** Masks and curtains that open and close symmetrically. */
  curtain: "power4.inOut",
  /** Small UI movement. */
  standard: "power2.out",
  /** Scroll-linked motion follows the scroll exactly. */
  scroll: "none",
} as const;

export const STAGGER = {
  /** Between lines of a headline. */
  lines: 0.09,
  /** Between items in a short list. */
  items: 0.06,
  /** Between shade swatches in a ribbon. */
  swatches: 0.018,
} as const;

/** Parallax never moves an element more than this fraction of its own height. */
export const PARALLAX_LIMIT = 0.08;

/** Media queries used with gsap.matchMedia to pick a motion variant. */
export const MOTION_QUERIES = {
  full: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  /** Scroll-pinned storytelling only runs where there is room for it. */
  wide: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
} as const;
