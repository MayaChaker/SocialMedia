import type { ReactNode, RefObject } from "react";
import Link from "next/link";
import { Close, Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import type { ArtProduct } from "../../components/product-art/ProductArt";
import ProductVisual from "../../components/product-art/ProductVisual";
import type { Product, Variant } from "../../types/commerce";

interface QuickViewDialogProps {
  product: Product;
  /** The product as drawn and priced with the chosen shade. */
  display: ArtProduct;
  selected: Variant | undefined;
  /** Shade picker, shared with the card so both stay in sync. */
  swatches: ReactNode;
  /** Label and state of the add-to-bag button. */
  action: { label: string; disabled: boolean };
  productHref: string;
  dialogRef: RefObject<HTMLElement | null>;
  onAdd: () => void;
  onClose: () => void;
}

/** Modal preview of a product card; focus handling lives in the card's useModalDialog. */
export default function QuickViewDialog({
  product,
  display,
  selected,
  swatches,
  action,
  productHref,
  dialogRef,
  onAdd,
  onClose,
}: QuickViewDialogProps) {
  return (
    <motion.div
      className="previewOverlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        ref={dialogRef}
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
        <button className="previewClose" onClick={onClose} aria-label="Close preview">
          <Close />
        </button>
        <div className={`previewVisual ${product.color}`}>
          <ProductVisual product={display} sizes="(max-width: 700px) 100vw, 40vw" />
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
          <button className="button dark full" disabled={action.disabled} onClick={onAdd}>
            {action.label}
          </button>
          <Link className="textLink" href={productHref}>
            See full details
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
}
