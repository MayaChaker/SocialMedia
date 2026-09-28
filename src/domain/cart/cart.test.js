import { resolveCart } from "./cart";

test("canonicalizes persisted product data while preserving quantity", () => {
  const [item] = resolveCart([{ productId: 11, cartId: "11", quantity: 3, name: "Old name", image: "/wrong.webp", price: 1 }]);
  expect(item).toMatchObject({ name: "Soft Light Palette", image: "/products/catalog/soft-light-palette.webp", price: 62, quantity: 3, cartId: "11" });
});

test("preserves variant identity when canonicalizing cart lines", () => {
  const [item] = resolveCart([{ productId: 7, variantId: "light", cartId: "7:light", quantity: 2 }]);
  expect(item).toMatchObject({ productId: 7, variantId: "light", selectedVariant: "Linen 03", cartId: "7:light", quantity: 2 });
});

test("drops missing catalogue entries and normalizes invalid quantities", () => {
  expect(resolveCart([{ productId: 999, quantity: 2 }])).toEqual([]);
  expect(resolveCart([{ productId: 11, quantity: 0 }])[0].quantity).toBe(1);
});
