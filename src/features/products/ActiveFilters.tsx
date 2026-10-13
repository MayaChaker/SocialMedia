import { Close } from "@mui/icons-material";
import type { ShopFilterControls } from "./useShopFilters";

/** Removable chips for every filter in use, plus "Clear all". Hidden when nothing is active. */
export default function ActiveFilters({ shop }: { shop: ShopFilterControls }) {
  const { query, concern, underFifty, inStock } = shop.filters;
  const { activeCategory } = shop;
  if (activeCategory === "all" && shop.filterCount === 0 && !query) return null;

  return (
    <div className="activeFilters" aria-label="Active filters">
      {activeCategory !== "all" && (
        <button onClick={() => shop.goToCategory("all")}>
          {activeCategory === "new" ? "New arrivals" : activeCategory}
          <Close aria-hidden="true" />
        </button>
      )}
      {query && (
        <button onClick={shop.clearSearch}>
          Search: “{query}”<Close aria-hidden="true" />
        </button>
      )}
      {concern && (
        <button onClick={() => shop.setConcern("")}>
          {concern}
          <Close aria-hidden="true" />
        </button>
      )}
      {underFifty && (
        <button onClick={() => shop.setUnderFifty(false)}>
          Under $50
          <Close aria-hidden="true" />
        </button>
      )}
      {inStock && (
        <button onClick={() => shop.setInStock(false)}>
          In stock
          <Close aria-hidden="true" />
        </button>
      )}
      <button className="clearFilter" onClick={shop.clearAll}>
        Clear all
      </button>
    </div>
  );
}
