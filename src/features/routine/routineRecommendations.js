import { PRODUCTS } from "../../data/products";

const byId = (id) => PRODUCTS.find((product) => product.id === id);

const treatmentByGoal = {
  Dehydration: 1,
  Dullness: 3,
  "Fine lines": 3,
  "Sensitive skin": 1,
};

const treatmentReasons = {
  Dehydration: "Floods skin with light, lasting hydration.",
  Dullness: "Restores a fresh, rested-looking glow.",
  "Fine lines": "Supports resilient skin with peptides and hydration.",
  "Sensitive skin": "Comforts tight-feeling skin with a gentle milky layer.",
};

const finishByPreference = {
  Weightless: 5,
  Cushioning: 5,
  Rich: 4,
};

const cleanserFor = (goal, texture) => (texture === "Rich" || goal === "Sensitive skin" ? 6 : 2);

const recommendation = (id, step, reason) => ({ product: byId(id), step, reason });

export function buildRoutineRecommendations({ goal, time, texture }) {
  const cleanserId = cleanserFor(goal, texture);
  const treatmentId = treatmentByGoal[goal] || 3;
  const finishId = finishByPreference[texture] || 5;
  const cleanserReason = cleanserId === 6
    ? "Melts buildup while leaving skin soft and comfortable."
    : "Cleanses gently without disturbing the skin barrier.";
  const finishReason = finishId === 4
    ? "Replenishes overnight with a rich, breathable finish."
    : "Adds daily protection with a smooth, lightweight finish.";

  if (time === "Essential") {
    return [
      recommendation(cleanserId, "Cleanse", cleanserReason),
      recommendation(texture === "Rich" || goal === "Fine lines" ? 4 : treatmentId, texture === "Rich" || goal === "Fine lines" ? "Replenish" : "Treat", texture === "Rich" || goal === "Fine lines" ? "Comforts skin with one restorative finishing step." : treatmentReasons[goal]),
    ];
  }

  const routine = [
    recommendation(cleanserId, "Cleanse", cleanserReason),
    recommendation(treatmentId, "Treat", treatmentReasons[goal]),
    recommendation(finishId, finishId === 4 ? "Replenish" : "Protect", finishReason),
  ];

  if (time === "Immersive") {
    const extraId = treatmentId === 1 ? 3 : 1;
    const extra = recommendation(extraId, extraId === 1 ? "Prepare" : "Treat", extraId === 1 ? "Adds a cushioning hydration layer before treatment." : "Seals in hydration with a weightless barrier-supporting serum.");
    routine.splice(extraId === 1 ? 1 : 2, 0, extra);
  }

  return routine;
}

export function routineTitle({ goal, time }) {
  const pace = time === "Essential" ? "Essential" : time === "Immersive" ? "Layered" : "Balanced";
  return `${pace} care for ${goal.toLowerCase()}.`;
}
