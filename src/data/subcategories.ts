import type { Category, Product } from "../types/commerce";

export interface Subcategory {
  slug: string;
  label: string;
}

/** Subcategories in menu order. A subcategory with no products is not shown. */
export const SUBCATEGORIES: Record<Category, Subcategory[]> = {
  Makeup: [
    { slug: "face", label: "Face" },
    { slug: "eyes", label: "Eyes" },
    { slug: "lips", label: "Lips" },
    { slug: "cheeks", label: "Cheeks" },
  ],
  Skincare: [
    { slug: "cleansers", label: "Cleansers" },
    { slug: "treatments", label: "Serums & treatments" },
    { slug: "moisturisers", label: "Moisturisers" },
    { slug: "sun-care", label: "Sun care" },
  ],
  Fragrance: [
    { slug: "women", label: "For her" },
    { slug: "men", label: "For him" },
    { slug: "unisex", label: "Unisex" },
  ],
  Hair: [{ slug: "styling", label: "Styling" }],
  Sets: [],
};

const BY_SLUG: Record<string, string> = {
  "estee-lauder-double-wear": "face",
  "nars-radiant-creamy-concealer": "face",
  "dior-backstage-face-body-foundation": "face",
  "dior-forever-foundation": "face",
  "armani-luminous-silk-foundation": "face",
  "glossier-cloud-paint": "cheeks",
  "chanel-rouge-allure": "lips",
  "lancome-labsolu-rouge": "lips",
  "mac-matte-lipstick": "lips",
  "nars-lipstick": "lips",
  "abh-modern-renaissance-palette": "eyes",
  "nars-eyeshadow-palette": "eyes",
  "maybelline-the-city-mini-palette": "eyes",
  "too-faced-better-than-sex-mascara": "eyes",
  "glossier-milky-jelly-cleanser": "cleansers",
  "glossier-solution": "treatments",
  "the-ordinary-hyaluronic-acid-2-b5": "treatments",
  "the-ordinary-salicylic-acid-2": "treatments",
  "the-ordinary-aha-30-bha-2-peeling-solution": "treatments",
  "la-roche-posay-effaclar-mat": "moisturisers",
  "la-roche-posay-lipikar-baume-ap": "moisturisers",
  "uriage-eau-thermale-water-cream": "moisturisers",
  "glossier-invisible-shield-spf-35": "sun-care",
  "chanel-no-5-eau-de-parfum": "women",
  "chanel-gabrielle-eau-de-parfum": "women",
  "miss-dior-blooming-bouquet": "women",
  "dior-jadore-eau-de-parfum": "women",
  "dior-poison-girl": "women",
  "ysl-libre-eau-de-parfum": "women",
  "gucci-guilty-pour-femme": "women",
  "dior-sauvage-eau-de-parfum": "men",
  "dior-homme-sport": "men",
  "ysl-y-eau-de-parfum": "men",
  "gucci-memoire-dune-odeur": "unisex",
  "jo-malone-wood-sage-sea-salt": "unisex",
  "olaplex-no-6-bond-smoother": "styling",
};

/** Attaches the product's subcategory, kept here so the catalogue files stay about the product. */
export const withSubcategory = (product: Product): Product => ({
  ...product,
  subcategory: BY_SLUG[product.slug],
});
