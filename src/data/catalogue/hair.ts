import type { Product } from "../../types/commerce";

export const HAIR: Product[] = [
  {
    id: 36,
    slug: "olaplex-no-6-bond-smoother",
    name: "No.6 Bond Smoother",
    brand: "Olaplex",
    category: "Hair",
    type: "tube",
    packaging: "porcelain",
    price: 30,
    size: "100 ml",
    badge: "Bestseller",
    isBestseller: true,
    rating: 4.6,
    reviews: 2780,
    note: "Leave-in styling cream",
    description:
      "A reparative leave-in cream that smooths frizz and protects hair from heat while strengthening bonds.",
    ingredients: "Bis-aminopropyl diglycol dimaleate · Heat-protecting polymers",
    benefits: ["Smooths frizz", "Heat protection", "Strengthens hair bonds"],
    texture: "Leave-in cream",
    finish: "Smooth and soft",
    ritual: "Apply to damp hair from mid-lengths to ends, then style.",
    order: "Hair · Style",
    matches: ["Frizz"],
    color: "ivory",
  },
];
