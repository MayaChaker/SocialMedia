import { createContext, useContext, useMemo, type ReactNode } from "react";
import { resolveCart } from "../domain/cart/cart";
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  type CartEntry,
} from "../domain/cart/cartState";
import { calculateTotals, findPromotion, normalizePromoCode } from "../domain/cart/pricing";
import type { SelectionInput } from "../domain/product/productSelection";
import { toggleWishlistItem } from "../domain/wishlist/wishlist";
import { STORAGE_KEYS } from "../repositories/storageRepository";
import type { CartLine, Order, ProductId, Totals } from "../types/commerce";
import { usePersistentState } from "./usePersistentState";

export interface CommerceActions {
  addToCart: (selection: SelectionInput) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  /** Returns true when the code is recognised and applied. */
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  toggleWishlist: (id: ProductId) => void;
  addOrder: (order: Order) => void;
}

export interface CommerceState extends CommerceActions {
  cart: CartLine[];
  /** False until the saved bag has been read from storage. */
  hydrated: boolean;
  promoCode: string;
  totals: Totals;
  wishlist: ProductId[];
  orders: Order[];
}

const CommerceContext = createContext<CommerceState | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart, hydrated] = usePersistentState<CartEntry[]>(STORAGE_KEYS.cart, []);
  const [promoCode, setPromoCode] = usePersistentState(STORAGE_KEYS.promo, "");
  const [wishlist, setWishlist] = usePersistentState<ProductId[]>(STORAGE_KEYS.wishlist, []);
  const [orders, setOrders] = usePersistentState<Order[]>(STORAGE_KEYS.orders, []);

  // Actions only depend on state setters, so their identity never changes and
  // components can list them as effect dependencies safely.
  const actions = useMemo<CommerceActions>(
    () => ({
      addToCart: (selection) => setCart((items) => addCartItem(items, selection)),
      updateQuantity: (id, delta) => setCart((items) => updateCartItemQuantity(items, id, delta)),
      removeFromCart: (id) => setCart((items) => removeCartItem(items, id)),
      clearCart: () => {
        setCart([]);
        setPromoCode("");
      },
      applyPromoCode: (code) => {
        const valid = Boolean(findPromotion(code));
        setPromoCode(valid ? normalizePromoCode(code) : "");
        return valid;
      },
      removePromoCode: () => setPromoCode(""),
      toggleWishlist: (id) => setWishlist((items) => toggleWishlistItem(items, id)),
      addOrder: (order) => setOrders((items) => [order, ...items]),
    }),
    [setCart, setOrders, setPromoCode, setWishlist],
  );

  const canonicalCart = useMemo(() => resolveCart(cart), [cart]);
  const totals = useMemo(
    () => calculateTotals(canonicalCart, promoCode),
    [canonicalCart, promoCode],
  );
  const value = useMemo<CommerceState>(
    () => ({ cart: canonicalCart, hydrated, promoCode, totals, wishlist, orders, ...actions }),
    [actions, canonicalCart, hydrated, orders, promoCode, totals, wishlist],
  );
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export const useCommerce = (): CommerceState => {
  const value = useContext(CommerceContext);
  if (!value) throw new Error("useCommerce must be used inside CommerceProvider");
  return value;
};
