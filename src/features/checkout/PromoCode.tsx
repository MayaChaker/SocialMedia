import { useState, type FormEvent } from "react";
import { useCommerce } from "../../hooks/useCommerce";
import styles from "./checkout.module.css";

/** The applied promotion with a way to remove it, or a field to enter a code. */
export default function PromoCode() {
  const { promoCode, totals, applyPromoCode, removePromoCode } = useCommerce();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  if (promoCode)
    return (
      <p className={styles.promoApplied} role="status">
        <span>
          <strong>{promoCode}</strong> · {totals.promotion?.label}
        </span>
        <button type="button" onClick={removePromoCode}>
          Remove
        </button>
      </p>
    );

  // Not a <form>: the summary sits next to the step forms, and Enter here must not submit them.
  const apply = (event?: FormEvent) => {
    event?.preventDefault();
    const valid = applyPromoCode(input);
    setError(valid ? "" : "That code is not valid.");
    if (valid) setInput("");
  };

  return (
    <div className={styles.promo}>
      <div className={styles.promoRow}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") apply(event);
          }}
          placeholder="Enter a promo code"
          aria-label="Promo code"
        />
        <button type="button" onClick={() => apply()}>
          Apply
        </button>
      </div>
      {error && (
        <p className={styles.promoError} role="status">
          {error}
        </p>
      )}
    </div>
  );
}
