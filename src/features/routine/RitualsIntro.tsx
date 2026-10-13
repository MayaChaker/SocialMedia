import {
  ArrowForward,
  AutoAwesomeOutlined,
  Loop,
  Tune,
  type SvgIconComponent,
} from "@mui/icons-material";

const PRINCIPLES: Array<[SvgIconComponent, string, string]> = [
  [AutoAwesomeOutlined, "Personal", "Selected around your skin concerns."],
  [Tune, "Concise", "Only the steps your skin needs."],
  [Loop, "Flexible", "Easy to adjust as your routine changes."],
];

/** Landing screen of the routine builder. */
export default function RitualsIntro({ onStart }: { onStart: () => void }) {
  return (
    <main className="contentPage ritualsPage">
      <section className="contentHero ritualsHero">
        <span className="kicker">Routine Builder</span>
        <h1>
          Your ritual,
          <br />
          <em>beautifully simple.</em>
        </h1>
        <p>
          Answer 3 quick questions and discover a routine selected for your skin concerns, texture
          preferences, and available time.
        </p>
        <button className="button dark" onClick={onStart}>
          Build My Routine — 3 Questions <ArrowForward aria-hidden="true" />
        </button>
      </section>
      <section className="ritualPrinciples" aria-label="Why build a Veloura routine">
        {PRINCIPLES.map(([Icon, title, copy], index) => (
          <article key={title}>
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden="true" />
            </div>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
