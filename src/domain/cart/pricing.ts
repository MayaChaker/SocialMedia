import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "../commerce/commerceConfig";
import type { Promotion, Totals } from "../../types/commerce";

export const PROMO_CODES: Readonly<Record<string, Promotion>> = Object.freeze({
  VELOURA10: { rate: 0.1, label: "10% off your order" },
});

export const normalizePromoCode = (code = "") => code.trim().toUpperCase();

export const findPromotion = (code?: string): Promotion | null =>
  PROMO_CODES[normalizePromoCode(code)] ?? null;

const toCents = (value: number) => Math.round(value * 100);
const fromCents = (cents: number) => cents / 100;

/** The only fields pricing needs, so it works for bag lines and order items alike. */
export interface PricedLine {
  price: number;
  quantity: number;
}

/**
 * Single source of truth for basket maths, shared by the cart drawer and checkout.
 * Works in whole cents so totals never drift (0.1 + 0.2 problems).
 */
export function calculateTotals(items: PricedLine[], promoCode = ""): Totals {
  const subtotal = items.reduce((sum, item) => sum + toCents(item.price) * item.quantity, 0);
  const promotion = findPromotion(promoCode);
  const discount = promotion ? Math.round(subtotal * promotion.rate) : 0;
  const merchandise = subtotal - discount;
  const threshold = toCents(FREE_SHIPPING_THRESHOLD);
  const shipping = !items.length || merchandise >= threshold ? 0 : toCents(STANDARD_SHIPPING);

  return {
    subtotal: fromCents(subtotal),
    discount: fromCents(discount),
    shipping: fromCents(shipping),
    total: fromCents(merchandise + shipping),
    freeShippingRemaining: fromCents(Math.max(0, threshold - merchandise)),
    promotion,
  };
}
