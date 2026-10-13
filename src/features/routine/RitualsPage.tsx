"use client";

import { useEffect, useRef } from "react";
import RitualsIntro from "./RitualsIntro";
import RoutineQuiz from "./RoutineQuiz";
import RoutineResult from "./RoutineResult";
import { useRoutineBuilder } from "./useRoutineBuilder";

/** Routine builder: an intro, three questions, then a recommended routine. */
export default function RitualsPage() {
  const routine = useRoutineBuilder();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { started, step, result } = routine;

  // Move focus to each new heading so screen-reader users hear the step change.
  useEffect(() => {
    if (started) requestAnimationFrame(() => headingRef.current?.focus());
  }, [started, step, result]);

  if (!started) return <RitualsIntro onStart={routine.start} />;
  if (result) return <RoutineResult routine={routine} result={result} headingRef={headingRef} />;
  return <RoutineQuiz routine={routine} headingRef={headingRef} />;
}
