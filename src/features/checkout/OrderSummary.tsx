import { money } from "../../lib/money";
import type { CartLine, Totals } from "../../types/commerce";

interface OrderSummaryProps {
  cart: CartLine[];
  totals: Totals;
  promoCode: string;
}

/** Bag lines and totals shown beside every checkout step. */
export default function OrderSummary({ cart, totals, promoCode }: OrderSummaryProps) {
  return (
    <aside className="checkoutSummary">
      <h2>Order summary</h2>
      {cart.map((item) => (
        <div className="summaryItem" key={item.cartId}>
          <span>{item.quantity}×</span>
          <div>
            <strong>{item.name}</strong>
            <small>
              {item.selectedVariant && `${item.selectedVariant} · `}
              {item.size}
            </small>
          </div>
          <b>{money(item.price * item.quantity)}</b>
        </div>
      ))}
      <div className="summaryTotals">
        <p>
          <span>Subtotal</span>
          <b>{money(totals.subtotal)}</b>
        </p>
        {totals.discount > 0 && (
          <p>
            <span>Promotion ({promoCode})</span>
            <b>−{money(totals.discount)}</b>
          </p>
        )}
        <p>
          <span>Delivery</span>
          <b>{totals.shipping ? money(totals.shipping) : "Complimentary"}</b>
        </p>
        <p className="total">
          <span>Total</span>
          <b>{money(totals.total)}</b>
        </p>
      </div>
    </aside>
  );
}
