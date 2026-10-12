"use client";

import Link from "next/link";
import { Check } from "@mui/icons-material";
import { money } from "../../lib/money";
import { useCommerce } from "../../hooks/useCommerce";
import NotFoundPage from "../../views/NotFoundPage";

// Lives on its own URL so a refresh (or a shared link on this device) still shows the order.
export default function OrderConfirmationPage({ orderId }) {
  const { orders, hydrated } = useCommerce();
  if (!hydrated) return null;
  const order = orders.find((item) => item.id === orderId);
  if (!order) return <NotFoundPage />;

  return (
    <main className="orderConfirmation">
      <span className="orderCheck">
        <Check />
      </span>
      <span className="kicker">Demo order recorded</span>
      <h1>Thank you, {order.contact.firstName}.</h1>
      <p>No payment was taken. This browser-only demo order is saved on this device.</p>
      <div>
        <span>Reference</span>
        <strong>{order.id}</strong>
        <span>Total</span>
        <strong>{money(order.total)}</strong>
        <span>Contact</span>
        <strong>{order.contact.email}</strong>
      </div>
      <Link className="button dark" href="/">
        Return home
      </Link>
    </main>
  );
}
