import type { ProductId, Review } from "../types/commerce";

/**
 * Customer reviews. Empty on purpose: Veloura has no real customers yet, and the
 * rating numbers in the catalogue were placeholders, so nothing is shown until
 * genuine reviews exist. Rating and Reviews render nothing for an empty list.
 */
export const REVIEWS: readonly Review[] = [];

export const reviewsFor = (productId: ProductId): Review[] =>
  REVIEWS.filter((review) => review.productId === productId);
