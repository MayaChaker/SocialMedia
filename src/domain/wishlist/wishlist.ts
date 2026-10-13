import type { ProductId } from "../../types/commerce";

export const toggleWishlistItem = (items: ProductId[], id: ProductId): ProductId[] =>
  items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
