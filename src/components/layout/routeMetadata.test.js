import { getRouteMetadata } from "./routeMetadata";

describe("getRouteMetadata", () => {
  test("returns the homepage metadata", () => {
    expect(getRouteMetadata("/")).toEqual({
      title: "Veloura Beauty — Beauty, considered.",
      description: "High-performance beauty essentials made for daily ritual.",
    });
  });

  test("returns the shop metadata for catalogue paths", () => {
    expect(getRouteMetadata("/shop/skincare")).toEqual({
      title: "Shop | Veloura Beauty",
      description: "Shop considered skincare, makeup, and curated beauty rituals from Veloura Beauty.",
    });
  });

  test("preserves the generic fallback for unknown sections", () => {
    expect(getRouteMetadata("/unknown").title).toBe("Beauty | Veloura Beauty");
  });
});
