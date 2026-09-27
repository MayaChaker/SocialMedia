import { createContext, useContext, useMemo } from "react";
import { STORAGE_KEYS } from "../repositories/storageRepository";
import { usePersistentState } from "./usePersistentState";
import { resolveCart } from "../domain/cart/cart";
import { resolveProductSelection } from "../domain/product/productSelection";

const StoreContext = createContext(null);
const defaultProfile = { skinGoals: ["Dehydration", "Dullness"], skinType: "Balanced", preferences: ["Natural coverage", "Sensitive skin"] };

export function StoreProvider({ children }) {
  const [cart, setCart] = usePersistentState(STORAGE_KEYS.cart, []);
  const [wishlist, setWishlist] = usePersistentState(STORAGE_KEYS.wishlist, []);
  const [orders, setOrders] = usePersistentState(STORAGE_KEYS.orders, []);
  const [profile, setProfile] = usePersistentState(STORAGE_KEYS.profile, defaultProfile);
  const [routineResults, setRoutineResults] = usePersistentState(STORAGE_KEYS.routine, []);
  const [recentlyViewed, setRecentlyViewed] = usePersistentState(STORAGE_KEYS.recent, []);
  const canonicalCart = useMemo(() => resolveCart(cart), [cart]);
  const value = useMemo(() => ({
    cart: canonicalCart, wishlist, orders, profile, routineResults, recentlyViewed,
    setOrders, setProfile, setRoutineResults,
    addToCart(selection) { setCart((items) => { const product = resolveProductSelection(selection, selection.variantId); if (!product) return items; const stock = product.stock ?? 24; if (stock <= 0) return items; const found = items.find((item) => (item.cartId || String(item.id)) === product.cartId); return found ? items.map((item) => (item.cartId || String(item.id)) === product.cartId ? { ...product, quantity: Math.min(item.quantity + 1, stock) } : item) : [...items, { ...product, quantity: 1 }]; }); },
    updateQuantity(id, delta) { setCart((items) => items.map((item) => { if ((item.cartId || String(item.id)) !== String(id)) return item; const canonical = resolveProductSelection(item, item.variantId) || item; return { ...canonical, quantity: Math.min(item.quantity + delta, canonical.stock ?? 24) }; }).filter((item) => item.quantity > 0)); },
    removeFromCart(id) { setCart((items) => items.filter((item) => (item.cartId || String(item.id)) !== String(id))); },
    clearCart() { setCart([]); },
    toggleWishlist(id) { setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); },
    addRecentlyViewed(id) { setRecentlyViewed((items) => [id, ...items.filter((item) => item !== id)].slice(0, 6)); },
  }), [canonicalCart, orders, profile, recentlyViewed, routineResults, wishlist, setCart, setOrders, setProfile, setRecentlyViewed, setRoutineResults, setWishlist]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
};
