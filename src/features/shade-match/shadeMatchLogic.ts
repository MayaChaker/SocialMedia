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

const SKIN_TINT: Product | undefined = productRepository.getBySlug("petal-skin-tint");

const PROFILE_BY_VARIANT: Record<string, ShadeDescription> = {
  porcelain: {
    depth: "Fair",
    undertone: "Cool-neutral",
    description: "A light, softly balanced tint for fair complexions.",
  },
  light: {
    depth: "Light",
    undertone: "Neutral",
    description: "A balanced tint that settles naturally into light complexions.",
  },
  medium: {
    depth: "Medium",
    undertone: "Warm-neutral",
    description: "A golden-neutral tint designed to blend naturally with medium complexions.",
  },
  tan: {
    depth: "Tan",
    undertone: "Warm",
    description: "A warm, dimensional tint for tan complexions.",
  },
  deep: {
    depth: "Deep",
    undertone: "Neutral-warm",
    description: "A rich, balanced tint for deep complexions.",
  },
};

const MEDIUM_FAMILY: Record<ToneKey, string> = { cool: "light", neutral: "medium", warm: "medium" };

const VARIANT_BY_ANSWERS: Record<string, Record<ToneKey, string>> = {
  Fair: { cool: "porcelain", neutral: "porcelain", warm: "porcelain" },
  Light: { cool: "light", neutral: "light", warm: "medium" },
  Medium: MEDIUM_FAMILY,
  Tan: { cool: "medium", neutral: "tan", warm: "tan" },
  Deep: { cool: "deep", neutral: "deep", warm: "deep" },
};

const toneKey = (answer = ""): ToneKey =>
  answer.startsWith("Silver") ? "cool" : answer.startsWith("Gold") ? "warm" : "neutral";

export const SHADE_PROFILES: ShadeProfile[] = (SKIN_TINT?.variants ?? []).flatMap((variant) => {
  const profile = PROFILE_BY_VARIANT[variant.id];
  if (!profile || !SKIN_TINT) return [];
  return [
    {
      ...profile,
      variantId: variant.id,
      name: variant.name,
      swatch: variant.swatch,
      productSlug: SKIN_TINT.slug,
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
