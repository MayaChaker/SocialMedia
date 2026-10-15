"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../motion/gsap";
import { MOTION_QUERIES } from "../../motion/tokens";

/**
 * Scroll storytelling for the fragrance chapter.
 *
 * On wide screens with motion allowed, the chapter is "staged": it stays in view while the
 * visitor scrolls through its steps, and each step brings its own bottle forward. CSS does the
 * cross-fade; this component only says which step is active. Everywhere else the steps are
 * simply stacked, so nothing depends on this script.
 */
export default function FragranceRoomScene({
  steps,
  children,
}: {
  steps: number;
  children: ReactNode;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const stepEls = root.querySelectorAll<HTMLElement>("[data-step]");
      const setActive = (index: number) =>
        stepEls.forEach((el) => el.classList.toggle("isActive", Number(el.dataset.step) === index));

      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.wide, () => {
        root.setAttribute("data-staged", "");
        setActive(0);
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          onUpdate: ({ progress }) => setActive(Math.min(steps - 1, Math.floor(progress * steps))),
        });
        return () => {
          trigger.kill();
          root.removeAttribute("data-staged");
          stepEls.forEach((el) => el.classList.remove("isActive"));
        };
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="pgRoom" aria-labelledby="room-title">
      {children}
    </section>
  );
}
