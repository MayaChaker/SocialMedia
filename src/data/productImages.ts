import type { Product } from "../types/commerce";

/** Product photography lives in public/images/products, one file per product. */
const PRODUCT_IMAGE_DIR = "/images/products";

export const productImagePath = (slug: string): string => `${PRODUCT_IMAGE_DIR}/${slug}.webp`;

/** Attaches the product's photograph by naming convention: `<slug>.webp`. */
export const withPhotography = (product: Product): Product => ({
  ...product,
  image: productImagePath(product.slug),
});
