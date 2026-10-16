import type { PaymentMethod } from "../../types/commerce";

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  note: string;
}

/**
 * The ways to pay offered at checkout. They are presentation only for now: whichever is
 * chosen, the order is placed the same way (see orderService) and no payment details are
 * collected or sent. Connecting a provider replaces this, not the checkout screens.
 */
export const PAYMENT_OPTIONS: readonly PaymentOption[] = [
  { id: "card", label: "Credit or debit card", note: "Visa, Mastercard" },
  { id: "apple-pay", label: "Apple Pay", note: "Pay with Face ID or Touch ID" },
  { id: "whish", label: "Whish Money", note: "Pay from your Whish wallet" },
  { id: "cash", label: "Cash on delivery", note: "Pay the courier when your order arrives" },
];

export const paymentLabel = (method: PaymentMethod): string =>
  PAYMENT_OPTIONS.find((option) => option.id === method)?.label ?? method;
