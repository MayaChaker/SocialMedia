import { PRODUCTS, resolveCart, resolveProductSelection } from "./products";

test("every catalog product has a unique identity and canonical image", () => {
  expect(new Set(PRODUCTS.map((product) => product.id)).size).toBe(PRODUCTS.length);
  expect(new Set(PRODUCTS.map((product) => product.slug)).size).toBe(PRODUCTS.length);
  PRODUCTS.forEach((product) => expect(resolveProductSelection(product).image).toBe(product.image));
});

test("variants have distinct cart identities and resolve their own image and price", () => {
  const tint = PRODUCTS.find((product) => product.slug === "petal-skin-tint");
  const light = resolveProductSelection(tint, "light");
  const deep = resolveProductSelection(tint, "deep");
  expect(light.cartId).toBe(`${tint.id}:light`);
  expect(deep.cartId).toBe(`${tint.id}:deep`);
  expect(light.image).toContain("petal-skin-tint-light.webp");
  expect(deep.image).toContain("petal-skin-tint-deep.webp");
  expect(light.cartId).not.toBe(deep.cartId);
});

test("persisted cart presentation is refreshed from canonical product data", () => {
  const [item] = resolveCart([{ productId: 11, cartId: "11", quantity: 3, name: "Old name", image: "/wrong.webp", price: 1 }]);
  expect(item).toMatchObject({ name: "Soft Light Palette", image: "/products/catalog/soft-light-palette.webp", price: 62, quantity: 3 });
});
