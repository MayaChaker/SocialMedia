import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, Star } from "@mui/icons-material";
import { PRODUCTS, money, productBySlug } from "../../data/products";
import { useStore } from "../../hooks/useStore";
import ProductVisual from "./ProductVisual";
import ProductCard from "./ProductCard";
import WishlistButton from "../wishlist/WishlistButton";

export default function ProductPage({ openCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const product = productBySlug(slug);
  const requestedVariant = new URLSearchParams(location.search).get("variant");
  const initialVariant = product?.variants?.some((variant) => variant.id === requestedVariant) ? requestedVariant : product?.variants?.[0]?.id || "";
  const [selectedId, setSelectedId] = useState(initialVariant);
  const { addToCart, addRecentlyViewed, recentlyViewed, profile } = useStore();
  useEffect(() => { if (product) addRecentlyViewed(product.id); }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextVariant = product?.variants?.some((variant) => variant.id === requestedVariant) ? requestedVariant : product?.variants?.[0]?.id || "";
    setSelectedId(nextVariant);
  }, [product?.id, requestedVariant]); // eslint-disable-line react-hooks/exhaustive-deps
  const selected = product?.variants?.find((variant) => variant.id === selectedId) || product?.variants?.[0];
  const display = selected ? { ...product, ...selected, name: product.name, selectedVariant: selected.name, variantId: selected.id } : product;
  const related = useMemo(() => product ? PRODUCTS.filter((item) => item.id !== product.id && (item.category === product.category || product.matches.some((match) => item.matches.includes(match)))).slice(0, 3) : [], [product]);
  if (!product) return <main className="emptyState"><h1>Product not found</h1><Link className="button dark" to="/shop">Return to shop</Link></main>;
  const recent = recentlyViewed.filter((id) => id !== product.id).map((id) => PRODUCTS.find((item) => item.id === id)).filter(Boolean).slice(0, 3);
  const profileMatches = product.matches.filter((match) => [...profile.skinGoals, ...profile.preferences].includes(match));
  const add = () => { addToCart({ ...display, productId: product.id, cartId: selected ? `${product.id}:${selected.id}` : String(product.id) }); openCart(); };
  return <main className={`productPage ${product.slug === "petal-skin-tint" ? "shadeProductPage" : ""}`}><button className="backLink" onClick={() => navigate(-1)}>← Back to collection</button><section className="productDetail"><div className="productGallery"><div className={`detailVisual ${product.color}`}><ProductVisual type={product.type} product={display}/>{product.badge && <span className="detailBadge">{product.badge}</span>}</div><div className="galleryDetails"><div><span>Texture</span><strong>{product.texture}</strong></div><div><span>Finish</span><strong>{product.finish}</strong></div></div></div><div className="detailCopy"><div className="detailTopline"><span className="kicker">{product.brand}</span><WishlistButton productId={product.id} productName={product.name}/></div><h1>{product.name}</h1><p className="detailNote">{product.note}</p><div className="rating"><Star/> {product.rating} <span>{product.reviews} verified reviews</span></div><div className="detailPrice">{money(display.price)} <small>{product.size}</small></div><p className="description">{product.description}</p>{product.variants && <div className="detailVariants"><span>Shade: <strong>{selected.name}</strong></span><div className="cardSwatches" role="group" aria-label={`Choose a shade for ${product.name}`}>{product.variants.map((variant) => <button type="button" key={variant.id} className={selectedId === variant.id ? "selected" : ""} style={{"--swatch":variant.color}} onClick={() => setSelectedId(variant.id)} aria-label={`Select ${variant.name} shade`} aria-pressed={selectedId === variant.id}><span/></button>)}</div></div>}<button className="button dark full ripple" onClick={add}>Add to bag · {money(display.price)}</button><div className="matchPanel"><Check/><div><strong>Why it matches you</strong><p>{profileMatches.length ? `Matches your ${profileMatches.join(" and ").toLowerCase()} preferences.` : `A versatile fit for your ${profile.skinType.toLowerCase()} skin profile.`}</p></div></div><div className="detailFacts"><div><span>Benefits</span><ul>{product.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></div><div><span>Key ingredients</span><p>{product.ingredients}</p></div><div><span>How to use</span><p>{product.ritual}</p></div><div><span>Usage order</span><p>{product.order}</p></div></div></div></section><ProductShelf title="Pairs well with" eyebrow="Complete the ritual" products={related} openCart={openCart} shelf="related"/>{recent.length > 0 && <ProductShelf title="Recently viewed" eyebrow="Continue exploring" products={recent} openCart={openCart} shelf="recent"/>}</main>;
}

function ProductShelf({ title, eyebrow, products, openCart, shelf }) { return <section className={`recommendations ${shelf}Shelf`}><div className="sectionHeader"><div><span className="kicker">{eyebrow}</span><h2>{title}</h2></div></div><div className="productGrid">{products.map((product) => <ProductCard key={product.id} product={product} onAdded={openCart}/>)}</div></section>; }
