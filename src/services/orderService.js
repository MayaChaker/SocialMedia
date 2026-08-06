export const orderService = {
  async create({ cart, contact, shipping, gift, total }) {
    const checkoutUrl = process.env.REACT_APP_CHECKOUT_URL;
    if (checkoutUrl) {
      const response = await fetch(checkoutUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cart, contact, shipping, gift }) });
      if (!response.ok) throw new Error("Secure checkout could not be started. Please try again.");
      return response.json();
    }
    return { id: `VB-${Date.now().toString().slice(-8)}`, placedAt: new Date().toISOString(), status: "Confirmed", items: cart, contact, shipping, gift, total, payment: "Demo payment" };
  },
};
