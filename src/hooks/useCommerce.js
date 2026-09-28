import { createContext, useContext, useMemo } from "react";
import { resolveCart } from "../domain/cart/cart";
import { addCartItem, removeCartItem, updateCartItemQuantity } from "../domain/cart/cartState";
import { toggleWishlistItem } from "../domain/wishlist/wishlist";
import { STORAGE_KEYS } from "../repositories/storageRepository";
import { usePersistentState } from "./usePersistentState";

const CommerceContext = createContext(null);

export function CommerceProvider({ children }) {
  const [cart, setCart] = usePersistentState(STORAGE_KEYS.cart, []);
  const [wishlist, setWishlist] = usePersistentState(STORAGE_KEYS.wishlist, []);
  const [orders, setOrders] = usePersistentState(STORAGE_KEYS.orders, []);
  const canonicalCart = useMemo(() => resolveCart(cart), [cart]);
  const value = useMemo(() => ({
    cart: canonicalCart,
    wishlist,
    orders,
    addToCart(selection) { setCart((items) => addCartItem(items, selection)); },
    updateQuantity(id, delta) { setCart((items) => updateCartItemQuantity(items, id, delta)); },
    removeFromCart(id) { setCart((items) => removeCartItem(items, id)); },
    clearCart() { setCart([]); },
    toggleWishlist(id) { setWishlist((items) => toggleWishlistItem(items, id)); },
    addOrder(order) { setOrders((items) => [order, ...items]); },
  }), [canonicalCart, orders, setCart, setOrders, setWishlist, wishlist]);
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export const useCommerce = () => {
  const value = useContext(CommerceContext);
  if (!value) throw new Error("useCommerce must be used inside CommerceProvider");
  return value;
};
