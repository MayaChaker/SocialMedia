import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Close, Star } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { money } from "../../data/products";
import { OUT_OF_STOCK_IDS, PRODUCT_OPTIONS } from "../../data/merchandising";
import { useStore } from "../../hooks/useStore";
import ProductVisual from "./ProductVisual";
import WishlistButton from "../wishlist/WishlistButton";

export default function ProductCard({ product, onAdded }) {
  const { addToCart } = useStore();
  const [preview, setPreview] = useState(false);
  const [variantOpen, setVariantOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [added, setAdded] = useState(false);
  const options = PRODUCT_OPTIONS[product.id];
  const outOfStock = OUT_OF_STOCK_IDS.includes(product.id);

  const add = () => {
    if (outOfStock) return;
    if (options && !selectedVariant) { setVariantOpen(true); return; }
    addToCart({ ...product, selectedVariant, cartId: selectedVariant ? `${product.id}:${selectedVariant}` : String(product.id) });
    setAdded(true);
    setVariantOpen(false);
    setTimeout(() => setAdded(false), 1600);
    onAdded?.();
  };

  return <>
    <motion.article className={`productCard ${outOfStock ? "soldOut" : ""}`} whileHover={{ y: -3 }} transition={{ duration: .2 }}>
      <div className={`productImage ${product.color}`}>
        <span className="productBadge">{outOfStock ? "Out of stock" : product.badge}</span>
        <WishlistButton productId={product.id} productName={product.name}/>
        <Link to={`/product/${product.slug}`} className="visualLink" aria-label={`View ${product.name}`}><ProductVisual type={product.type} product={product}/></Link>
        <button className="quickView" onClick={() => setPreview(true)}>Quick view</button>
      </div>
      <div className="productMeta"><span>{product.brand}</span><div className="cardRating" aria-label={`${product.rating} out of 5 stars, ${product.reviews} reviews`}><Star/> {product.rating} <small>({product.reviews})</small></div></div>
      <div className="productInfo"><div><Link to={`/product/${product.slug}`}><h3>{product.name}</h3></Link><p>{product.note}</p><small>{options ? `${options.values.length} ${options.label.toLowerCase()}s` : product.size}</small></div><div className="price"><span>{money(product.price)}</span>{product.originalPrice && <del>{money(product.originalPrice)}</del>}</div></div>
      {options && <div className="cardSwatches" aria-label={`${options.label} preview`}>{options.swatches.slice(0,5).map((color,index)=><i key={color} style={{background:color}} title={options.values[index]}/>)}</div>}
      <button className="addButton ripple" disabled={outOfStock} onClick={add}>{added ? <><Check/> Added</> : outOfStock ? "Notify me" : options ? "Choose options" : "Quick add"}</button>
      <AnimatePresence>{variantOpen && <motion.div className="variantPanel" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}><div><strong>Select {options.label.toLowerCase()}</strong><button aria-label="Close options" onClick={()=>setVariantOpen(false)}><Close/></button></div><div className="variantChoices">{options.values.map((value,index)=><button className={selectedVariant===value?"selected":""} key={value} onClick={()=>setSelectedVariant(value)}><i style={{background:options.swatches[index]}}/>{value}</button>)}</div><button className="button dark full" disabled={!selectedVariant} onClick={add}>Add to bag · {money(product.price)}</button></motion.div>}</AnimatePresence>
      <span className="srOnly" aria-live="polite">{added ? `${product.name} added to bag` : ""}</span>
    </motion.article>
    <AnimatePresence>{preview && <motion.div className="previewOverlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setPreview(false)}><motion.section className="quickPreview" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} onClick={(e)=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${product.name} preview`}><button className="previewClose" onClick={()=>setPreview(false)} aria-label="Close preview"><Close/></button><div className={`previewVisual ${product.color}`}><ProductVisual type={product.type} product={product}/></div><div><span className="kicker">{product.brand}</span><h2>{product.name}</h2><div className="rating"><Star/> {product.rating}<span>{product.reviews} verified reviews</span></div><p>{product.description}</p><div className="previewFacts"><span>{product.texture}</span><span>{product.finish}</span></div>{options && <label className="previewSelect"><span>{options.label}</span><select value={selectedVariant} onChange={(e)=>setSelectedVariant(e.target.value)}><option value="">Select {options.label.toLowerCase()}</option>{options.values.map(value=><option key={value}>{value}</option>)}</select></label>}<button className="button dark full" disabled={outOfStock || (options && !selectedVariant)} onClick={add}>{outOfStock ? "Out of stock" : `Add to bag · ${money(product.price)}`}</button><Link className="textLink" to={`/product/${product.slug}`}>See full details</Link></div></motion.section></motion.div>}</AnimatePresence>
  </>;
}
