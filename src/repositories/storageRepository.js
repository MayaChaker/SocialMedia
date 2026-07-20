const PREFIX = "velouraBeauty";
export const STORAGE_KEYS = Object.freeze({ cart: "cart.v2", wishlist: "wishlist.v1", orders: "orders.v1", profile: "beautyProfile.v1", routine: "routineResults.v1", theme: "theme.v1", recent: "recentlyViewed.v1", search: "searchHistory.v1" });
export const storageRepository = {
  read(key, fallback) { try { const raw = window.localStorage.getItem(`${PREFIX}.${key}`); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } },
  write(key, value) { try { window.localStorage.setItem(`${PREFIX}.${key}`, JSON.stringify(value)); } catch {} },
  remove(key) { try { window.localStorage.removeItem(`${PREFIX}.${key}`); } catch {} },
};
