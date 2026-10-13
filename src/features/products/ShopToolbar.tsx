import { Tune } from "@mui/icons-material";
import type { ShopFilterControls } from "./useShopFilters";

interface ShopToolbarProps {
  shop: ShopFilterControls;
  resultCount: number;
  filtersOpen: boolean;
  onOpenFilters: () => void;
}

/** Result count, category and sort selects, and the button that opens the filter drawer. */
export default function ShopToolbar({
  shop,
  resultCount,
  filtersOpen,
  onOpenFilters,
}: ShopToolbarProps) {
  const { query, sort } = shop.filters;
  return (
    <section className="shopToolbar" aria-label="Shop controls">
      <div className="shopCount" aria-live="polite">
        <strong>{resultCount}</strong> {resultCount === 1 ? "product" : "products"}
        {query && <span> for “{query}”</span>}
      </div>
      <div className="shopControls">
        <label className="toolbarSelect">
          <span>Category</span>
          <select
            value={shop.activeCategory}
            onChange={(event) => shop.goToCategory(event.target.value)}
          >
            <option value="all">All products</option>
            <option value="skincare">Skincare</option>
            <option value="makeup">Makeup</option>
            <option value="sets">Sets</option>
            <option value="new">New arrivals</option>
          </select>
        </label>
        <button onClick={onOpenFilters} aria-expanded={filtersOpen} aria-controls="shopFilters">
          <Tune /> Filter{shop.filterCount ? ` (${shop.filterCount})` : ""}
        </button>
        <label className="toolbarSelect">
          <span>Sort</span>
          <select value={sort} onChange={(event) => shop.setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </label>
      </div>
    </section>
  );
}
