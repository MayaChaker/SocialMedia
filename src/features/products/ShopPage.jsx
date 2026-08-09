import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Close, Tune } from "@mui/icons-material";
import { PRODUCTS } from "../../data/products";
import ProductCard from "./ProductCard";

const concerns = ["Dehydration", "Dullness", "Sensitivity", "Natural coverage", "Travel", "Gifting"];

export default function ShopPage({ openCart }) {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get("search") || "";
  const collection = params.get("collection") || "";
  const [sort, setSort] = useState("featured");
  const [concern, setConcern] = useState(params.get("concern") || "");
  const [underFifty, setUnderFifty] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const products = useMemo(() => {
    const filtered = PRODUCTS
      .filter((product) => !category || product.category.toLowerCase() === category.toLowerCase())
      .filter((product) => collection !== "new" || product.isNew)
      .filter((product) => collection !== "bestsellers" || product.isBestseller)
      .filter((product) => !query || `${product.name} ${product.brand} ${product.note} ${product.category}`.toLowerCase().includes(query.toLowerCase()))
      .filter((product) => !concern || product.matches.includes(concern))
      .filter((product) => !underFifty || product.price < 50);
    return [...filtered].sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "newest" ? Number(b.isNew) - Number(a.isNew) || b.id - a.id : Number(b.isBestseller) - Number(a.isBestseller) || a.id - b.id);
  }, [category, collection, query, concern, underFifty, sort]);

  const clearFilters = () => { setConcern(""); setUnderFifty(false); };
  const activeCategory = collection === "new" ? "new" : category || "all";
  const categoryRoutes = { all: "/shop", skincare: "/shop/skincare", makeup: "/shop/makeup", sets: "/shop/sets", new: "/shop?collection=new" };

  return <main className="shopPage">
    <section className="shopToolbar" aria-label="Shop controls">
      <div className="shopCount" aria-live="polite"><strong>{products.length}</strong> products</div>
      <div className="shopControls">
        <label className="toolbarSelect"><span>Category</span><select value={activeCategory} onChange={(event) => navigate(categoryRoutes[event.target.value])}><option value="all">All products</option><option value="skincare">Skincare</option><option value="makeup">Makeup</option><option value="sets">Sets</option><option value="new">New arrivals</option></select></label>
        <button onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen} aria-controls="shopFilters"><Tune/> Filter{(concern || underFifty) ? " · Active" : ""}</button>
        <label className="toolbarSelect"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select></label>
      </div>
    </section>
    {(concern || underFifty) && <div className="activeFilters" aria-label="Active filters">{concern && <button onClick={() => setConcern("")}>{concern}<Close/></button>}{underFifty && <button onClick={() => setUnderFifty(false)}>Under $50<Close/></button>}<button className="clearFilter" onClick={clearFilters}>Clear all</button></div>}
    <button className={`filterOverlay ${filtersOpen ? "open" : ""}`} onClick={() => setFiltersOpen(false)} aria-label="Close filters" tabIndex={filtersOpen ? 0 : -1}/>
    <aside id="shopFilters" className={`filterDrawer ${filtersOpen ? "open" : ""}`} aria-hidden={!filtersOpen}><header><div><span className="kicker">Refine</span><h2>Filters</h2></div><button aria-label="Close filters" onClick={() => setFiltersOpen(false)}><Close/></button></header><fieldset><legend>Shop by concern</legend>{concerns.map((item) => <label key={item}><input type="radio" name="concern" checked={concern === item} onChange={() => setConcern(item)}/><span>{item}</span></label>)}</fieldset><fieldset><legend>Price</legend><label><input type="checkbox" checked={underFifty} onChange={(event) => setUnderFifty(event.target.checked)}/><span>Under $50</span></label></fieldset><footer><button className="textLink" onClick={clearFilters}>Clear</button><button className="button dark" onClick={() => setFiltersOpen(false)}>Show {products.length} products</button></footer></aside>
    {products.length ? <div className="productGrid shopGrid">{products.map((product) => <ProductCard key={product.id} product={product} onAdded={openCart} shopLayout/>)}</div> : <div className="emptyState"><span className="kicker">Nothing here yet</span><h2>No products match</h2><p>Try another category or clear the active filters.</p><button className="button dark" onClick={clearFilters}>Clear filters</button></div>}
  </main>;
}
