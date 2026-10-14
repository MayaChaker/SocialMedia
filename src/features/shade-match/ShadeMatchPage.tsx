"use client";

import { useState } from "react";
import type { ShadeAnswers } from "./shadeMatchLogic";
import { SHADE_QUESTIONS, shadeQuestionAt } from "./shadeQuestions";
import ShadeIntro from "./ShadeIntro";
import ShadeQuiz from "./ShadeQuiz";
import ShadeResult from "./ShadeResult";

/** Shade finder: an intro, three questions, then a suggested Double Wear foundation shade. */
export default function ShadeMatchPage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ShadeAnswers>({});
  const [completed, setCompleted] = useState(false);

  const selectAnswer = (value: string) =>
    setAnswers((current) => ({ ...current, [shadeQuestionAt(step).key]: value }));

  const continueQuiz = () => {
    if (!answers[shadeQuestionAt(step).key]) return;
    if (step === SHADE_QUESTIONS.length - 1) setCompleted(true);
    else setStep((current) => current + 1);
  };

  const goBack = () => {
    if (step === 0) setStarted(false);
    else setStep((current) => current - 1);
  };

  const startAgain = () => {
    setStep(0);
    setAnswers({});
    setCompleted(false);
  };

  if (!started) return <ShadeIntro onStart={() => setStarted(true)} />;
  if (completed) return <ShadeResult answers={answers} onStartAgain={startAgain} />;
  return (
    <ShadeQuiz
      step={step}
      answers={answers}
      onSelect={selectAnswer}
      onContinue={continueQuiz}
      onBack={goBack}
    />
  );
}
