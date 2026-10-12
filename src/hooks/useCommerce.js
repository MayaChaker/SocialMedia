import { createContext, useContext, useMemo } from "react";
import { resolveCart } from "../domain/cart/cart";
import { addCartItem, removeCartItem, updateCartItemQuantity } from "../domain/cart/cartState";
import { calculateTotals, findPromotion, normalizePromoCode } from "../domain/cart/pricing";
import { toggleWishlistItem } from "../domain/wishlist/wishlist";
import { STORAGE_KEYS } from "../repositories/storageRepository";
import { usePersistentState } from "./usePersistentState";

const CommerceContext = createContext(null);

export function CommerceProvider({ children }) {
  const [cart, setCart, hydrated] = usePersistentState(STORAGE_KEYS.cart, []);
  const [promoCode, setPromoCode] = usePersistentState(STORAGE_KEYS.promo, "");
  const [wishlist, setWishlist] = usePersistentState(STORAGE_KEYS.wishlist, []);
  const [orders, setOrders] = usePersistentState(STORAGE_KEYS.orders, []);

  // Actions only depend on state setters, so their identity never changes and
  // components can list them as effect dependencies safely.
  const actions = useMemo(
    () => ({
      addToCart: (selection) => setCart((items) => addCartItem(items, selection)),
      updateQuantity: (id, delta) => setCart((items) => updateCartItemQuantity(items, id, delta)),
      removeFromCart: (id) => setCart((items) => removeCartItem(items, id)),
      clearCart: () => {
        setCart([]);
        setPromoCode("");
      },
      /** Returns true when the code is recognised and applied. */
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
  const value = useMemo(
    () => ({ cart: canonicalCart, hydrated, promoCode, totals, wishlist, orders, ...actions }),
    [actions, canonicalCart, hydrated, orders, promoCode, totals, wishlist],
  );
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export const useCommerce = () => {
  const value = useContext(CommerceContext);
  if (!value) throw new Error("useCommerce must be used inside CommerceProvider");
  return value;
};
