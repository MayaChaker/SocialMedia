import { useMemo, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { Close, Tune } from "@mui/icons-material";
import { PRODUCTS } from "../../data/products";
import { BESTSELLER_IDS } from "../../data/merchandising";
import ProductCard from "./ProductCard";

const concerns = ["Dehydration", "Dullness", "Sensitivity", "Texture", "Natural coverage", "Travel", "Gifting"];

export default function ShopPage({ openCart }) {
  const { category } = useParams();
  const params = new URLSearchParams(useLocation().search);
  const query = params.get("search") || "";
  const collection = params.get("collection") || "";
  const [sort, setSort] = useState("featured");
  const [concern, setConcern] = useState(params.get("concern") || "");
  const [underFifty, setUnderFifty] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const label = category ? category[0].toUpperCase() + category.slice(1) : query ? `Results for “${query}”` : collection === "new" ? "New arrivals" : collection === "bestsellers" ? "Bestsellers" : "The collection";
  const products = useMemo(() => {
    const filtered = PRODUCTS.filter((p) => !category || p.category.toLowerCase() === category.toLowerCase())
      .filter((p) => collection !== "new" || p.id >= 9)
      .filter((p) => collection !== "bestsellers" || BESTSELLER_IDS.includes(p.id))
      .filter((p) => !query || `${p.name} ${p.brand} ${p.note}`.toLowerCase().includes(query.toLowerCase()))
      .filter((p) => !concern || p.matches.includes(concern))
      .filter((p) => !underFifty || p.price < 50);
    return [...filtered].sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : a.id - b.id);
  }, [category, collection, query, concern, underFifty, sort]);
  const copy = category === "skincare" ? "Barrier-minded daily formulas that reward consistency." : category === "makeup" ? "Skin-first colour with seamless textures and nuanced tones." : category === "sets" ? "Considered pairings for complete rituals and thoughtful gifting." : "A complete wardrobe of skincare and colour, made for real daily rituals.";
  const clearFilters = () => { setConcern(""); setUnderFifty(false); };
  return <main className="shopPage"><header className="shopIntro"><span className="kicker">Veloura Beauty</span><h1>{label}</h1><p>{copy}</p></header><div className="shopToolbar"><span>{products.length} products</span><nav aria-label="Product categories"><NavLink end to="/shop">All</NavLink><NavLink to="/shop/skincare">Skincare</NavLink><NavLink to="/shop/makeup">Makeup</NavLink><NavLink to="/shop/sets">Sets</NavLink></nav><div className="shopControls"><button onClick={() => setFiltersOpen(true)}><Tune/> Filter</button><label><span className="srOnly">Sort products</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="rating">Best rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div></div>{(concern || underFifty) && <div className="activeFilters">{concern && <button onClick={() => setConcern("")}>{concern}<Close/></button>}{underFifty && <button onClick={() => setUnderFifty(false)}>Under $50<Close/></button>}<button className="clearFilter" onClick={clearFilters}>Clear all</button></div>}<div className={`filterOverlay ${filtersOpen ? "open" : ""}`} onClick={() => setFiltersOpen(false)}/><aside className={`filterDrawer ${filtersOpen ? "open" : ""}`} aria-hidden={!filtersOpen}><header><div><span className="kicker">Refine</span><h2>Filters</h2></div><button aria-label="Close filters" onClick={() => setFiltersOpen(false)}><Close/></button></header><fieldset><legend>Shop by concern</legend>{concerns.map((item) => <label key={item}><input type="radio" name="concern" checked={concern === item} onChange={() => setConcern(item)}/><span>{item}</span></label>)}</fieldset><fieldset><legend>Price</legend><label><input type="checkbox" checked={underFifty} onChange={(e) => setUnderFifty(e.target.checked)}/><span>Under $50</span></label></fieldset><footer><button className="textLink" onClick={clearFilters}>Clear</button><button className="button dark" onClick={() => setFiltersOpen(false)}>Show {products.length} products</button></footer></aside>{products.length ? <div className="productGrid shopGrid">{products.map((product) => <ProductCard key={product.id} product={product} onAdded={openCart}/>)}</div> : <div className="emptyState"><h2>No formulas found</h2><p>Try another search or clear your filters.</p><button className="button dark" onClick={clearFilters}>Clear filters</button></div>}</main>;
}
