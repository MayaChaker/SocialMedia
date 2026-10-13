import type { RoutineAnswers, RoutinePace } from "./routineRecommendations";

export interface RoutineQuestion {
  key: keyof RoutineAnswers;
  label: string;
  eyebrow: string;
  title: string;
  /** [value, description] pairs. */
  options: Array<[string, string]>;
}

/** Answers collected so far; complete once every question is answered. */
export type RoutineDraft = Partial<RoutineAnswers>;

export const ROUTINE_QUESTIONS: RoutineQuestion[] = [
  {
    key: "goal",
    label: "Concern",
    eyebrow: "Your focus",
    title: "What would you most like to support?",
    options: [
      ["Dehydration", "Tightness or lack of lasting moisture."],
      ["Dullness", "Skin that looks tired or lacks radiance."],
      ["Fine lines", "Early visible lines and dryness."],
      ["Sensitive skin", "Skin that reacts or feels easily irritated."],
    ],
  },
  {
    key: "texture",
    label: "Texture",
    eyebrow: "Your preference",
    title: "Which textures do you reach for?",
    options: [
      ["Weightless", "Light and quick-absorbing."],
      ["Cushioning", "Soft, comforting hydration."],
      ["Rich", "Deeply nourishing textures."],
    ],
  },
  {
    key: "time",
    label: "Time",
    eyebrow: "Your pace",
    title: "How much time feels realistic?",
    options: [
      ["Essential", "A streamlined 2-step routine."],
      ["Balanced", "A complete 3-step routine."],
      ["Immersive", "A considered 4-step routine."],
    ],
  },
];

export const questionAt = (step: number): RoutineQuestion => {
  const question = ROUTINE_QUESTIONS[step];
  if (!question) throw new Error(`Routine builder has no question ${step + 1}`);
  return question;
};

export const isComplete = (answers: RoutineDraft): answers is RoutineAnswers =>
  Boolean(answers.goal && answers.texture && answers.time);

export const TIME_LABELS: Record<RoutinePace, string> = {
  Essential: "2-step routine",
  Balanced: "3-step routine",
  Immersive: "4-step routine",
};
