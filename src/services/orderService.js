export const orderService = {
  /**
   * With REACT_APP_CHECKOUT_URL set, hands the basket to a server that creates a hosted
   * payment session (the server must re-price items; client totals are display only).
   * Without it, records a browser-only demo order.
   */
  async create({ cart, contact, shipping, promoCode, total }) {
    const checkoutUrl = process.env.REACT_APP_CHECKOUT_URL;
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
      return response.json();
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
