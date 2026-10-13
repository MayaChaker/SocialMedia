"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Close, Star } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { money } from "../../lib/money";
import { OUT_OF_STOCK_IDS } from "../../data/merchandising";
import { resolveProductSelection } from "../../domain/product/productSelection";
import { useCommerce } from "../../hooks/useCommerce";
import { useModalDialog } from "../../hooks/useModalDialog";
import ProductArt from "../../components/product-art/ProductArt";
import type { Product } from "../../types/commerce";
import WishlistButton from "../wishlist/WishlistButton";

interface ProductCardProps {
  product: Product;
  /** Called after the product is added to the bag, e.g. to open the bag drawer. */
  onAdded?: () => void;
  /** The denser layout used on the shop grid. */
  shopLayout?: boolean;
}

export default function ProductCard({ product, onAdded, shopLayout = false }: ProductCardProps) {
  const { addToCart } = useCommerce();
  const [preview, setPreview] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const previewRef = useRef<HTMLElement>(null);
  const resetTimerRef = useRef<number | undefined>(undefined);
  const selected = useMemo(
    () => product.variants?.find((variant) => variant.id === selectedId),
    [product.variants, selectedId],
  );
  const display = resolveProductSelection(product, selected?.id) ?? product;
  const outOfStock = OUT_OF_STOCK_IDS.includes(product.id) || selected?.stock === 0;
  const needsShade = Boolean(product.variants && !selected);
  const productHref = `/product/${product.slug}${selected ? `?variant=${selected.id}` : ""}`;

  useModalDialog(preview, previewRef, () => setPreview(false));

  useEffect(() => () => window.clearTimeout(resetTimerRef.current), []);

  const add = () => {
    if (outOfStock || needsShade) return;
    addToCart(display);
    onAdded?.();
    // Briefly confirm on the button itself, then return to the normal label.
    setJustAdded(true);
    window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => setJustAdded(false), 1600);
  };

  const swatches = (
    <div className="cardSwatches" role="group" aria-label={`Choose a shade for ${product.name}`}>
      {product.variants?.map((variant) => (
        <button
          key={variant.id}
          type="button"
          className={selectedId === variant.id ? "selected" : ""}
          style={{ "--swatch": variant.swatch }}
          onClick={() => setSelectedId(variant.id)}
          aria-label={`Select ${variant.name} shade${variant.stock === 0 ? ", out of stock" : ""}`}
          aria-pressed={selectedId === variant.id}
          disabled={variant.stock === 0}
          title={`${variant.name}${variant.stock === 0 ? " — Out of stock" : ""}`}
        >
          <span />
          {selectedId === variant.id && <Check aria-hidden="true" />}
        </button>
      ))}
    </div>
  );

  const actionLabel = outOfStock
    ? "Out of stock"
    : needsShade
      ? "Choose shade"
      : justAdded
        ? "Added"
        : "Add to bag";

  return (
    <>
      <motion.article
        className={`productCard ${outOfStock ? "soldOut" : ""}`}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`productImage ${product.color}`}>
          {(outOfStock || product.badge) && (
            <span className="productBadge">{outOfStock ? "Out of stock" : product.badge}</span>
          )}
          <WishlistButton productId={product.id} productName={product.name} />
          <Link
            href={productHref}
            className="visualLink"
            aria-label={`View ${product.name}${selected ? ` in ${selected.name}` : ""}`}
          >
            <ProductArt product={display} />
          </Link>
          <button className="quickView" onClick={() => setPreview(true)}>
            Quick view
          </button>
        </div>
        {shopLayout ? (
          <>
            <div className="productMeta">{product.category}</div>
            <div className="productInfo shopProductInfo">
              <Link className="productNameLink" href={productHref}>
                <h3>{product.name}</h3>
              </Link>
              {product.rating && product.reviews ? (
                <div
                  className="cardRating"
                  aria-label={`${product.rating} out of 5 stars from ${product.reviews} reviews`}
                >
                  <Star />
                  <span>
                    {product.rating} <small>({product.reviews} reviews)</small>
                  </span>
                </div>
              ) : (
                <div className="cardRating neutral">Not yet rated</div>
              )}
              <p>{product.note}</p>
              <div className="cardPrice">
                <strong>{money(display.price)}</strong>
                {product.originalPrice && <del>{money(product.originalPrice)}</del>}
              </div>
              <div className="cardVariantInfo">
                {product.variants ? (
                  <>
                    Selected shade: <strong>{selected?.name || "Choose a shade"}</strong>
                  </>
                ) : (
                  product.size
                )}
              </div>
            </div>
            <div className="cardOptions">{product.variants && swatches}</div>
          </>
        ) : (
          <>
            <div className="productMeta">
              <span>
                {product.category} · {product.brand.replace("Veloura ", "")}
              </span>
              <div className="cardRating" aria-label={`${product.rating} out of 5 stars`}>
                <Star /> {product.rating} <small>({product.reviews})</small>
              </div>
            </div>
            <div className="productInfo">
              <div>
                <Link href={productHref}>
                  <h3>{product.name}</h3>
                </Link>
                <p>{product.note}</p>
                <small>{selected ? `Shade: ${selected.name}` : product.size}</small>
              </div>
              <div className="price">
                <span>{money(display.price)}</span>
                {product.originalPrice && <del>{money(product.originalPrice)}</del>}
              </div>
            </div>
            {product.variants && swatches}
          </>
        )}
        <button
          className={`addButton ripple ${justAdded ? "added" : ""}`}
          disabled={outOfStock || needsShade}
          onClick={add}
        >
          {justAdded && <Check />}
          {actionLabel}
        </button>
        <span className="srOnly" aria-live="polite">
          {justAdded ? `${product.name}${selected ? ` in ${selected.name}` : ""} added to bag` : ""}
        </span>
      </motion.article>
      <AnimatePresence>
        {preview && (
          <motion.div
            className="previewOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(false)}
          >
            <motion.section
              ref={previewRef}
              className="quickPreview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`preview-title-${product.id}`}
              aria-describedby={`preview-description-${product.id}`}
            >
              <button
                className="previewClose"
                onClick={() => setPreview(false)}
                aria-label="Close preview"
              >
                <Close />
              </button>
              <div className={`previewVisual ${product.color}`}>
                <ProductArt product={display} />
              </div>
              <div>
                <span className="kicker">{product.brand}</span>
                <h2 id={`preview-title-${product.id}`}>{product.name}</h2>
                {product.rating && product.reviews && (
                  <div className="rating">
                    <Star /> {product.rating}
                    <span>{product.reviews} reviews</span>
                  </div>
                )}
                <p id={`preview-description-${product.id}`}>{product.description}</p>
                {product.variants && (
                  <p className="previewShade">
                    Selected shade: <strong>{selected?.name || "Choose a shade"}</strong>
                  </p>
                )}
                {product.variants && swatches}
                <button
                  className="button dark full"
                  disabled={outOfStock || needsShade}
                  onClick={add}
                >
                  {actionLabel === "Add to bag"
                    ? `Add to bag · ${money(display.price)}`
                    : actionLabel}
                </button>
                <Link className="textLink" href={productHref}>
                  See full details
                </Link>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
