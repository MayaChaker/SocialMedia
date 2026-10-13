import { Check } from "@mui/icons-material";
import type { Variant } from "../../types/commerce";

interface ShadeSwatchesProps {
  productName: string;
  variants: Variant[];
  selectedId: string | undefined;
  onSelect: (variantId: string) => void;
  /** Tick the selected swatch (product cards); the product page marks it with a ring only. */
  showCheck?: boolean;
}

/** Colour buttons for choosing a shade. Sold-out shades stay visible but cannot be chosen. */
export default function ShadeSwatches({
  productName,
  variants,
  selectedId,
  onSelect,
  showCheck = true,
}: ShadeSwatchesProps) {
  return (
    <div className="cardSwatches" role="group" aria-label={`Choose a shade for ${productName}`}>
      {variants.map((variant) => {
        const soldOut = variant.stock === 0;
        const isSelected = selectedId === variant.id;
        return (
          <button
            key={variant.id}
            type="button"
            className={isSelected ? "selected" : ""}
            style={{ "--swatch": variant.swatch }}
            onClick={() => onSelect(variant.id)}
            aria-label={`Select ${variant.name} shade${soldOut ? ", out of stock" : ""}`}
            aria-pressed={isSelected}
            disabled={soldOut}
            title={`${variant.name}${soldOut ? " — Out of stock" : ""}`}
          >
            <span />
            {showCheck && isSelected && <Check aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
