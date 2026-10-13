import { resolveProductSelection, type SelectionInput } from "../product/productSelection";
import type { CartLine, StoredCartLine } from "../../types/commerce";

/** Bag state may still contain lines loaded from storage before they are resolved. */
export type CartEntry = StoredCartLine | CartLine;

const DEFAULT_STOCK = 24;
const lineId = (item: CartEntry) => item.cartId || String(item.id);

export function addCartItem(items: CartEntry[], selection: SelectionInput): CartEntry[] {
  const variantId = typeof selection === "object" ? selection.variantId : undefined;
  const product = resolveProductSelection(selection, variantId);
  if (!product) return items;
  const stock = product.stock ?? DEFAULT_STOCK;
  if (stock <= 0) return items;

  const existing = items.find((item) => lineId(item) === product.cartId);
  if (!existing) return [...items, { ...product, quantity: 1 }];
  return items.map((item) =>
    lineId(item) === product.cartId
      ? { ...product, quantity: Math.min(Number(item.quantity) + 1, stock) }
      : item,
  );
}

export function updateCartItemQuantity(items: CartEntry[], id: string, delta: number): CartEntry[] {
  return items
    .map((item): CartEntry => {
      if (lineId(item) !== String(id)) return item;
      const canonical = resolveProductSelection(item, item.variantId);
      const stock = canonical?.stock ?? DEFAULT_STOCK;
      return { ...(canonical ?? item), quantity: Math.min(Number(item.quantity) + delta, stock) };
    })
    .filter((item) => Number(item.quantity) > 0);
}

export const removeCartItem = (items: CartEntry[], id: string): CartEntry[] =>
  items.filter((item) => lineId(item) !== String(id));
