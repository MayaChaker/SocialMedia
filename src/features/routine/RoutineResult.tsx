import type { RefObject } from "react";
import Link from "next/link";
import { Check } from "@mui/icons-material";
import { money } from "../../lib/money";
import type { RoutineAnswers } from "./routineRecommendations";
import { routineAlternatives, routineTitle } from "./routineRecommendations";
import { TIME_LABELS } from "./routineQuestions";
import RoutineProductCard from "./RoutineProductCard";
import type { RoutineBuilder } from "./useRoutineBuilder";

interface RoutineResultProps {
  routine: RoutineBuilder;
  result: RoutineAnswers;
  headingRef: RefObject<HTMLHeadingElement | null>;
}

/** The recommended routine: summary and actions on the left, products on the right. */
export default function RoutineResult({ routine, result, headingRef }: RoutineResultProps) {
  const { recommendations, availableRecommendations, saved } = routine;
  const timeLabel = TIME_LABELS[result.time];

  return (
    <main className="routineResultPage">
      <div className="routineResultLayout">
        <section className="routineResultIntro">
          <span className="kicker">Your routine</span>
          <h1 ref={headingRef} tabIndex={-1}>
            {routineTitle(result)}
          </h1>
          <p>
            Selected for <strong>{result.goal.toLowerCase()}</strong>, your preference for{" "}
            <strong>{result.texture.toLowerCase()}</strong> textures, and a{" "}
            <strong>{timeLabel.toLowerCase()}</strong>.
          </p>
          <div className="routinePreferences">
            <div className="routinePreferencesTitle">
              <h2>Your preferences</h2>
              <button type="button" onClick={routine.editAnswers}>
                Edit answers
              </button>
            </div>
            <dl>
              <div>
                <dt>Concern</dt>
                <dd>{result.goal}</dd>
              </div>
              <div>
                <dt>Texture</dt>
                <dd>{result.texture}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{timeLabel}</dd>
              </div>
            </dl>
          </div>
          <ol className="resultOrder" aria-label="Recommended routine order">
            {recommendations.map(({ product, step }, index) => (
              <li key={`${index}-${product.id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{step}</strong>
                  <small>{product.name}</small>
                </div>
              </li>
            ))}
          </ol>
          <div className="routinePrimaryActions">
            <button
              className="button dark"
              disabled={!availableRecommendations.length}
              onClick={routine.addRoutine}
            >
              {routine.fullStatus === "added"
                ? "Added"
                : `Add the full routine · ${money(routine.routineTotal)}`}
            </button>
            <button
              className={`saveRitualButton ${saved ? "saved" : ""}`}
              onClick={routine.saveRoutine}
              aria-pressed={saved}
            >
              {saved && <Check aria-hidden="true" />}
              {saved ? "Routine Saved" : "Save Routine"}
            </button>
            <button className="button outline routineEditButton" onClick={routine.editAnswers}>
              Edit answers
            </button>
          </div>
          <p className="saveRitualStatus" role="status" aria-live="polite">
            {routine.saveStatus ||
              "Save this routine to revisit it in Beauty Profile on this browser."}
          </p>
          {availableRecommendations.length < recommendations.length && (
            <p className="routineAvailabilityNote">
              Unavailable items are excluded from the full-routine total and action.
            </p>
          )}
          <div className="routineSecondaryActions">
            <Link className="textLink" href="/shop">
              Explore all products
            </Link>
            <button className="textLink" onClick={routine.startAgain}>
              {routine.confirmReset ? "Confirm start again" : "Start again"}
            </button>
          </div>
          {routine.confirmReset && (
            <p className="resetNotice" role="status">
              Starting again will clear these unsaved answers. Select “Confirm start again” to
              continue.
            </p>
          )}
        </section>

        <section className="routineRecommendations" aria-label="Your recommended products">
          {recommendations.map((item, index) => (
            <RoutineProductCard
              key={`${index}-${item.product.id}`}
              item={item}
              index={index}
              alternatives={routineAlternatives(item.product, recommendations)}
              added={routine.addStatus[item.product.id] === "added"}
              onAdd={routine.addProduct}
              onReplace={(product) => routine.replaceStep(index, product)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
