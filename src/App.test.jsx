import { configure, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppProviders from "./providers/AppProviders";
import { AppRoutes } from "./App";

// Routes are lazy-loaded; give the first import time on slow CI machines.
configure({ asyncUtilTimeout: 5000 });

const renderAt = (path) =>
  render(
    <AppProviders>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes openCart={() => {}} />
      </MemoryRouter>
    </AppProviders>,
  );

const type = (label, value) =>
  fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value } });

beforeEach(() => window.localStorage.clear());

test("a shopper can check out and the confirmation survives a reload", async () => {
  window.localStorage.setItem(
    "velouraBeauty.cart.v2",
    JSON.stringify([{ productId: 3, cartId: "3", quantity: 1 }]),
  );
  window.localStorage.setItem("velouraBeauty.promoCode.v1", JSON.stringify("VELOURA10"));
  const { unmount } = renderAt("/checkout");

  // $68 serum - 10% = $61.20, plus $8 delivery.
  expect(await screen.findByText("Promotion (VELOURA10)")).toBeTruthy();
  expect(screen.getAllByText("$69.20").length).toBeGreaterThan(0);

  type("Email", "maya@example.com");
  type("First name", "Maya");
  type("Last name", "Chaker");
  fireEvent.click(screen.getByRole("button", { name: /continue to shipping/i }));

  type("Address", "Main street 1");
  type("City", "Tripoli");
  fireEvent.click(screen.getByRole("button", { name: /review order/i }));

  fireEvent.click(screen.getByRole("button", { name: /place demo order/i }));
  expect(await screen.findByText("Thank you, Maya.")).toBeTruthy();
  expect(JSON.parse(window.localStorage.getItem("velouraBeauty.cart.v2"))).toEqual([]);

  const [order] = JSON.parse(window.localStorage.getItem("velouraBeauty.orders.v1"));
  expect(order.total).toBe(69.2);
  unmount();
  renderAt(`/checkout/confirmation/${order.id}`);
  expect(await screen.findByText("Thank you, Maya.")).toBeTruthy();
});

test("contact details are validated by the browser before continuing", async () => {
  window.localStorage.setItem(
    "velouraBeauty.cart.v2",
    JSON.stringify([{ productId: 3, cartId: "3", quantity: 1 }]),
  );
  renderAt("/checkout");
  await screen.findByText("Your details");
  type("Email", "not-an-email");
  type("First name", "Maya");
  type("Last name", "Chaker");
  const form = screen.getByLabelText("Email").closest("form");
  // jsdom does not block submission, so assert the validation contract directly.
  expect(form.checkValidity()).toBe(false);
  type("Email", "maya@example.com");
  expect(form.checkValidity()).toBe(true);
  // Optional fields must not block the step.
  expect(screen.getByLabelText("Phone", { exact: false }).required).toBe(false);
});

test("shop filters are read from the URL so filtered links can be shared", async () => {
  renderAt("/shop/skincare?concern=Sensitive+skin&price=under-50");
  // Essence ($48), cleanser ($42) and balm ($46) are sensitive-skin skincare under $50.
  expect(await screen.findByText("3")).toBeTruthy();
  expect(screen.getByRole("button", { name: /sensitive skin/i })).toBeTruthy();
  expect(screen.getByRole("button", { name: /under \$50/i })).toBeTruthy();
});

test.each(["/nowhere", "/shop/perfume", "/product/missing", "/care/unknown"])(
  "%s renders the not-found page",
  async (path) => {
    renderAt(path);
    expect(await screen.findByText("We couldn’t find that page.")).toBeTruthy();
  },
);
