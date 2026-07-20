import { useState } from "react";
import { Link } from "react-router-dom";
import { Close, Star } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { money } from "../../data/products";
import { useStore } from "../../hooks/useStore";
import ProductVisual from "./ProductVisual";
import WishlistButton from "../wishlist/WishlistButton";

export default function ProductCard({ product, onAdded }) {
  const { addToCart } = useStore(); const [preview, setPreview] = useState(false);
  const add = () => { addToCart(product); onAdded?.(); };
  return <><motion.article className="productCard" whileHover={{ y: -5 }} transition={{ duration: .24 }}><div className={`productImage ${product.color}`}><span className="productBadge">{product.badge}</span><WishlistButton productId={product.id} productName={product.name}/><Link to={`/product/${product.slug}`} className="visualLink" aria-label={`View ${product.name}`}><ProductVisual type={product.type}/></Link><button className="quickView" onClick={() => setPreview(true)}>Quick preview</button></div><div className="productMeta"><span>{product.brand}</span><div className="cardRating"><Star/> {product.rating} <small>({product.reviews})</small></div></div><div className="productInfo"><div><Link to={`/product/${product.slug}`}><h3>{product.name}</h3></Link><p>{product.note}</p></div><div className="price"><span>{money(product.price)}</span>{product.originalPrice && <del>{money(product.originalPrice)}</del>}</div></div><button className="addButton ripple" onClick={add}>Quick add</button></motion.article><AnimatePresence>{preview && <motion.div className="previewOverlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setPreview(false)}><motion.section className="quickPreview" initial={{opacity:0,y:24,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12}} onClick={(e)=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${product.name} preview`}><button className="previewClose" onClick={()=>setPreview(false)} aria-label="Close preview"><Close/></button><div className={`previewVisual ${product.color}`}><ProductVisual type={product.type}/></div><div><span className="kicker">{product.brand}</span><h2>{product.name}</h2><p>{product.description}</p><div className="previewFacts"><span>{product.texture}</span><span>{product.finish}</span></div><button className="button dark full" onClick={add}>Add to bag · {money(product.price)}</button><Link className="textLink" to={`/product/${product.slug}`}>See full details</Link></div></motion.section></motion.div>}</AnimatePresence></>;
}
