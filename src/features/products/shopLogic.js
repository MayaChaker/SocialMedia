import { OUT_OF_STOCK_IDS } from "../../data/merchandising";

export const isProductAvailable = (product) => !OUT_OF_STOCK_IDS.includes(product.id)
  && (!product.variants || product.variants.some((variant) => (variant.stock ?? 0) > 0));

export const searchableProductText = (product) => [
  product.name, product.brand, product.category, product.type, product.note,
  product.description, product.size, ...(product.matches || []),
  ...(product.benefits || []), ...(product.variants || []).map((variant) => variant.name),
].filter(Boolean).join(" ").toLowerCase();

export function filterAndSortProducts(products, { category, collection, query, concern, underFifty, inStock, sort }) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = products
    .filter((product) => !category || product.category.toLowerCase() === category.toLowerCase())
    .filter((product) => collection !== "new" || product.isNew)
    .filter((product) => collection !== "bestsellers" || product.isBestseller)
    .filter((product) => !normalizedQuery || searchableProductText(product).includes(normalizedQuery))
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
