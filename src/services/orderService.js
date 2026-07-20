export const orderService = {
  create({ cart, contact, shipping, gift, total }) {
    return { id: `VB-${Date.now().toString().slice(-8)}`, placedAt: new Date().toISOString(), status: "Confirmed", items: cart, contact, shipping, gift, total, payment: "Demo payment" };
  },
};
