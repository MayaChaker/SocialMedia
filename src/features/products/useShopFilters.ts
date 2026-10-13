import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "./shopLogic";

const FILTER_KEYS = ["concern", "price", "stock"];

const withQuery = (path: string, next: URLSearchParams) => {
  const search = next.toString();
  return search ? `${path}?${search}` : path;
};

/**
 * Shop filters stored in the URL, so results survive a refresh and can be shared.
 * Filter changes replace the URL in place; switching category pushes a new entry.
 */
export function useShopFilters(category?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const query = params.get("search") || "";
  const collection = params.get("collection") || "";
  const concern = params.get("concern") || "";
  const underFifty = params.get("price") === "under-50";
  const inStock = params.get("stock") === "in";
  const sort = params.get("sort") || "featured";

  const updateParams = (change: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    change(next);
    router.replace(withQuery(pathname, next), { scroll: false });
  };
  const setParam = (key: string, value: string) =>
    updateParams((next) => (value ? next.set(key, value) : next.delete(key)));

  /** Switches category while keeping the shopper's filters and search. */
  const goToCategory = (value: string) => {
    const next = new URLSearchParams(params);
    next.delete("collection");
    if (value === "new") next.set("collection", "new");
    const path = CATEGORIES.includes(value) ? `/shop/${value}` : "/shop";
    router.push(withQuery(path, next));
  };

  return {
    filters: { category, collection, query, concern, underFifty, inStock, sort },
    /** Number of drawer filters in use (concern, price, stock). */
    filterCount: Number(Boolean(concern)) + Number(underFifty) + Number(inStock),
    activeCategory: collection === "new" ? "new" : category || "all",
    setConcern: (value: string) => setParam("concern", value),
    setUnderFifty: (enabled: boolean) => setParam("price", enabled ? "under-50" : ""),
    setInStock: (enabled: boolean) => setParam("stock", enabled ? "in" : ""),
    setSort: (value: string) => setParam("sort", value === "featured" ? "" : value),
    clearSearch: () => setParam("search", ""),
    clearFilters: () => updateParams((next) => FILTER_KEYS.forEach((key) => next.delete(key))),
    clearAll: () => router.push("/shop"),
    goToCategory,
  };
}

export type ShopFilterControls = ReturnType<typeof useShopFilters>;
