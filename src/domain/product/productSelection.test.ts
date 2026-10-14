import { resolveProductSelection } from "./productSelection";

test("resolves a valid product by ID", () => {
  expect(resolveProductSelection(22)).toMatchObject({
    id: 22,
    productId: 22,
    slug: "maybelline-the-city-mini-palette",
    cartId: "22",
  });
});

test("resolves a selected variant with its canonical identity", () => {
  expect(resolveProductSelection(10, "deep")).toMatchObject({
    id: 10,
    name: "Double Wear Stay-in-Place Foundation",
    productId: 10,
    variantId: "deep",
    selectedVariant: "6W1 Sandalwood",
    cartId: "10:deep",
  });
});

test("falls back to the base product when a variant is absent or invalid", () => {
  expect(resolveProductSelection(10)).toMatchObject({ productId: 10, cartId: "10" });
  expect(resolveProductSelection(10, "missing")).toMatchObject({ productId: 10, cartId: "10" });
});

test("returns null for a missing product", () => {
  expect(resolveProductSelection(999)).toBeNull();
});
