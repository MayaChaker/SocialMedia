import { FREE_SHIPPING_THRESHOLD } from "../../domain/commerce/commerceConfig";
import { money } from "../../lib/money";
import ProductVisual from "../../components/product-art/ProductVisual";
import PromoCode from "./PromoCode";
import type { CartLine, Totals } from "../../types/commerce";
import styles from "./checkout.module.css";

interface OrderSummaryProps {
  cart: CartLine[];
  totals: Totals;
  promoCode: string;
}

/** The bag beside every step: lines, promo code and totals. */
export default function OrderSummary({ cart, totals, promoCode }: OrderSummaryProps) {
  return (
    <div className={styles.summaryBody}>
      <ul className={styles.summaryLines}>
        {cart.map((item) => (
          <li key={item.cartId}>
            <span className={styles.summaryThumb}>
              <ProductVisual product={item} sizes="60px" decorative />
            </span>
            <span>
              <strong>{item.name}</strong>
              <small>
                {item.brand}
                {item.selectedVariant && ` · ${item.selectedVariant}`} · Qty {item.quantity}
              </small>
            </span>
            <span>{money(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <PromoCode />
      <dl className={styles.totals}>
        <div>
          <dt>Subtotal</dt>
          <dd>{money(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div>
            <dt>Promotion ({promoCode})</dt>
            <dd>−{money(totals.discount)}</dd>
          </div>
        )}
        <div>
          <dt>Delivery</dt>
          <dd>{totals.shipping ? money(totals.shipping) : "Free"}</dd>
        </div>
        <div className={styles.total}>
          <dt>Total</dt>
          <dd>{money(totals.total)}</dd>
        </div>
      </dl>
      {totals.freeShippingRemaining > 0 && (
        <p className={styles.free}>
          Add {money(totals.freeShippingRemaining)} more for complimentary delivery over{" "}
          {money(FREE_SHIPPING_THRESHOLD)}.
        </p>
      )}
    </div>
  );
}
