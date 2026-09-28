import { addCartItem, removeCartItem, updateCartItemQuantity } from "./cartState";

test("adds an item and increments an existing cart line", () => {
  const added = addCartItem([], { productId: 11 });
  expect(added).toHaveLength(1);
  expect(added[0]).toMatchObject({ productId: 11, cartId: "11", quantity: 1 });
  expect(addCartItem(added, { productId: 11 })[0].quantity).toBe(2);
});

test("updates quantity within stock and removes zero-quantity lines", () => {
  const items = addCartItem([], { productId: 11 });
  expect(updateCartItemQuantity(items, "11", 2)[0].quantity).toBe(3);
  expect(updateCartItemQuantity(items, "11", -1)).toEqual([]);
});

test("removes only the requested cart line", () => {
  const items = addCartItem(addCartItem([], { productId: 11 }), { productId: 12 });
  expect(removeCartItem(items, "11").map((item) => item.productId)).toEqual([12]);
});
