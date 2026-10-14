import { productRepository } from "../../repositories/productRepository";
import type { Product } from "../../types/commerce";

export type RoutineGoal = "Dehydration" | "Dullness" | "Fine lines" | "Sensitive skin";
export type RoutinePace = "Essential" | "Balanced" | "Immersive";
export type RoutineTexture = "Weightless" | "Cushioning" | "Rich";

// A type alias rather than an interface, so it can be stored as a plain Record<string, string>.
export type RoutineAnswers = {
  goal: RoutineGoal;
  time: RoutinePace;
  texture: RoutineTexture;
};

export interface RoutineStep {
  product: Product;
  step: string;
  reason: string;
}

const catalogue = productRepository.getAll();

/** Routine products are fixed slugs; a missing one is a catalogue bug, so fail loudly. */
const bySlug = (slug: string): Product => {
  const product = productRepository.getBySlug(slug);
  if (!product) throw new Error(`Routine product "${slug}" is missing from the catalogue`);
  return product;
};

const ESSENCE = "glossier-solution";
const CLEANSER = "glossier-milky-jelly-cleanser";
const SERUM = "the-ordinary-hyaluronic-acid-2-b5";
const NIGHT_CREAM = "la-roche-posay-lipikar-baume-ap";
const SPF = "glossier-invisible-shield-spf-35";

const treatmentByGoal: Record<RoutineGoal, string> = {
  Dehydration: SERUM,
  Dullness: ESSENCE,
  "Fine lines": SERUM,
  "Sensitive skin": SERUM,
};

const treatmentReasons: Record<RoutineGoal, string> = {
  Dehydration: "Floods skin with light, lasting hydration.",
  Dullness: "Gently exfoliates for a fresher, brighter look.",
  "Fine lines": "Plumps the look of fine lines with hydration.",
  "Sensitive skin": "Hydrates without fragrance or harsh actives.",
};

const finishByTexture: Record<RoutineTexture, string> = {
  Weightless: SPF,
  Cushioning: SPF,
  Rich: NIGHT_CREAM,
};

const recommendation = (slug: string, step: string, reason: string): RoutineStep => ({
  product: bySlug(slug),
  step,
  reason,
});

/**
 * Builds a routine from the quiz answers:
 * cleanse → treat → finish, trimmed to two steps for "Essential"
 * and extended with a second hydrating layer for "Immersive".
 */
export function buildRoutineRecommendations({
  goal,
  time,
  texture,
}: RoutineAnswers): RoutineStep[] {
  const cleanser = CLEANSER;
  const treatment = treatmentByGoal[goal] || SERUM;
  const finish = finishByTexture[texture] || SPF;
  const cleanserReason = "Cleanses gently without disturbing the skin barrier.";
  const finishReason =
    finish === NIGHT_CREAM
      ? "Replenishes overnight with a rich, breathable finish."
      : "Adds daily protection with a smooth, lightweight finish.";

  if (time === "Essential") {
    const replenish = texture === "Rich" || goal === "Fine lines";
    return [
      recommendation(cleanser, "Cleanse", cleanserReason),
      replenish
        ? recommendation(NIGHT_CREAM, "Replenish", "Comforts skin with one restorative step.")
        : recommendation(treatment, "Treat", treatmentReasons[goal]),
    ];
  }

  const routine = [
    recommendation(cleanser, "Cleanse", cleanserReason),
    recommendation(treatment, "Treat", treatmentReasons[goal]),
    recommendation(finish, finish === NIGHT_CREAM ? "Replenish" : "Protect", finishReason),
  ];

  if (time === "Immersive") {
    // Essence always goes before serum, so the extra layer is inserted in the right place.
    const extra =
      treatment === ESSENCE
        ? recommendation(SERUM, "Treat", "Follows exfoliation with weightless hydration.")
        : recommendation(ESSENCE, "Prepare", "Smooths texture so treatment absorbs evenly.");
    routine.splice(treatment === ESSENCE ? 2 : 1, 0, extra);
  }

  return routine;
}

export function routineTitle({ goal, time }: Pick<RoutineAnswers, "goal" | "time">): string {
  const pace = time === "Essential" ? "Essential" : time === "Immersive" ? "Layered" : "Balanced";
  return `${pace} care for ${goal.toLowerCase()}.`;
}

export function routineAlternatives(product: Product, recommendations: RoutineStep[]): Product[] {
  const selected = new Set(recommendations.map((item) => item.product.id));
  return catalogue
    .filter(
      (candidate) =>
        candidate.category === "Skincare" &&
        candidate.type === product.type &&
        !selected.has(candidate.id),
    )
    .slice(0, 2);
}
