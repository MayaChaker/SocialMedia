import { ArrowBack, ArrowForward, Check } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import type { ShadeAnswers } from "./shadeMatchLogic";
import { DEPTH_COLORS, OPTION_GUIDANCE, SHADE_QUESTIONS, shadeQuestionAt } from "./shadeQuestions";

interface ShadeQuizProps {
  step: number;
  answers: ShadeAnswers;
  onSelect: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

/** One shade question at a time, with a progress bar. */
export default function ShadeQuiz({ step, answers, onSelect, onContinue, onBack }: ShadeQuizProps) {
  const question = shadeQuestionAt(step);
  const selected = answers[question.key];
  const total = SHADE_QUESTIONS.length;

  return (
    <main className="builderPage questionPage shadeQuestion">
      <div className="shadeQuestionShell">
        <div className="questionTopline">
          <button className="backLink" onClick={onBack}>
            <ArrowBack /> Back
          </button>
          <span className="stepCount">
            Step {step + 1} of {total}
          </span>
        </div>
        <div
          className="builderProgress"
          role="progressbar"
          aria-label={`Shade Match step ${step + 1} of ${total}`}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step + 1}
        >
          {SHADE_QUESTIONS.map((item, index) => (
            <span key={item.key} className={index <= step ? "active" : ""} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.section
            key={question.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <span className="kicker">Shade match</span>
            <h1>{question.title}</h1>
            <div className="shadeChoices" role="radiogroup" aria-label={question.title}>
              {question.options.map((value) => {
                const isSelected = selected === value;
                const swatchColor = question.key === "depth" ? DEPTH_COLORS[value] : undefined;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`${isSelected ? "selected" : ""} ${swatchColor ? "hasSwatch" : ""}`}
                    onClick={() => onSelect(value)}
                    key={value}
                  >
                    {swatchColor && <i style={{ "--shade": swatchColor }} aria-hidden="true" />}
                    <span className="shadeChoiceCopy">
                      <strong>{value}</strong>
                      {OPTION_GUIDANCE[value] && <small>{OPTION_GUIDANCE[value]}</small>}
                    </span>
                    <span className="shadeChoiceIndicator" aria-hidden="true">
                      {isSelected ? <Check /> : <ArrowForward />}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="selectionHelp" aria-live="polite">
              {selected ? `${selected} selected.` : "Choose one option to continue."}
            </p>
            <div className="questionActions">
              <button className="button dark" disabled={!selected} onClick={onContinue}>
                {step === total - 1 ? "See my shade" : "Continue"}
                <ArrowForward />
              </button>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}
