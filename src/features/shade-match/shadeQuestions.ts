import { SHADE_PROFILES } from "./shadeMatchLogic";

export interface ShadeQuestion {
  title: string;
  key: "depth" | "tone" | "finish";
  options: string[];
}

export const SHADE_QUESTIONS: ShadeQuestion[] = [
  {
    title: "How does your skin read in daylight?",
    key: "depth",
    options: ["Fair", "Light", "Medium", "Tan", "Deep"],
  },
  {
    title: "Which jewellery feels most harmonious?",
    key: "tone",
    options: ["Silver · cool", "Both · neutral", "Gold · warm"],
  },
  {
    title: "What finish feels most like you?",
    key: "finish",
    options: ["Fresh and sheer", "Soft satin", "Polished glow"],
  },
];

export const shadeQuestionAt = (step: number): ShadeQuestion => {
  const question = SHADE_QUESTIONS[step];
  if (!question) throw new Error(`Shade match has no step ${step + 1}`);
  return question;
};

/** Swatch shown next to each depth answer. */
export const DEPTH_COLORS: Record<string, string> = Object.fromEntries(
  SHADE_PROFILES.map((shade) => [shade.depth, shade.swatch]),
);

/** Helper text under undertone and finish answers. */
export const OPTION_GUIDANCE: Record<string, string> = {
  "Fresh and sheer": "Light coverage that lets natural skin show through.",
  "Soft satin": "Balanced radiance without looking dewy or flat.",
  "Polished glow": "A more luminous, light-reflecting finish.",
  "Silver · cool": "Blue, pink, or rosy tones tend to feel harmonious.",
  "Both · neutral": "Warm and cool tones tend to feel equally balanced.",
  "Gold · warm": "Golden, peach, or olive tones tend to feel harmonious.",
};
