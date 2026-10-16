import type { Product } from "../types/commerce";
import { PRODUCTS } from "./products";

export interface Brand {
  slug: string;
  name: string;
  productCount: number;
}

/** "Estée Lauder" → "estee-lauder". */
export const brandSlug = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** A brand's page, from its name. */
export const brandHref = (name: string): string => `/brands/${brandSlug(name)}`;

const byName = (a: Brand, b: Brand) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });

/** Every brand in the catalogue, A to Z, with how many of its products Veloura carries. */
export const BRANDS: readonly Brand[] = Object.values(
  PRODUCTS.reduce<Record<string, Brand>>((brands, product: Product) => {
    const slug = brandSlug(product.brand);
    const brand = brands[slug] ?? { slug, name: product.brand, productCount: 0 };
    brands[slug] = { ...brand, productCount: brand.productCount + 1 };
    return brands;
  }, {}),
).sort(byName);

export const getBrand = (slug: string): Brand | undefined =>
  BRANDS.find((brand) => brand.slug === slug);

/** Brands shown first in the menu and on the Brands page, by product count. */
export const FEATURED_BRANDS: readonly Brand[] = [...BRANDS]
  .sort((a, b) => b.productCount - a.productCount || byName(a, b))
  .slice(0, 6);
