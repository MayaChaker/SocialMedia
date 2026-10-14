"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";
import { revealLines } from "./timelines";
import { MOTION_QUERIES } from "./tokens";

interface RevealHeadingProps {
  /** One entry per visual line; lines are authored, not measured, so they never re-split. */
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
}

/**
 * A section headline whose lines rise from their masks as it scrolls into view.
 * Use for section titles only; body copy and UI labels never animate this way.
 */
export default function RevealHeading({
  lines,
  as: Tag = "h2",
  id,
  className,
}: RevealHeadingProps) {
  const scope = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.full, () => {
        revealLines(scope.current?.querySelectorAll(".line") ?? [], {
          scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <Tag ref={scope} id={id} className={className}>
      {lines.map((line, index) => (
        <span className="lineMask" key={index}>
          <span className="line" data-reveal>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
