import { productBySlug } from "../../data/products";
import { matchShade, matchedProductUrl, SHADE_PROFILES } from "./shadeMatchLogic";

test("every shade profile maps to a real Petal Skin Tint variant", () => {
  const variantIds = new Set(productBySlug("petal-skin-tint").variants.map((variant) => variant.id));
  SHADE_PROFILES.forEach((shade) => expect(variantIds.has(shade.variantId)).toBe(true));
});

test("different depth and undertone combinations return different shades", () => {
  const fair = matchShade({ depth: "Fair", tone: "Silver · cool" });
  const medium = matchShade({ depth: "Medium", tone: "Both · neutral" });
  const deep = matchShade({ depth: "Deep", tone: "Gold · warm" });
  expect(new Set([fair.variantId, medium.variantId, deep.variantId]).size).toBe(3);
});

test("the medium neutral path returns Honey 05 and a selected-variant URL", () => {
  const shade = matchShade({ depth: "Medium", tone: "Both · neutral", finish: "Soft satin" });
  expect(shade.name).toBe("Honey 05");
  expect(matchedProductUrl(shade)).toBe("/product/petal-skin-tint?variant=medium");
});
