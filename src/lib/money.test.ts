import { money } from "./money";

test("formats values with a dollar sign and two decimal places", () => {
  expect(money(48)).toBe("$48.00");
  expect(money("38.5")).toBe("$38.50");
});
