import { productBySlug } from "../../data/products";

const SKIN_TINT = productBySlug("petal-skin-tint");

const PROFILE_BY_VARIANT = {
  porcelain: { depth: "Fair", undertone: "Cool-neutral", description: "A light, softly balanced tint for fair complexions." },
  light: { depth: "Light", undertone: "Neutral", description: "A balanced tint that settles naturally into light complexions." },
  medium: { depth: "Medium", undertone: "Warm-neutral", description: "A golden-neutral tint designed to blend naturally with medium complexions." },
  tan: { depth: "Tan", undertone: "Warm", description: "A warm, dimensional tint for tan complexions." },
  deep: { depth: "Deep", undertone: "Neutral-warm", description: "A rich, balanced tint for deep complexions." },
};

const VARIANT_BY_ANSWERS = {
  Fair: { cool: "porcelain", neutral: "porcelain", warm: "porcelain" },
  Light: { cool: "light", neutral: "light", warm: "medium" },
  Medium: { cool: "light", neutral: "medium", warm: "medium" },
  Tan: { cool: "medium", neutral: "tan", warm: "tan" },
  Deep: { cool: "deep", neutral: "deep", warm: "deep" },
};

const toneKey = (answer = "") => answer.startsWith("Silver") ? "cool" : answer.startsWith("Gold") ? "warm" : "neutral";

export const SHADE_PROFILES = SKIN_TINT.variants.map((variant) => ({
  ...PROFILE_BY_VARIANT[variant.id],
  variantId: variant.id,
  name: variant.name,
  color: variant.color,
  image: variant.image,
  productSlug: SKIN_TINT.slug,
}));

export function matchShade(answers) {
  const family = VARIANT_BY_ANSWERS[answers.depth] || VARIANT_BY_ANSWERS.Medium;
  const variantId = family[toneKey(answers.tone)];
  return SHADE_PROFILES.find((shade) => shade.variantId === variantId);
}

export function matchedProductUrl(shade) {
  return `/product/${shade.productSlug}?variant=${encodeURIComponent(shade.variantId)}`;
}
