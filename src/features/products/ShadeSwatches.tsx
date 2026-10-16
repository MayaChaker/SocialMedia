import type { CSSProperties } from "react";
import type { Variant } from "../../types/commerce";
import styles from "./ShadeSwatches.module.css";

interface ShadeSwatchesProps {
  productName: string;
  variants: Variant[];
  selectedId: string | undefined;
  onSelect: (variantId: string) => void;
  /** Larger swatches on the product page. */
  size?: "small" | "large";
}

/** Colour buttons for choosing a shade. Sold-out shades stay visible but cannot be chosen. */
export default function ShadeSwatches({
  productName,
  variants,
  selectedId,
  onSelect,
  size = "small",
}: ShadeSwatchesProps) {
  return (
    <div
      className={`${styles.swatches} ${styles[size]}`}
      role="group"
      aria-label={`Choose a shade for ${productName}`}
    >
      {variants.map((variant) => {
        const soldOut = variant.stock === 0;
        const isSelected = selectedId === variant.id;
        return (
          <button
            key={variant.id}
            type="button"
            className={styles.swatch}
            style={{ "--swatch": variant.swatch } as CSSProperties}
            onClick={() => onSelect(variant.id)}
            aria-label={`Select ${variant.name} shade${soldOut ? ", out of stock" : ""}`}
            aria-pressed={isSelected}
            disabled={soldOut}
            title={`${variant.name}${soldOut ? " (out of stock)" : ""}`}
          />
        );
      })}
    </div>
  );
}
