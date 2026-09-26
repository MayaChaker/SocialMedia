import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Close, Tune } from "@mui/icons-material";
import { PRODUCTS } from "../../data/products";
import ProductCard from "./ProductCard";
import { filterAndSortProducts } from "./shopLogic";

const concerns = ["Dehydration", "Dullness", "Sensitivity", "Natural coverage", "Travel", "Gifting"];
const categoryRoutes = { all: "/shop", skincare: "/shop/skincare", makeup: "/shop/makeup", sets: "/shop/sets", new: "/shop?collection=new" };

export default function ShopPage({ openCart }) {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const filterButtonRef = useRef(null);
  const params = new URLSearchParams(location.search);
  const query = params.get("search") || "";
  const collection = params.get("collection") || "";
  const [sort, setSort] = useState("featured");
  const [concern, setConcern] = useState(params.get("concern") || "");
  const [underFifty, setUnderFifty] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const products = useMemo(() => filterAndSortProducts(PRODUCTS, { category, collection, query, concern, underFifty, inStock, sort }), [category, collection, query, concern, underFifty, inStock, sort]);
  const filterCount = Number(Boolean(concern)) + Number(underFifty) + Number(inStock);
  const activeCategory = collection === "new" ? "new" : category || "all";

  useEffect(() => {
    if (!filtersOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const trigger = filterButtonRef.current;
    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    const focusable = () => drawer?.querySelectorAll('button,input,select,[href],[tabindex]:not([tabindex="-1"])');
    requestAnimationFrame(() => focusable()?.[0]?.focus());
    const onKey = (event) => {
      if (event.key === "Escape") setFiltersOpen(false);
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (!nodes?.length) return;
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKey); trigger?.focus(); };
  }, [filtersOpen]);

  const clearFilters = () => { setConcern(""); setUnderFifty(false); setInStock(false); };
  const clearSearch = () => navigate(category ? `/shop/${category}` : "/shop");
  const clearCategory = () => navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  const clearAll = () => { clearFilters(); navigate("/shop"); };

  return <main className="shopPage">
    <section className="shopToolbar" aria-label="Shop controls">
      <div className="shopCount" aria-live="polite"><strong>{products.length}</strong> {products.length === 1 ? "product" : "products"}{query && <span> for “{query}”</span>}</div>
      <div className="shopControls">
        <label className="toolbarSelect"><span>Category</span><select value={activeCategory} onChange={(event) => navigate(categoryRoutes[event.target.value])}><option value="all">All products</option><option value="skincare">Skincare</option><option value="makeup">Makeup</option><option value="sets">Sets</option><option value="new">New arrivals</option></select></label>
        <button ref={filterButtonRef} onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen} aria-controls="shopFilters"><Tune/> Filter{filterCount ? ` (${filterCount})` : ""}</button>
        <label className="toolbarSelect"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select></label>
      </div>
    </section>
    {(activeCategory !== "all" || filterCount > 0 || query) && <div className="activeFilters" aria-label="Active filters">
      {activeCategory !== "all" && <button onClick={clearCategory}>{activeCategory === "new" ? "New arrivals" : activeCategory}<Close aria-hidden="true"/></button>}
      {query && <button onClick={clearSearch}>Search: “{query}”<Close aria-hidden="true"/></button>}
      {concern && <button onClick={() => setConcern("")}>{concern}<Close aria-hidden="true"/></button>}
      {underFifty && <button onClick={() => setUnderFifty(false)}>Under $50<Close aria-hidden="true"/></button>}
      {inStock && <button onClick={() => setInStock(false)}>In stock<Close aria-hidden="true"/></button>}
      <button className="clearFilter" onClick={clearAll}>Clear all</button>
    </div>}
    <button className={`filterOverlay ${filtersOpen ? "open" : ""}`} onClick={() => setFiltersOpen(false)} aria-label="Close filters" tabIndex={filtersOpen ? 0 : -1}/>
    <aside ref={drawerRef} id="shopFilters" className={`filterDrawer ${filtersOpen ? "open" : ""}`} aria-hidden={!filtersOpen} aria-modal="true" role="dialog" aria-labelledby="filter-title"><header><div><span className="kicker">Refine</span><h2 id="filter-title">Filters</h2></div><button aria-label="Close filters" onClick={() => setFiltersOpen(false)}><Close/></button></header><div className="filterDrawerBody"><fieldset><legend>Shop by concern</legend>{concerns.map((item) => <label key={item}><input type="radio" name="concern" checked={concern === item} onChange={() => setConcern(item)}/><span>{item}</span></label>)}</fieldset><fieldset><legend>Price and availability</legend><label><input type="checkbox" checked={underFifty} onChange={(event) => setUnderFifty(event.target.checked)}/><span>Under $50</span></label><label><input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)}/><span>In stock</span></label></fieldset></div><footer><button className="textLink" onClick={clearFilters}>Clear</button><button className="button dark" onClick={() => setFiltersOpen(false)}>Show {products.length} {products.length === 1 ? "product" : "products"}</button></footer></aside>
    {products.length ? <div className="productGrid shopGrid">{products.map((product) => <ProductCard key={product.id} product={product} onAdded={openCart} shopLayout/>)}</div> : <div className="emptyState"><span className="kicker">Nothing here yet</span><h2>{query ? `No products found for “${query}”` : "No products match"}</h2><p>Try another category, search, or remove the active filters.</p><button className="button dark" onClick={clearAll}>View all products</button></div>}
  </main>;
}
