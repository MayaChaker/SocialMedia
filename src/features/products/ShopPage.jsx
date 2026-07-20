import { NavLink, useLocation, useParams } from "react-router-dom";
import { PRODUCTS } from "../../data/products";
import ProductCard from "./ProductCard";
export default function ShopPage({ openCart }) {
  const { category } = useParams(); const query = new URLSearchParams(useLocation().search).get("search") || "";
  const label = category ? category[0].toUpperCase() + category.slice(1) : query ? `Results for “${query}”` : "The collection";
  const products = PRODUCTS.filter((p) => !category || p.category.toLowerCase() === category.toLowerCase()).filter((p) => !query || `${p.name} ${p.brand} ${p.note}`.toLowerCase().includes(query.toLowerCase()));
  const copy = category === "skincare" ? "Barrier-minded daily formulas that reward consistency." : category === "makeup" ? "Skin-first colour with seamless textures and nuanced tones." : category === "sets" ? "Considered pairings for complete rituals and thoughtful gifting." : "A concise wardrobe of skincare and colour, made for real daily rituals.";
  return <main className="shopPage"><header className="shopIntro"><span className="kicker">Veloura Beauty</span><h1>{label}</h1><p>{copy}</p></header><div className="shopToolbar"><span>{products.length} products</span><nav aria-label="Product categories"><NavLink end to="/shop">All</NavLink><NavLink to="/shop/skincare">Skincare</NavLink><NavLink to="/shop/makeup">Makeup</NavLink><NavLink to="/shop/sets">Sets</NavLink></nav></div>{products.length ? <div className="productGrid shopGrid">{products.map((product) => <ProductCard key={product.id} product={product} onAdded={openCart}/>)}</div> : <div className="emptyState"><h2>No formulas found</h2><p>Try another search or browse the full collection.</p><NavLink className="button dark" to="/shop">Shop all</NavLink></div>}</main>;
}
