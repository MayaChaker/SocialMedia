import type { ProductId } from "../../types/commerce";

const LIMIT = 6;

/** Most recent first, without duplicates, capped at six products. */
export const addRecentlyViewedItem = (items: ProductId[], id: ProductId): ProductId[] =>
  [id, ...items.filter((item) => item !== id)].slice(0, LIMIT);
