import { createContext, useContext, useMemo } from "react";
import { STORAGE_KEYS } from "../repositories/storageRepository";
import { usePersistentState } from "./usePersistentState";

const StoreContext = createContext(null);
const defaultProfile = { skinGoals: ["Dehydration", "Dullness"], skinType: "Balanced", preferences: ["Natural coverage", "Sensitive skin"] };

export function StoreProvider({ children }) {
  const [cart, setCart] = usePersistentState(STORAGE_KEYS.cart, []);
  const [wishlist, setWishlist] = usePersistentState(STORAGE_KEYS.wishlist, []);
  const [orders, setOrders] = usePersistentState(STORAGE_KEYS.orders, []);
  const [profile, setProfile] = usePersistentState(STORAGE_KEYS.profile, defaultProfile);
  const [routineResults, setRoutineResults] = usePersistentState(STORAGE_KEYS.routine, []);
  const [theme, setTheme] = usePersistentState(STORAGE_KEYS.theme, "light");
  const [recentlyViewed, setRecentlyViewed] = usePersistentState(STORAGE_KEYS.recent, []);
  const [searchHistory, setSearchHistory] = usePersistentState(STORAGE_KEYS.search, []);
  const value = useMemo(() => ({
    cart, wishlist, orders, profile, routineResults, theme, recentlyViewed, searchHistory,
    setOrders, setProfile, setRoutineResults, setTheme,
    addToCart(product) { setCart((items) => { const found = items.find((item) => item.id === product.id); return found ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]; }); },
    updateQuantity(id, delta) { setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0)); },
    clearCart() { setCart([]); },
    toggleWishlist(id) { setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); },
    addRecentlyViewed(id) { setRecentlyViewed((items) => [id, ...items.filter((item) => item !== id)].slice(0, 6)); },
    addSearch(term) { if (term.trim()) setSearchHistory((items) => [term.trim(), ...items.filter((item) => item !== term.trim())].slice(0, 8)); },
  }), [cart, orders, profile, recentlyViewed, routineResults, searchHistory, theme, wishlist, setCart, setOrders, setProfile, setRecentlyViewed, setRoutineResults, setSearchHistory, setTheme, setWishlist]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
};
