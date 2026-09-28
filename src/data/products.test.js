import { PRODUCTS } from "./products";

test("every catalog product has a unique identity", () => {
  expect(new Set(PRODUCTS.map((product) => product.id)).size).toBe(PRODUCTS.length);
  expect(new Set(PRODUCTS.map((product) => product.slug)).size).toBe(PRODUCTS.length);
});
