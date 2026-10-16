import type { Category } from "../types/commerce";

export interface HeroSlide {
  /** File name in public/images/campaign, without the extension. */
  image: string;
  alt: string;
  /** Focal point for the crop, as CSS object-position. */
  focus: string;
  label: string;
  cta: { label: string; href: string };
}

/** The campaign photographs that rotate in the hero, each leading to its category. */
export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    image: "hero",
    alt: "Four women in cream and black knitwear, cheek to cheek",
    focus: "40% 30%",
    label: "The Veloura edit",
    cta: { label: "Shop the edit", href: "/shop" },
  },
  {
    image: "makeup",
    alt: "A woman with a red lip holding a gold lipstick",
    focus: "50% 28%",
    label: "Makeup",
    cta: { label: "Shop makeup", href: "/shop/makeup" },
  },
  {
    image: "skincare",
    alt: "Two women with dewy skin, one applying a drop of serum",
    focus: "50% 32%",
    label: "Skincare",
    cta: { label: "Shop skincare", href: "/shop/skincare" },
  },
  {
    image: "fragrance",
    alt: "A hand holding a clear perfume bottle against ivory linen",
    focus: "50% 45%",
    label: "Fragrance",
    cta: { label: "Shop fragrance", href: "/shop/fragrance" },
  },
  {
    image: "hair",
    alt: "A woman with long, glossy dark hair turning away",
    focus: "50% 30%",
    label: "Haircare",
    cta: { label: "Shop haircare", href: "/shop/hair" },
  },
];

export interface CategoryTile {
  label: string;
  category: Category;
  href: string;
  image: string;
  alt: string;
  focus: string;
}

/** The four categories, in the order they appear in "Discover by category". */
export const CATEGORY_TILES: readonly CategoryTile[] = [
  {
    label: "Makeup",
    category: "Makeup",
    href: "/shop/makeup",
    image: "makeup",
    alt: "A woman with a red lip holding a gold lipstick",
    focus: "50% 30%",
  },
  {
    label: "Skincare",
    category: "Skincare",
    href: "/shop/skincare",
    image: "skincare",
    alt: "Two women with dewy skin, one applying serum",
    focus: "50% 35%",
  },
  {
    label: "Fragrance",
    category: "Fragrance",
    href: "/shop/fragrance",
    image: "fragrance",
    alt: "A hand holding a perfume bottle",
    focus: "50% 45%",
  },
  {
    label: "Haircare",
    category: "Hair",
    href: "/shop/hair",
    image: "hair",
    alt: "A woman with long, glossy hair",
    focus: "50% 30%",
  },
];
