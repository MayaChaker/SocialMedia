import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Close, Star } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { money } from "../../lib/money";
import { OUT_OF_STOCK_IDS } from "../../data/merchandising";
import { useCommerce } from "../../hooks/useCommerce";
import ProductVisual from "./ProductVisual";
import WishlistButton from "../wishlist/WishlistButton";

export default function ProductCard({ product, onAdded, shopLayout = false }) {
  const { addToCart } = useCommerce();
  const [preview, setPreview] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [actionState, setActionState] = useState("idle");
  const previewRef = useRef(null);
  const quickViewRef = useRef(null);
  const addingTimerRef = useRef(null);
  const resetTimerRef = useRef(null);
  const selected = useMemo(() => product.variants?.find((variant) => variant.id === selectedId), [product.variants, selectedId]);
  const display = selected ? { ...product, ...selected, selectedVariant: selected.name, variantId: selected.id } : product;
  const outOfStock = OUT_OF_STOCK_IDS.includes(product.id) || selected?.stock === 0;
  const needsShade = Boolean(product.variants && !selected);
  const productHref = `/product/${product.slug}${selected ? `?variant=${selected.id}` : ""}`;

  useEffect(() => {
    if (!preview) return undefined;
    const trigger = quickViewRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = previewRef.current;
    const focusable = () => dialog?.querySelectorAll('a,button:not([disabled]),[tabindex]:not([tabindex="-1"])');
    requestAnimationFrame(() => focusable()?.[0]?.focus());
    const onKey = (event) => {
      if (event.key === "Escape") setPreview(false);
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (!nodes?.length) return;
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKey); trigger?.focus(); };
  }, [preview]);

  useEffect(() => () => {
    window.clearTimeout(addingTimerRef.current);
    window.clearTimeout(resetTimerRef.current);
  }, []);

  const add = () => {
    if (outOfStock || needsShade || actionState === "adding") return;
    setActionState("adding");
    addToCart({ ...display, productId: product.id, cartId: selected ? `${product.id}:${selected.id}` : String(product.id) });
    addingTimerRef.current = window.setTimeout(() => {
      setActionState("added");
      onAdded?.();
      resetTimerRef.current = window.setTimeout(() => setActionState("idle"), 1600);
    }, 180);
  };

  const swatches = <div className="cardSwatches" role="group" aria-label={`Choose a shade for ${product.name}`}>
    {product.variants?.map((variant) => <button key={variant.id} type="button" className={selectedId === variant.id ? "selected" : ""} style={{ "--swatch": variant.color }} onClick={() => setSelectedId(variant.id)} aria-label={`Select ${variant.name} shade${variant.stock === 0 ? ", out of stock" : ""}`} aria-pressed={selectedId === variant.id} disabled={variant.stock === 0} title={`${variant.name}${variant.stock === 0 ? " — Out of stock" : ""}`}><span />{selectedId === variant.id && <Check aria-hidden="true"/>}</button>)}
  </div>;

  const actionLabel = outOfStock ? "Out of stock" : needsShade ? "Choose shade" : actionState === "adding" ? "Adding…" : actionState === "added" ? "Added" : "Add to bag";

  return <>
    <motion.article className={`productCard ${outOfStock ? "soldOut" : ""}`} whileHover={{ y: -2 }} transition={{ duration: .2 }}>
      <div className={`productImage ${product.color}`}>
        {(outOfStock || product.badge) && <span className="productBadge">{outOfStock ? "Out of stock" : product.badge}</span>}
        <WishlistButton productId={product.id} productName={product.name}/>
        <Link to={productHref} className="visualLink" aria-label={`View ${product.name}${selected ? ` in ${selected.name}` : ""}`}><ProductVisual type={product.type} product={display}/></Link>
        <button ref={quickViewRef} className="quickView" onClick={() => setPreview(true)}>Quick view</button>
      </div>
      {shopLayout ? <>
        <div className="productMeta">{product.category}</div>
        <div className="productInfo shopProductInfo">
        <Link className="productNameLink" to={productHref}><h3>{product.name}</h3></Link>
        {product.rating && product.reviews ? <div className="cardRating" aria-label={`${product.rating} out of 5 stars from ${product.reviews} reviews`}><Star/><span>{product.rating} <small>({product.reviews} reviews)</small></span></div> : <div className="cardRating neutral">Not yet rated</div>}
        <p>{product.note}</p>
        <div className="cardPrice"><strong>{money(display.price)}</strong>{product.originalPrice && <del>{money(product.originalPrice)}</del>}</div>
        <div className="cardVariantInfo">{product.variants ? <>Selected shade: <strong>{selected?.name || "Choose a shade"}</strong></> : product.size}</div>
        </div>
        <div className="cardOptions">{product.variants && swatches}</div>
      </> : <>
        <div className="productMeta"><span>{product.category} · {product.brand.replace("Veloura ", "")}</span><div className="cardRating" aria-label={`${product.rating} out of 5 stars`}><Star/> {product.rating} <small>({product.reviews})</small></div></div>
        <div className="productInfo"><div><Link to={productHref}><h3>{product.name}</h3></Link><p>{product.note}</p><small>{selected ? `Shade: ${selected.name}` : product.size}</small></div><div className="price"><span>{money(display.price)}</span>{product.originalPrice && <del>{money(product.originalPrice)}</del>}</div></div>
        {product.variants && swatches}
      </>}
      <button className={`addButton ripple ${actionState === "added" ? "added" : ""}`} disabled={outOfStock || needsShade || actionState === "adding"} onClick={add}>{actionState === "added" && <Check/>}{actionLabel}</button>
      <span className="srOnly" aria-live="polite">{actionState === "added" ? `${product.name}${selected ? ` in ${selected.name}` : ""} added to bag` : ""}</span>
    </motion.article>
    <AnimatePresence>{preview && <motion.div className="previewOverlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setPreview(false)}><motion.section ref={previewRef} className="quickPreview" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby={`preview-title-${product.id}`} aria-describedby={`preview-description-${product.id}`}><button className="previewClose" onClick={() => setPreview(false)} aria-label="Close preview"><Close/></button><div className={`previewVisual ${product.color}`}><ProductVisual type={product.type} product={display}/></div><div><span className="kicker">{product.brand}</span><h2 id={`preview-title-${product.id}`}>{product.name}</h2>{product.rating && product.reviews && <div className="rating"><Star/> {product.rating}<span>{product.reviews} reviews</span></div>}<p id={`preview-description-${product.id}`}>{product.description}</p>{product.variants && <p className="previewShade">Selected shade: <strong>{selected?.name || "Choose a shade"}</strong></p>}{product.variants && swatches}<button className="button dark full" disabled={outOfStock || needsShade || actionState === "adding"} onClick={add}>{actionState === "adding" ? "Adding…" : actionState === "added" ? "Added" : outOfStock ? "Out of stock" : needsShade ? "Choose shade" : `Add to bag · ${money(display.price)}`}</button><Link className="textLink" to={productHref}>See full details</Link></div></motion.section></motion.div>}</AnimatePresence>
  </>;
}
