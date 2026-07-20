import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, Star } from "@mui/icons-material";
import { PRODUCTS, money, productBySlug } from "../../data/products";
import { useStore } from "../../hooks/useStore";
import ProductVisual from "./ProductVisual";
import ProductCard from "./ProductCard";
import WishlistButton from "../wishlist/WishlistButton";

export default function ProductPage({ openCart }) {
  const { slug } = useParams(); const navigate = useNavigate(); const product = productBySlug(slug); const { addToCart, addRecentlyViewed, recentlyViewed, profile } = useStore();
  // The product identity is the intentional trigger; store actions are stable for this render cycle.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (product) addRecentlyViewed(product.id); }, [product?.id]);
  if (!product) return <main className="emptyState"><h1>Product not found</h1><Link className="button dark" to="/shop">Return to shop</Link></main>;
  const related = PRODUCTS.filter((item) => item.id !== product.id && (item.category === product.category || product.matches.some((match) => item.matches.includes(match)))).slice(0, 3);
  const recent = recentlyViewed.filter((id) => id !== product.id).map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean).slice(0, 3);
  const profileMatches = product.matches.filter((match) => [...profile.skinGoals, ...profile.preferences].includes(match));
  const add = () => { addToCart(product); openCart(); };
  return <main className="productPage"><button className="backLink" onClick={() => navigate(-1)}>← Back to collection</button><section className="productDetail"><div className="productGallery"><div className={`detailVisual ${product.color}`}><ProductVisual type={product.type}/><span className="detailBadge">{product.badge}</span></div><div className="galleryDetails"><div><span>Texture</span><strong>{product.texture}</strong></div><div><span>Finish</span><strong>{product.finish}</strong></div></div></div><div className="detailCopy"><div className="detailTopline"><span className="kicker">{product.brand}</span><WishlistButton productId={product.id} productName={product.name}/></div><h1>{product.name}</h1><p className="detailNote">{product.note}</p><div className="rating"><Star/> {product.rating} <span>{product.reviews} verified reviews</span></div><div className="detailPrice">{money(product.price)} <small>{product.size}</small></div><p className="description">{product.description}</p><button className="button dark full ripple" onClick={add}>Add to bag · {money(product.price)}</button><div className="matchPanel"><Check/><div><strong>Why it matches you</strong><p>{profileMatches.length ? `Matches your ${profileMatches.join(" and ").toLowerCase()} preferences.` : `A versatile fit for your ${profile.skinType.toLowerCase()} skin profile.`}</p></div></div><div className="detailFacts"><div><span>Benefits</span><ul>{product.benefits.map((benefit)=><li key={benefit}>{benefit}</li>)}</ul></div><div><span>Key ingredients</span><p>{product.ingredients}</p></div><div><span>How to use</span><p>{product.ritual}</p></div><div><span>Usage order</span><p>{product.order}</p></div></div></div></section><section className="reviewSection"><div><span className="kicker">Verified reviews</span><h2>Loved in real rituals.</h2><div className="reviewScore">{product.rating}<span>★★★★★</span><small>Based on {product.reviews} reviews</small></div></div><div className="reviewQuotes"><blockquote>“The texture disappears beautifully and my skin still feels comfortable hours later.”<cite>— Amira, verified buyer</cite></blockquote><blockquote>“Considered, elegant, and genuinely easy to use every day.”<cite>— Lina, verified buyer</cite></blockquote></div></section><ProductShelf title="Pairs well with" eyebrow="Complete the ritual" products={related} openCart={openCart}/>{recent.length > 0 && <ProductShelf title="Recently viewed" eyebrow="Continue exploring" products={recent} openCart={openCart}/>}</main>;
}

function ProductShelf({ title, eyebrow, products, openCart }) { return <section className="recommendations"><div className="sectionHeader"><div><span className="kicker">{eyebrow}</span><h2>{title}</h2></div></div><div className="productGrid">{products.map((product) => <ProductCard key={product.id} product={product} onAdded={openCart}/>)}</div></section>; }
