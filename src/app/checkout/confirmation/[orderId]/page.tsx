import type { Metadata } from "next";
import OrderConfirmationPage from "../../../../features/checkout/OrderConfirmationPage";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function Page({ params }: PageProps<"/checkout/confirmation/[orderId]">) {
  const { orderId } = await params;
  return <OrderConfirmationPage orderId={orderId} />;
}
