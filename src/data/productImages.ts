import type { Product } from "../types/commerce";

/** Product photography lives in public/images/products, one file per product or shade. */
const PRODUCT_IMAGE_DIR = "/images/products";

export const productImagePath = (slug: string, variantId?: string): string =>
  `${PRODUCT_IMAGE_DIR}/${slug}${variantId ? `-${variantId}` : ""}.webp`;

/**
 * Attaches photography by naming convention: `<slug>.webp`, or `<slug>-<variant id>.webp`
 * for each shade. A product with shades is pictured in its first shade.
 */
export function withPhotography(product: Product): Product {
  if (!product.variants?.length) return { ...product, image: productImagePath(product.slug) };
  const variants = product.variants.map((variant) => ({
    ...variant,
    image: productImagePath(product.slug, variant.id),
  }));
  return { ...product, variants, image: variants[0]?.image };
}
