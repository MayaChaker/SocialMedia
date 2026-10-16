import type { KeyboardEvent, RefObject } from "react";
import { ArrowBack, ArrowForward, Check } from "@mui/icons-material";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ROUTINE_QUESTIONS, questionAt } from "./routineQuestions";
import type { RoutineBuilder } from "./useRoutineBuilder";

/** Arrow keys move between options, like a native radio group. */
function handleChoiceKeys(event: KeyboardEvent<HTMLDivElement>) {
  if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
  event.preventDefault();
  const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')];
  const current = Math.max(0, controls.indexOf(document.activeElement as HTMLElement));
  const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
  const next = controls[(current + direction + controls.length) % controls.length];
  next?.focus();
  next?.click();
}

/** One question at a time, with progress, keyboard support and a retry on failure. */
interface RoutineQuizProps {
  routine: RoutineBuilder;
  headingRef: RefObject<HTMLHeadingElement | null>;
}

export default function RoutineQuiz({ routine, headingRef }: RoutineQuizProps) {
  const { step, answers, generationError } = routine;
  const reduceMotion = useReducedMotion();
  const question = questionAt(step);
  const selected = answers[question.key];
  const isLast = step === ROUTINE_QUESTIONS.length - 1;

  return (
    <main className="builderPage questionPage">
      <div className="questionShell">
        <div className="questionTopline">
          <span className="stepCount">
            Step {step + 1} of {ROUTINE_QUESTIONS.length}
          </span>
        </div>
        <ol
          className="routineProgress"
          aria-label={`Step ${step + 1} of ${ROUTINE_QUESTIONS.length}`}
        >
          {ROUTINE_QUESTIONS.map((item, index) => (
            <li
              key={item.key}
              className={index < step ? "complete" : index === step ? "current" : "upcoming"}
              aria-current={index === step ? "step" : undefined}
            >
              <span className="progressMark">
                {index < step ? <Check aria-hidden="true" /> : index + 1}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ol>
        <AnimatePresence mode="wait">
          <motion.section
            key={question.key}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <span className="kicker">{question.eyebrow}</span>
            <h1 ref={headingRef} tabIndex={-1}>
              {question.title}
            </h1>
            <div
              className={`choiceGrid ${question.key}`}
              role="radiogroup"
              aria-label={question.title}
              onKeyDown={handleChoiceKeys}
            >
              {question.options.map(([value, copy], index) => {
                const isSelected = selected === value;
                const descriptionId = `${question.key}-${index}-description`;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-describedby={descriptionId}
                    tabIndex={isSelected || (!selected && index === 0) ? 0 : -1}
                    className={isSelected ? "selected" : ""}
                    onClick={() => routine.selectAnswer(value)}
                    key={value}
                  >
                    <span className="choiceCopy">
                      <strong>{value}</strong>
                      <span id={descriptionId}>{copy}</span>
                    </span>
                    <span className="choiceIndicator" aria-hidden="true">
                      {isSelected ? <Check /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="choiceGuidance" aria-live="polite">
              {selected ? `${selected} selected.` : "Choose one option to continue."}
            </p>
            {generationError && (
              <div className="routineError" role="alert">
                <p>{generationError}</p>
                <button type="button" onClick={routine.retry}>
                  Retry
                </button>
              </div>
            )}
            <div className="questionActions">
              <button className="button outline" onClick={routine.goBack}>
                <ArrowBack aria-hidden="true" /> Back
              </button>
              <button
                className="button dark"
                disabled={!selected}
                onClick={routine.continueQuestion}
              >
                {isLast ? "See my routine" : "Continue"}
                <ArrowForward aria-hidden="true" />
              </button>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}
