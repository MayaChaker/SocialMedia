import { Link } from "react-router-dom";
import { PRODUCTS } from "../../data/products";
import { useStore } from "../../hooks/useStore";
import ProductCard from "../products/ProductCard";
export default function WishlistPage({openCart}){const {wishlist}=useStore();const products=PRODUCTS.filter(p=>wishlist.includes(p.id));return <main className="wishlistPage"><span className="kicker">Saved for later</span><h1>Your wishlist</h1>{products.length?<div className="productGrid">{products.map(p=><ProductCard key={p.id} product={p} onAdded={openCart}/>)}</div>:<div className="emptyState"><h2>Your edit is empty.</h2><p>Save products you want to return to.</p><Link className="button dark" to="/shop">Discover the collection</Link></div>}</main>}
