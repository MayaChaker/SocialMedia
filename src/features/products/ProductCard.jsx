import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Close, Star } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { money } from "../../data/products";
import { OUT_OF_STOCK_IDS } from "../../data/merchandising";
import { useStore } from "../../hooks/useStore";
import ProductVisual from "./ProductVisual";
import WishlistButton from "../wishlist/WishlistButton";

export default function ProductCard({ product, onAdded, shopLayout = false }) {
  const { addToCart } = useStore();
  const [preview, setPreview] = useState(false);
  const [selectedId, setSelectedId] = useState(product.variants?.[0]?.id || "");
  const [added, setAdded] = useState(false);
  const selected = useMemo(() => product.variants?.find((variant) => variant.id === selectedId), [product.variants, selectedId]);
  const display = selected ? { ...product, ...selected, selectedVariant: selected.name, variantId: selected.id } : product;
  const outOfStock = OUT_OF_STOCK_IDS.includes(product.id) || selected?.stock === 0;
  const productHref = `/product/${product.slug}${selected ? `?variant=${selected.id}` : ""}`;

  const add = () => {
    if (outOfStock) return;
    addToCart({ ...display, productId: product.id, cartId: selected ? `${product.id}:${selected.id}` : String(product.id) });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
    onAdded?.();
  };

  const swatches = <div className="cardSwatches" role="group" aria-label={`Choose a shade for ${product.name}`}>
    {product.variants?.map((variant) => <button key={variant.id} type="button" className={selectedId === variant.id ? "selected" : ""} style={{ "--swatch": variant.color }} onClick={() => setSelectedId(variant.id)} aria-label={`Select ${variant.name} shade`} aria-pressed={selectedId === variant.id}><span /></button>)}
  </div>;

  return <>
    <motion.article className={`productCard ${outOfStock ? "soldOut" : ""}`} whileHover={{ y: -2 }} transition={{ duration: .2 }}>
      <div className={`productImage ${product.color}`}>
        {(outOfStock || product.badge) && <span className="productBadge">{outOfStock ? "Out of stock" : product.badge}</span>}
        <WishlistButton productId={product.id} productName={product.name}/>
        <Link to={productHref} className="visualLink" aria-label={`View ${product.name}${selected ? ` in ${selected.name}` : ""}`}><ProductVisual type={product.type} product={display}/></Link>
        <button className="quickView" onClick={() => setPreview(true)}>Quick view</button>
      </div>
      {shopLayout ? <>
        <div className="productMeta">{product.category} · {product.brand.replace("Veloura ", "")}</div>
        <div className="productInfo shopProductInfo">
        <div className="productTitleRow"><Link to={productHref}><h3>{product.name}</h3></Link><div className="price"><span>{money(display.price)}</span>{product.originalPrice && <del>{money(product.originalPrice)}</del>}</div></div>
        <div className="cardRating" aria-label={`${product.rating} out of 5 stars from ${product.reviews} reviews`}><Star/><span>{product.rating} <small>({product.reviews})</small></span></div>
        <p>{product.note}</p>
        <small>{selected ? <>Selected shade: <strong>{selected.name}</strong></> : product.size}</small>
        </div>
        <div className="cardOptions">{product.variants && swatches}</div>
      </> : <>
        <div className="productMeta"><span>{product.category} · {product.brand.replace("Veloura ", "")}</span><div className="cardRating" aria-label={`${product.rating} out of 5 stars`}><Star/> {product.rating} <small>({product.reviews})</small></div></div>
        <div className="productInfo"><div><Link to={productHref}><h3>{product.name}</h3></Link><p>{product.note}</p><small>{selected ? `Shade: ${selected.name}` : product.size}</small></div><div className="price"><span>{money(display.price)}</span>{product.originalPrice && <del>{money(product.originalPrice)}</del>}</div></div>
        {product.variants && swatches}
      </>}
      <button className="addButton ripple" disabled={outOfStock} onClick={add}>{added ? <><Check/> Added</> : outOfStock ? "Notify me" : "Add to bag"}</button>
      <span className="srOnly" aria-live="polite">{added ? `${product.name}${selected ? ` in ${selected.name}` : ""} added to bag` : ""}</span>
    </motion.article>
    <AnimatePresence>{preview && <motion.div className="previewOverlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setPreview(false)}><motion.section className="quickPreview" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${product.name} preview`}><button className="previewClose" onClick={() => setPreview(false)} aria-label="Close preview"><Close/></button><div className={`previewVisual ${product.color}`}><ProductVisual type={product.type} product={display}/></div><div><span className="kicker">{product.brand}</span><h2>{product.name}</h2><div className="rating"><Star/> {product.rating}<span>{product.reviews} verified reviews</span></div><p>{product.description}</p>{selected && <p className="previewShade">Selected shade: <strong>{selected.name}</strong></p>}{product.variants && swatches}<button className="button dark full" disabled={outOfStock} onClick={add}>{outOfStock ? "Out of stock" : `Add to bag · ${money(display.price)}`}</button><Link className="textLink" to={productHref}>See full details</Link></div></motion.section></motion.div>}</AnimatePresence>
  </>;
}
