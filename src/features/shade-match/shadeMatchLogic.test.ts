import { productRepository } from "../../repositories/productRepository";
import {
  matchShade,
  matchedProductUrl,
  SHADE_PROFILES,
  type ShadeAnswers,
  type ShadeProfile,
} from "./shadeMatchLogic";

const expectMatch = (answers: ShadeAnswers): ShadeProfile => {
  const shade = matchShade(answers);
  if (!shade) throw new Error(`No shade for ${JSON.stringify(answers)}`);
  return shade;
};

test("every shade profile maps to a real Petal Skin Tint variant", () => {
  const variantIds = new Set(
    productRepository.getBySlug("petal-skin-tint")?.variants?.map((variant) => variant.id),
  );
  expect(SHADE_PROFILES).toHaveLength(5);
  SHADE_PROFILES.forEach((shade) => expect(variantIds.has(shade.variantId)).toBe(true));
});

test("different depth and undertone combinations return different shades", () => {
  const fair = expectMatch({ depth: "Fair", tone: "Silver · cool" });
  const medium = expectMatch({ depth: "Medium", tone: "Both · neutral" });
  const deep = expectMatch({ depth: "Deep", tone: "Gold · warm" });
  expect(new Set([fair.variantId, medium.variantId, deep.variantId]).size).toBe(3);
});

test("the medium neutral path returns Honey 05 and a selected-variant URL", () => {
  const shade = expectMatch({ depth: "Medium", tone: "Both · neutral", finish: "Soft satin" });
  expect(shade.name).toBe("Honey 05");
  expect(matchedProductUrl(shade)).toBe("/product/petal-skin-tint?variant=medium");
});
