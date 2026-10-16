import { Add, Remove } from "@mui/icons-material";
import styles from "./QuantityStepper.module.css";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  /** Names the item in the button labels, e.g. "Decrease Cloud Paint quantity". */
  itemName: string;
  min?: number;
  max?: number;
  size?: "default" | "small";
}

/** Minus, the quantity, plus. Used on the product page and in the bag. */
export default function QuantityStepper({
  value,
  onChange,
  itemName,
  min = 1,
  max = Infinity,
  size = "default",
}: QuantityStepperProps) {
  return (
    <div className={`${styles.stepper} ${size === "small" ? styles.small : ""}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease ${itemName} quantity`}
      >
        <Remove aria-hidden="true" />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${itemName} quantity`}
      >
        <Add aria-hidden="true" />
      </button>
    </div>
  );
}
