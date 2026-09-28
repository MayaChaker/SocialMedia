import { resolveProductSelection } from "./productSelection";

test("resolves a valid product by ID", () => {
  expect(resolveProductSelection(11)).toMatchObject({ id: 11, productId: 11, slug: "soft-light-palette", cartId: "11" });
});

test("resolves a selected variant with its canonical identity", () => {
  expect(resolveProductSelection(7, "deep")).toMatchObject({
    id: "deep",
    productId: 7,
    variantId: "deep",
    selectedVariant: "Mahogany 09",
    cartId: "7:deep",
  });
});

test("falls back to the base product when a variant is absent or invalid", () => {
  expect(resolveProductSelection(7)).toMatchObject({ productId: 7, cartId: "7" });
  expect(resolveProductSelection(7, "missing")).toMatchObject({ productId: 7, cartId: "7" });
});

test("returns null for a missing product", () => {
  expect(resolveProductSelection(999)).toBeNull();
});
