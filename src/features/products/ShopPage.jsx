import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Close, Tune } from "@mui/icons-material";
import { productRepository } from "../../repositories/productRepository";
import { useModalDialog } from "../../hooks/useModalDialog";
import NotFoundPage from "../../pages/NotFoundPage";
import ProductCard from "./ProductCard";
import { filterAndSortProducts } from "./shopLogic";

const concerns = [
  "Dehydration",
  "Dullness",
  "Sensitive skin",
  "Natural coverage",
  "Travel",
  "Gifting",
];
const CATEGORIES = ["skincare", "makeup", "sets"];
const FILTER_KEYS = ["concern", "price", "stock"];
const catalogue = productRepository.getAll();

export default function ShopPage({ openCart }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Every filter lives in the URL, so results survive a refresh and can be shared.
  const [params, setParams] = useSearchParams();
  const query = params.get("search") || "";
  const collection = params.get("collection") || "";
  const concern = params.get("concern") || "";
  const underFifty = params.get("price") === "under-50";
  const inStock = params.get("stock") === "in";
  const sort = params.get("sort") || "featured";

  const setParam = (key, value) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  const setConcern = (value) => setParam("concern", value);
  const setUnderFifty = (enabled) => setParam("price", enabled ? "under-50" : "");
  const setInStock = (enabled) => setParam("stock", enabled ? "in" : "");
  const setSort = (value) => setParam("sort", value === "featured" ? "" : value);

  /** Switches category while keeping the shopper's filters and search. */
  const goToCategory = (value) => {
    const next = new URLSearchParams(params);
    next.delete("collection");
    if (value === "new") next.set("collection", "new");
    const path = CATEGORIES.includes(value) ? `/shop/${value}` : "/shop";
    const search = next.toString();
    navigate(search ? `${path}?${search}` : path);
  };

  const products = useMemo(
    () =>
      filterAndSortProducts(catalogue, {
        category,
        collection,
        query,
        concern,
        underFifty,
        inStock,
        sort,
      }),
    [category, collection, query, concern, underFifty, inStock, sort],
  );
  const filterCount = Number(Boolean(concern)) + Number(underFifty) + Number(inStock);
  const activeCategory = collection === "new" ? "new" : category || "all";

  useModalDialog(filtersOpen, drawerRef, () => setFiltersOpen(false));

  if (category && !CATEGORIES.includes(category.toLowerCase())) return <NotFoundPage />;

  const clearFilters = () =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        FILTER_KEYS.forEach((key) => next.delete(key));
        return next;
      },
      { replace: true },
    );
  const clearSearch = () => setParam("search", "");
  const clearCategory = () => goToCategory("all");
  const clearAll = () => navigate("/shop");

  return (
    <main className="shopPage">
      <section className="shopToolbar" aria-label="Shop controls">
        <div className="shopCount" aria-live="polite">
          <strong>{products.length}</strong> {products.length === 1 ? "product" : "products"}
          {query && <span> for “{query}”</span>}
        </div>
        <div className="shopControls">
          <label className="toolbarSelect">
            <span>Category</span>
            <select value={activeCategory} onChange={(event) => goToCategory(event.target.value)}>
              <option value="all">All products</option>
              <option value="skincare">Skincare</option>
              <option value="makeup">Makeup</option>
              <option value="sets">Sets</option>
              <option value="new">New arrivals</option>
            </select>
          </label>
          <button
            onClick={() => setFiltersOpen(true)}
            aria-expanded={filtersOpen}
            aria-controls="shopFilters"
          >
            <Tune /> Filter{filterCount ? ` (${filterCount})` : ""}
          </button>
          <label className="toolbarSelect">
            <span>Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </label>
        </div>
      </section>
      {(activeCategory !== "all" || filterCount > 0 || query) && (
        <div className="activeFilters" aria-label="Active filters">
          {activeCategory !== "all" && (
            <button onClick={clearCategory}>
              {activeCategory === "new" ? "New arrivals" : activeCategory}
              <Close aria-hidden="true" />
            </button>
          )}
          {query && (
            <button onClick={clearSearch}>
              Search: “{query}”<Close aria-hidden="true" />
            </button>
          )}
          {concern && (
            <button onClick={() => setConcern("")}>
              {concern}
              <Close aria-hidden="true" />
            </button>
          )}
          {underFifty && (
            <button onClick={() => setUnderFifty(false)}>
              Under $50
              <Close aria-hidden="true" />
            </button>
          )}
          {inStock && (
            <button onClick={() => setInStock(false)}>
              In stock
              <Close aria-hidden="true" />
            </button>
          )}
          <button className="clearFilter" onClick={clearAll}>
            Clear all
          </button>
        </div>
      )}
      <button
        className={`filterOverlay ${filtersOpen ? "open" : ""}`}
        onClick={() => setFiltersOpen(false)}
        aria-label="Close filters"
        tabIndex={filtersOpen ? 0 : -1}
      />
      <aside
        ref={drawerRef}
        id="shopFilters"
        className={`filterDrawer ${filtersOpen ? "open" : ""}`}
        aria-hidden={!filtersOpen}
        aria-modal="true"
        role="dialog"
        aria-labelledby="filter-title"
      >
        <header>
          <div>
            <span className="kicker">Refine</span>
            <h2 id="filter-title">Filters</h2>
          </div>
          <button aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
            <Close />
          </button>
        </header>
        <div className="filterDrawerBody">
          <fieldset>
            <legend>Shop by concern</legend>
            {concerns.map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="concern"
                  checked={concern === item}
                  onChange={() => setConcern(item)}
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
                onChange={(event) => setUnderFifty(event.target.checked)}
              />
              <span>Under $50</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={inStock}
                onChange={(event) => setInStock(event.target.checked)}
              />
              <span>In stock</span>
            </label>
          </fieldset>
        </div>
        <footer>
          <button className="textLink" onClick={clearFilters}>
            Clear
          </button>
          <button className="button dark" onClick={() => setFiltersOpen(false)}>
            Show {products.length} {products.length === 1 ? "product" : "products"}
          </button>
        </footer>
      </aside>
      {products.length ? (
        <div className="productGrid shopGrid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdded={openCart} shopLayout />
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <span className="kicker">Nothing here yet</span>
          <h2>{query ? `No products found for “${query}”` : "No products match"}</h2>
          <p>Try another category, search, or remove the active filters.</p>
          <button className="button dark" onClick={clearAll}>
            View all products
          </button>
        </div>
      )}
    </main>
  );
}
