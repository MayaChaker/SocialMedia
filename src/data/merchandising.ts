import type { ProductId } from "../types/commerce";

interface HomeCategory {
  title: string;
  copy: string;
  href: string;
  /** Photograph in public/images/editorial. */
  image: string;
  alt: string;
}

export const BESTSELLER_IDS: ProductId[] = [26, 10, 18, 3];

export const OUT_OF_STOCK_IDS: ProductId[] = [];

// The evening routine promoted on the homepage, in application order.
export const EVENING_ROUTINE = [
  { slug: "glossier-milky-jelly-cleanser", step: "Cleanse" },
  { slug: "the-ordinary-hyaluronic-acid-2-b5", step: "Treat" },
  { slug: "la-roche-posay-lipikar-baume-ap", step: "Replenish" },
];

// "Shop the look": the products that recreate the campaign photograph.
export const SHOP_THE_LOOK = {
  title: "The classic red lip",
  image: "shop-the-look",
  alt: "A woman applying red lipstick in front of a mirror",
  slugs: [
    "chanel-rouge-allure",
    "armani-luminous-silk-foundation",
    "too-faced-better-than-sex-mascara",
  ],
};

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    title: "Makeup",
    copy: "Complexion, lips and eyes",
    href: "/shop/makeup",
    image: "category-makeup",
    alt: "A woman with glowing skin and glossy lips",
  },
  {
    title: "Skincare",
    copy: "Cleanse, treat, protect",
    href: "/shop/skincare",
    image: "category-skincare",
    alt: "A woman with fresh, dewy skin and wet hair",
  },
  {
    title: "Fragrance",
    copy: "Signature scents",
    href: "/shop/fragrance",
    image: "category-fragrance",
    alt: "A hand holding a perfume bottle in front of a mirror",
  },
  {
    title: "Hair",
    copy: "Smooth, define, protect",
    href: "/shop/hair",
    image: "category-hair",
    alt: "A woman with long, defined curls",
  },
];
