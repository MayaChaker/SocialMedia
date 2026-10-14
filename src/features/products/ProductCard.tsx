"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { money } from "../../lib/money";
import { OUT_OF_STOCK_IDS } from "../../data/merchandising";
import { resolveProductSelection } from "../../domain/product/productSelection";
import { useCommerce } from "../../hooks/useCommerce";
import { useModalDialog } from "../../hooks/useModalDialog";
import ProductVisual from "../../components/product-art/ProductVisual";
import type { Product } from "../../types/commerce";
import WishlistButton from "../wishlist/WishlistButton";
import ProductCardDetails from "./ProductCardDetails";
import QuickViewDialog from "./QuickViewDialog";
import ShadeSwatches from "./ShadeSwatches";

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
  const shadeLabel = selected ? ` in ${selected.name}` : "";

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

  const swatches = product.variants && (
    <ShadeSwatches
      productName={product.name}
      variants={product.variants}
      selectedId={selectedId}
      onSelect={setSelectedId}
    />
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
            aria-label={`View ${product.name}${shadeLabel}`}
          >
            <ProductVisual product={display} sizes="(max-width: 700px) 50vw, 25vw" />
          </Link>
          <button className="quickView" onClick={() => setPreview(true)}>
            Quick view
          </button>
        </div>
        <ProductCardDetails
          product={product}
          price={display.price}
          selected={selected}
          swatches={swatches}
          productHref={productHref}
          shopLayout={shopLayout}
        />
        <button
          className={`addButton ripple ${justAdded ? "added" : ""}`}
          disabled={outOfStock || needsShade}
          onClick={add}
        >
          {justAdded && <Check />}
          {actionLabel}
        </button>
        <span className="srOnly" aria-live="polite">
          {justAdded ? `${product.name}${shadeLabel} added to bag` : ""}
        </span>
      </motion.article>
      <AnimatePresence>
        {preview && (
          <QuickViewDialog
            product={product}
            display={display}
            selected={selected}
            swatches={swatches}
            action={{
              label:
                actionLabel === "Add to bag" ? `Add to bag · ${money(display.price)}` : actionLabel,
              disabled: outOfStock || needsShade,
            }}
            productHref={productHref}
            dialogRef={previewRef}
            onAdd={add}
            onClose={() => setPreview(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
