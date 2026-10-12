import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "../commerce/commerceConfig";

export const PROMO_CODES = Object.freeze({
  VELOURA10: { rate: 0.1, label: "10% off your order" },
});

export const normalizePromoCode = (code = "") => code.trim().toUpperCase();

export const findPromotion = (code) => PROMO_CODES[normalizePromoCode(code)] ?? null;

const toCents = (value) => Math.round(value * 100);
const fromCents = (cents) => cents / 100;

/**
 * Single source of truth for basket maths, shared by the cart drawer and checkout.
 * Works in whole cents so totals never drift (0.1 + 0.2 problems).
 */
export function calculateTotals(items, promoCode = "") {
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
