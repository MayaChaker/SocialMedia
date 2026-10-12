import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AppProviders from "../../providers/AppProviders";
import { router } from "../../test/navigation";
import CheckoutPage from "./CheckoutPage";
import OrderConfirmationPage from "./OrderConfirmationPage";

const withProviders = (ui) => render(<AppProviders>{ui}</AppProviders>);
const type = (label, value) =>
  fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value } });
const seedBag = () =>
  window.localStorage.setItem(
    "velouraBeauty.cart.v2",
    JSON.stringify([{ productId: 3, cartId: "3", quantity: 1 }]),
  );

test("a shopper can check out and the confirmation renders from saved orders", async () => {
  seedBag();
  window.localStorage.setItem("velouraBeauty.promoCode.v1", JSON.stringify("VELOURA10"));
  const { unmount } = withProviders(<CheckoutPage />);

  // $68 serum - 10% = $61.20, plus $8 delivery.
  expect(await screen.findByText("Promotion (VELOURA10)")).toBeInTheDocument();
  expect(screen.getAllByText("$69.20").length).toBeGreaterThan(0);

  type("Email", "maya@example.com");
  type("First name", "Maya");
  type("Last name", "Chaker");
  fireEvent.click(screen.getByRole("button", { name: /continue to shipping/i }));
  type("Address", "Main street 1");
  type("City", "Tripoli");
  fireEvent.click(screen.getByRole("button", { name: /review order/i }));
  fireEvent.click(screen.getByRole("button", { name: /place demo order/i }));

  await waitFor(() => expect(router.replace).toHaveBeenCalled());
  const [order] = JSON.parse(window.localStorage.getItem("velouraBeauty.orders.v1"));
  expect(router.replace).toHaveBeenCalledWith(`/checkout/confirmation/${order.id}`);
  expect(router.replace).not.toHaveBeenCalledWith("/shop");
  expect(order.total).toBe(69.2);
  expect(JSON.parse(window.localStorage.getItem("velouraBeauty.cart.v2"))).toEqual([]);

  unmount();
  withProviders(<OrderConfirmationPage orderId={order.id} />);
  expect(await screen.findByText("Thank you, Maya.")).toBeInTheDocument();
});

test("contact details are validated by the browser before continuing", async () => {
  seedBag();
  withProviders(<CheckoutPage />);
  await screen.findByText("Your details");
  type("Email", "not-an-email");
  type("First name", "Maya");
  type("Last name", "Chaker");
  const form = screen.getByLabelText("Email").closest("form");
  // jsdom does not block submission, so assert the validation contract directly.
  expect(form.checkValidity()).toBe(false);
  type("Email", "maya@example.com");
  expect(form.checkValidity()).toBe(true);
  expect(screen.getByLabelText("Phone", { exact: false })).not.toBeRequired();
});

test("an empty bag is sent back to the shop only after saved state has loaded", async () => {
  withProviders(<CheckoutPage />);
  await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/shop"));
});

test("an unknown order shows the not-found page", async () => {
  withProviders(<OrderConfirmationPage orderId="VB-missing" />);
  expect(await screen.findByText("We couldn’t find that page.")).toBeInTheDocument();
});
