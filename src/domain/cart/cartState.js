import { resolveProductSelection } from "../product/productSelection";

export function addCartItem(items, selection) {
  const product = resolveProductSelection(selection, selection.variantId);
  if (!product) return items;
  const stock = product.stock ?? 24;
  if (stock <= 0) return items;
  const found = items.find((item) => (item.cartId || String(item.id)) === product.cartId);
  return found
    ? items.map((item) => (item.cartId || String(item.id)) === product.cartId ? { ...product, quantity: Math.min(item.quantity + 1, stock) } : item)
    : [...items, { ...product, quantity: 1 }];
}

export function updateCartItemQuantity(items, id, delta) {
  return items.map((item) => {
    if ((item.cartId || String(item.id)) !== String(id)) return item;
    const canonical = resolveProductSelection(item, item.variantId) || item;
    return { ...canonical, quantity: Math.min(item.quantity + delta, canonical.stock ?? 24) };
  }).filter((item) => item.quantity > 0);
}

export const removeCartItem = (items, id) => items.filter((item) => (item.cartId || String(item.id)) !== String(id));
