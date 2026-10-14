import { useRef } from "react";
import { Close } from "@mui/icons-material";
import { useModalDialog } from "../../hooks/useModalDialog";
import type { ShopFilterControls } from "./useShopFilters";

const CONCERNS = [
  "Dehydration",
  "Dullness",
  "Breakouts",
  "Sensitive skin",
  "Natural coverage",
  "Long wear",
  "Floral",
  "Fresh",
  "Woody",
];

interface FilterDrawerProps {
  shop: ShopFilterControls;
  open: boolean;
  resultCount: number;
  onClose: () => void;
}

/** Side drawer with concern, price and stock filters. Always mounted so it can slide in. */
export default function FilterDrawer({ shop, open, resultCount, onClose }: FilterDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const { concern, underFifty, inStock } = shop.filters;
  useModalDialog(open, drawerRef, onClose);

  return (
    <>
      <button
        className={`filterOverlay ${open ? "open" : ""}`}
        onClick={onClose}
        aria-label="Close filters"
        tabIndex={open ? 0 : -1}
      />
      <aside
        ref={drawerRef}
        id="shopFilters"
        className={`filterDrawer ${open ? "open" : ""}`}
        aria-hidden={!open}
        aria-modal="true"
        role="dialog"
        aria-labelledby="filter-title"
      >
        <header>
          <div>
            <span className="kicker">Refine</span>
            <h2 id="filter-title">Filters</h2>
          </div>
          <button aria-label="Close filters" onClick={onClose}>
            <Close />
          </button>
        </header>
        <div className="filterDrawerBody">
          <fieldset>
            <legend>Shop by concern</legend>
            {CONCERNS.map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="concern"
                  checked={concern === item}
                  onChange={() => shop.setConcern(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Price and availability</legend>
            <label>
              <input
                type="checkbox"
                checked={underFifty}
                onChange={(event) => shop.setUnderFifty(event.target.checked)}
              />
              <span>Under $50</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={inStock}
                onChange={(event) => shop.setInStock(event.target.checked)}
              />
              <span>In stock</span>
            </label>
          </fieldset>
        </div>
        <footer>
          <button className="textLink" onClick={shop.clearFilters}>
            Clear
          </button>
          <button className="button dark" onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? "product" : "products"}
          </button>
        </footer>
      </aside>
    </>
  );
}
