"use client";

import { gsap } from "./gsap";
import { DURATION, EASE, PARALLAX_LIMIT, STAGGER } from "./tokens";

type Targets = gsap.TweenTarget;

/**
 * The reusable motion patterns. Each adds tweens to a timeline (or returns a tween) and
 * always animates transform, opacity or clip-path, never layout properties.
 */

/** Lines rise out of their masks (`.lineMask > .line`). For headlines, never body copy. */
export function revealLines(targets: Targets, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    targets,
    { yPercent: 112, autoAlpha: 0 },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: DURATION.slow,
      ease: EASE.out,
      stagger: STAGGER.lines,
      ...vars,
    },
  );
}

/**
 * An image is uncovered like a curtain rising, while the photograph inside settles from a
 * slight zoom. Use for one or two key images per view, not for every thumbnail.
 */
export function curtainReveal(frame: Element, vars: gsap.TimelineVars = {}) {
  const image = frame.querySelector("img");
  const tl = gsap.timeline(vars);
  tl.fromTo(
    frame,
    { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 1 },
    { clipPath: "inset(0% 0% 0% 0%)", duration: DURATION.cinematic, ease: EASE.curtain },
  );
  if (image) {
    tl.fromTo(
      image,
      { scale: 1.14 },
      { scale: 1, duration: DURATION.cinematic + 0.4, ease: EASE.out },
      0,
    );
  }
  return tl;
}

/** Shade bars grow from the baseline one after another. */
export function drawRibbon(bars: Targets, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    bars,
    { scaleY: 0, transformOrigin: "50% 100%" },
    {
      scaleY: 1,
      duration: DURATION.base,
      ease: EASE.out,
      stagger: STAGGER.swatches,
      ...vars,
    },
  );
}

/** Small supporting elements (buttons, captions) fade up into place. */
export function fadeUp(targets: Targets, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    targets,
    { y: 14, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: DURATION.base,
      ease: EASE.out,
      stagger: STAGGER.items,
      ...vars,
    },
  );
}

/**
 * Scroll-linked depth: the element drifts by `depth` (a fraction of its height, capped at
 * PARALLAX_LIMIT) while `trigger` crosses the viewport.
 */
export function parallax(target: Element, trigger: Element, depth = PARALLAX_LIMIT) {
  const amount = Math.max(-PARALLAX_LIMIT, Math.min(PARALLAX_LIMIT, depth)) * 100;
  return gsap.fromTo(
    target,
    { yPercent: -amount / 2 },
    {
      yPercent: amount / 2,
      ease: EASE.scroll,
      scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}
