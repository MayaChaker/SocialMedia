"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { curtainReveal, drawRibbon, fadeUp, parallax, revealLines } from "../../motion/timelines";
import { imageReady } from "../../motion/imageReady";
import { MOTION_QUERIES } from "../../motion/tokens";

/**
 * The homepage opening sequence. The markup is server-rendered and passed in as children;
 * this component only finds the [data-hero] parts and plays them in order:
 * headline lines → portrait curtain → product inset → shade ribbon → copy and actions.
 * A curtain opens only once its photograph is decoded, so it never uncovers an empty frame.
 * Afterwards the two images drift at different depths while the hero scrolls away.
 */
export default function HeroScene({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = scope.current;
      if (!root || !contextSafe) return;
      const q = gsap.utils.selector(root);
      const frames = [
        { el: root.querySelector('[data-hero="portrait"]'), at: 0.25 },
        { el: root.querySelector('[data-hero="inset"]'), at: 0.8 },
      ];

      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.full, () => {
        const start = performance.now();
        gsap
          .timeline()
          .add(revealLines(q('[data-hero="line"]')), 0)
          .add(fadeUp(q('[data-hero="meta"]')), 0.1)
          .add(drawRibbon(q('[data-hero="bar"]')), 0.95)
          .add(fadeUp(q('[data-hero="foot"]')), 1.05);

        frames.forEach(({ el, at }) => {
          if (!el) return;
          gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 1 });
          const open = contextSafe(() => {
            // Keep the planned rhythm when the image is already there; open at once if late.
            const elapsed = (performance.now() - start) / 1000;
            curtainReveal(el, { delay: Math.max(0, at - elapsed) });
          });
          imageReady(el.querySelector("img")).then(open);
          parallax(el, root, el === frames[0]?.el ? 0.06 : -0.08);
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="pgHeroScene">
      {children}
    </div>
  );
}
