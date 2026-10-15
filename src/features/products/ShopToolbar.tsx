import { Tune } from "@mui/icons-material";
import type { ShopFilterControls } from "./useShopFilters";

interface ShopToolbarProps {
  shop: ShopFilterControls;
  filtersOpen: boolean;
  onOpenFilters: () => void;
}

const TABS = [
  ["all", "All"],
  ["makeup", "Makeup"],
  ["skincare", "Skincare"],
  ["fragrance", "Fragrance"],
  ["hair", "Hair"],
  ["new", "New in"],
] as const;

/** Category tabs, the filter drawer button and the sort select. */
export default function ShopToolbar({ shop, filtersOpen, onOpenFilters }: ShopToolbarProps) {
  const { sort } = shop.filters;
  return (
    <section className="shopToolbar" aria-label="Shop controls">
      <nav className="shopTabs" aria-label="Categories">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            className={shop.activeCategory === value ? "active" : undefined}
            aria-current={shop.activeCategory === value ? "page" : undefined}
            onClick={() => shop.goToCategory(value)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="shopControls">
        <button
          className="shopFilterButton"
          onClick={onOpenFilters}
          aria-expanded={filtersOpen}
          aria-controls="shopFilters"
        >
          <Tune /> Filter{shop.filterCount ? ` (${shop.filterCount})` : ""}
        </button>
        <label className="toolbarSelect">
          <span>Sort</span>
          <select value={sort} onChange={(event) => shop.setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>
    </section>
  );
}
