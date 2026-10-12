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
      description:
        "Shop considered skincare, makeup, and curated beauty rituals from Veloura Beauty.",
    });
  });

  test("uses the product name and description on product pages", () => {
    expect(getRouteMetadata("/product/luminous-veil-serum")).toEqual({
      title: "Luminous Veil Serum | Veloura Beauty",
      description: expect.stringContaining("concentrated daily serum"),
    });
  });

  test("labels unknown pages as not found", () => {
    expect(getRouteMetadata("/unknown").title).toBe("Page not found | Veloura Beauty");
    expect(getRouteMetadata("/product/missing").title).toBe("Page not found | Veloura Beauty");
  });
});
