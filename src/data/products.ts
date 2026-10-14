import type { Product } from "../types/commerce";
import { FRAGRANCES } from "./catalogue/fragrance";
import { HAIR } from "./catalogue/hair";
import { MAKEUP } from "./catalogue/makeup";
import { SKINCARE } from "./catalogue/skincare";
import { withPhotography } from "./productImages";

/** The full catalogue, one file per category under ./catalogue. */
export const PRODUCTS: Product[] = [...SKINCARE, ...MAKEUP, ...FRAGRANCES, ...HAIR].map(
  withPhotography,
);
