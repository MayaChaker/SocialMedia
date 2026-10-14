"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import RevealHeading from "../../../motion/RevealHeading";
import RoutinePreview from "./RoutinePreview";
import ShadeFinder from "./ShadeFinder";

const TOOLS = [
  { id: "shade", label: "Find your shade", Panel: ShadeFinder },
  { id: "routine", label: "Build a routine", Panel: RoutinePreview },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

// Everything listed here exists on the site today.
const SERVICES = [
  ["Shade match", "Three questions to a foundation shade"],
  ["Routine builder", "Two to four steps for your skin"],
  ["Beauty profile", "Shades, routines and wishlist, saved on this device"],
  ["Delivery", "Complimentary from $75"],
] as const;

/**
 * The consultation: Veloura's two advice tools, working inline on the homepage.
 * Tabs follow the WAI-ARIA pattern (arrow keys move between them).
 */
export default function Consultation() {
  const [active, setActive] = useState<ToolId>("shade");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const current = TOOLS.find((tool) => tool.id === active) ?? TOOLS[0];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const index = TOOLS.findIndex((tool) => tool.id === active);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = TOOLS[(index + step + TOOLS.length) % TOOLS.length];
    if (!next) return;
    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <section className="pgConsult" aria-labelledby="consult-title">
      <div className="pgConsultInner">
        <header className="pgConsultHead">
          <p className="pgEyebrow">Chapter 03 · The consultation</p>
          <RevealHeading
            id="consult-title"
            className="pgConsultTitle"
            lines={["Advice,", <em key="em">before you buy.</em>]}
          />
          <p className="pgConsultIntro">
            Two of the tools behind Veloura, working right here. Change an answer and the suggestion
            follows.
          </p>
        </header>

        <div
          className="pgTabs"
          role="tablist"
          aria-label="Consultation tools"
          onKeyDown={onKeyDown}
        >
          {TOOLS.map((tool, index) => (
            <button
              key={tool.id}
              ref={(node) => {
                tabRefs.current[tool.id] = node;
              }}
              id={`tab-${tool.id}`}
              role="tab"
              aria-selected={tool.id === active}
              aria-controls={`panel-${tool.id}`}
              tabIndex={tool.id === active ? 0 : -1}
              className="pgTab"
              onClick={() => setActive(tool.id)}
            >
              <span className="pgTabIndex">0{index + 1}</span>
              {tool.label}
            </button>
          ))}
        </div>

        <div
          id={`panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${current.id}`}
          className="pgTabPanel"
          key={current.id}
        >
          <current.Panel />
        </div>

        <ul className="pgServices" aria-label="Services">
          {SERVICES.map(([title, copy]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{copy}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
