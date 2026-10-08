import { policies, resolvePolicy } from "./policies";

test("resolves each supported policy key", () => {
  Object.entries(policies).forEach(([key, policy]) => {
    expect(resolvePolicy(key)).toBe(policy);
  });
});

test("falls back to shipping for an unknown policy key", () => {
  expect(resolvePolicy("unknown")).toBe(policies.shipping);
});
