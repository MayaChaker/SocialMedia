import { addRecentlyViewedItem } from "./recentlyViewed";

test("moves duplicate IDs to the front", () => {
  expect(addRecentlyViewedItem([3, 2, 1], 2)).toEqual([2, 3, 1]);
});

test("retains at most six recently viewed IDs", () => {
  expect(addRecentlyViewedItem([6, 5, 4, 3, 2, 1], 7)).toEqual([7, 6, 5, 4, 3, 2]);
});
