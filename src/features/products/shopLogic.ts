import { OUT_OF_STOCK_IDS } from "../../data/merchandising";
import type { Product } from "../../types/commerce";

/** URL segments accepted by /shop/[category]. */
export const CATEGORIES = ["makeup", "skincare", "fragrance", "hair"];

export type SortOption = "featured" | "price-low" | "price-high" | "newest";

/** Shop filters as read from the URL. Unknown sort values fall back to "featured". */
export interface ShopFilters {
  category?: string;
  collection: string;
  query: string;
  concern: string;
  underFifty: boolean;
  inStock: boolean;
  sort: SortOption | (string & {});
}

export const isProductAvailable = (product: Product): boolean =>
  !OUT_OF_STOCK_IDS.includes(product.id) &&
  (!product.variants || product.variants.some((variant) => (variant.stock ?? 0) > 0));

export const searchableProductText = (product: Product): string =>
  [
    product.name,
    product.brand,
    product.category,
    product.type,
    product.note,
    product.description,
    product.size,
    ...(product.matches || []),
    ...(product.benefits || []),
    ...(product.variants || []).map((variant) => variant.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export function filterAndSortProducts(
  products: Product[],
  { category, collection, query, concern, underFifty, inStock, sort }: ShopFilters,
): Product[] {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = products
    .filter((product) => !category || product.category.toLowerCase() === category.toLowerCase())
    .filter((product) => collection !== "new" || product.isNew)
    .filter((product) => collection !== "bestsellers" || product.isBestseller)
    .filter(
      (product) => !normalizedQuery || searchableProductText(product).includes(normalizedQuery),
    )
    .filter((product) => !concern || product.matches.includes(concern))
    .filter((product) => !underFifty || product.price < 50)
    .filter((product) => !inStock || isProductAvailable(product));

  return [...filtered].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "newest") return Number(b.isNew) - Number(a.isNew) || b.id - a.id;
    return Number(b.isBestseller) - Number(a.isBestseller) || a.id - b.id;
  });
}
