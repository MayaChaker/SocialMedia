import type { HostedCheckoutSession, Order, OrderRequest } from "../types/commerce";

export const orderService = {
  /**
   * With NEXT_PUBLIC_CHECKOUT_URL set, hands the basket to a server that creates a hosted
   * payment session (the server must re-price items; client totals are display only).
   * Without it, records a browser-only demo order.
   */
  async create({
    cart,
    contact,
    shipping,
    promoCode,
    total,
  }: OrderRequest): Promise<Order | HostedCheckoutSession> {
    const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL;
    if (checkoutUrl) {
      const response = await fetch(checkoutUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ productId, variantId, quantity }) => ({
            productId,
            variantId,
            quantity,
          })),
          contact,
          shipping,
          promoCode,
        }),
      });
      if (!response.ok) throw new Error("Secure checkout could not be started. Please try again.");
      return (await response.json()) as HostedCheckoutSession;
    }
    return {
      id: `VB-${Date.now().toString().slice(-8)}`,
      placedAt: new Date().toISOString(),
      status: "Confirmed",
      items: cart,
      contact,
      shipping,
      promoCode,
      total,
      payment: "Demo payment",
    };
  },
};
