import { toggleWishlistItem } from "./wishlist";

test("adds and removes a wishlist ID", () => {
  expect(toggleWishlistItem([], 7)).toEqual([7]);
  expect(toggleWishlistItem([3, 7], 7)).toEqual([3]);
});
