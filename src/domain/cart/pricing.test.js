import { calculateTotals, findPromotion } from "./pricing";

const line = (price, quantity = 1) => ({ price, quantity });

test("charges standard delivery below the free-shipping threshold", () => {
  expect(calculateTotals([line(42)])).toMatchObject({
    subtotal: 42,
    discount: 0,
    shipping: 8,
    total: 50,
    freeShippingRemaining: 33,
  });
});

test("ships free once merchandise reaches the threshold", () => {
  expect(calculateTotals([line(38), line(37)])).toMatchObject({ shipping: 0, total: 75 });
});

test("applies the promotion before deciding on delivery", () => {
  // $80 - 10% = $72, which falls back under the $75 threshold.
  expect(calculateTotals([line(40, 2)], "veloura10")).toMatchObject({
    subtotal: 80,
    discount: 8,
    shipping: 8,
    total: 80,
  });
});

test("keeps cent-accurate totals", () => {
  expect(calculateTotals([line(0.1), line(0.2)]).subtotal).toBe(0.3);
});

test("an empty bag costs nothing", () => {
  expect(calculateTotals([])).toMatchObject({ subtotal: 0, shipping: 0, total: 0 });
});

test("promo codes are case- and whitespace-insensitive, unknown codes are rejected", () => {
  expect(findPromotion("  Veloura10 ")).not.toBeNull();
  expect(findPromotion("FREE100")).toBeNull();
});
