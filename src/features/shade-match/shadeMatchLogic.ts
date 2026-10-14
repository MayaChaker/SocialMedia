import { productRepository } from "../../repositories/productRepository";
import type { Product } from "../../types/commerce";

export interface ShadeAnswers {
  depth?: string;
  tone?: string;
  [question: string]: string | undefined;
}

interface ShadeDescription {
  depth: string;
  undertone: string;
  description: string;
}

export interface ShadeProfile extends ShadeDescription {
  variantId: string;
  name: string;
  swatch: string;
  productSlug: string;
}

type ToneKey = "cool" | "neutral" | "warm";

const FOUNDATION: Product | undefined = productRepository.getBySlug("estee-lauder-double-wear");

const PROFILE_BY_VARIANT: Record<string, ShadeDescription> = {
  fair: {
    depth: "Fair",
    undertone: "Cool-neutral",
    description: "A softly balanced shade for fair complexions.",
  },
  light: {
    depth: "Light",
    undertone: "Neutral",
    description: "A balanced shade that settles naturally into light complexions.",
  },
  medium: {
    depth: "Medium",
    undertone: "Warm-neutral",
    description: "A golden-neutral shade that blends naturally with medium complexions.",
  },
  tan: {
    depth: "Tan",
    undertone: "Warm",
    description: "A warm, dimensional shade for tan complexions.",
  },
  deep: {
    depth: "Deep",
    undertone: "Neutral-warm",
    description: "A rich, balanced shade for deep complexions.",
  },
};

const MEDIUM_FAMILY: Record<ToneKey, string> = { cool: "light", neutral: "medium", warm: "medium" };

const VARIANT_BY_ANSWERS: Record<string, Record<ToneKey, string>> = {
  Fair: { cool: "fair", neutral: "fair", warm: "fair" },
  Light: { cool: "light", neutral: "light", warm: "medium" },
  Medium: MEDIUM_FAMILY,
  Tan: { cool: "medium", neutral: "tan", warm: "tan" },
  Deep: { cool: "deep", neutral: "deep", warm: "deep" },
};

const toneKey = (answer = ""): ToneKey =>
  answer.startsWith("Silver") ? "cool" : answer.startsWith("Gold") ? "warm" : "neutral";

export const SHADE_PROFILES: ShadeProfile[] = (FOUNDATION?.variants ?? []).flatMap((variant) => {
  const profile = PROFILE_BY_VARIANT[variant.id];
  if (!profile || !FOUNDATION) return [];
  return [
    {
      ...profile,
      variantId: variant.id,
      name: variant.name,
      swatch: variant.swatch,
      productSlug: FOUNDATION.slug,
    },
  ];
});

export function matchShade(answers: ShadeAnswers): ShadeProfile | undefined {
  const family = VARIANT_BY_ANSWERS[answers.depth ?? ""] ?? MEDIUM_FAMILY;
  const variantId = family[toneKey(answers.tone)];
  return SHADE_PROFILES.find((shade) => shade.variantId === variantId);
}

export function matchedProductUrl(shade: Pick<ShadeProfile, "productSlug" | "variantId">): string {
  return `/product/${shade.productSlug}?variant=${encodeURIComponent(shade.variantId)}`;
}
