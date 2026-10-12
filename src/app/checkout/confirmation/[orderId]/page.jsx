import OrderConfirmationPage from "../../../../features/checkout/OrderConfirmationPage";

export const metadata = { title: "Order confirmed", robots: { index: false } };

export default async function Page({ params }) {
  const { orderId } = await params;
  return <OrderConfirmationPage orderId={orderId} />;
}
