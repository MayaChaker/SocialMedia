import { PRODUCTS } from "../../data/products";
import { buildRoutineRecommendations } from "./routineRecommendations";

const answers = (goal, time, texture) => ({ goal, time, texture });

test("routine length follows the selected pace", () => {
  expect(buildRoutineRecommendations(answers("Dehydration", "Essential", "Weightless"))).toHaveLength(2);
  expect(buildRoutineRecommendations(answers("Dehydration", "Balanced", "Weightless"))).toHaveLength(3);
  expect(buildRoutineRecommendations(answers("Dehydration", "Immersive", "Weightless"))).toHaveLength(4);
});

test("different needs and textures produce different routines", () => {
  const light = buildRoutineRecommendations(answers("Dullness", "Balanced", "Weightless")).map(({ product }) => product.id);
  const rich = buildRoutineRecommendations(answers("Fine lines", "Balanced", "Rich")).map(({ product }) => product.id);
  const sensitive = buildRoutineRecommendations(answers("Sensitive skin", "Balanced", "Cushioning")).map(({ product }) => product.id);
  expect(light).not.toEqual(rich);
  expect(sensitive).not.toEqual(light);
});

test("every recommendation references a real catalogue product", () => {
  const catalogueIds = new Set(PRODUCTS.map((product) => product.id));
  const routine = buildRoutineRecommendations(answers("Fine lines", "Immersive", "Rich"));
  routine.forEach(({ product, step, reason }) => {
    expect(catalogueIds.has(product.id)).toBe(true);
    expect(step).toBeTruthy();
    expect(reason).toBeTruthy();
  });
});
