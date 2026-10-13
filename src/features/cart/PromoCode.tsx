import { useState, type FormEvent } from "react";
import { useCommerce } from "../../hooks/useCommerce";

/** Shows the applied promotion, or a collapsible form to enter a code. */
export default function PromoCode() {
  const { promoCode, totals, applyPromoCode, removePromoCode } = useCommerce();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = applyPromoCode(input);
    setError(valid ? "" : "That code is not valid.");
    if (valid) setInput("");
  };

  if (promoCode)
    return (
      <small className="promoSuccess" role="status">
        {promoCode} applied · {totals.promotion?.label}{" "}
        <button className="cartRemove" onClick={removePromoCode}>
          Remove
        </button>
      </small>
    );

  return (
    <>
      <button
        className="promoToggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        Have a promo code?
      </button>
      {open && (
        <form className="promo" onSubmit={apply}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Promo code"
            aria-label="Promo code"
          />
          <button>Apply</button>
        </form>
      )}
      {error && (
        <small className="promoError" role="status">
          {error}
        </small>
      )}
    </>
  );
}
