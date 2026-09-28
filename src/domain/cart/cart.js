import { resolveProductSelection } from "../product/productSelection";

export function resolveCart(items = []) {
  return items.map((item) => {
    const canonical = resolveProductSelection(item, item.variantId);
    return canonical ? { ...canonical, quantity: Math.max(1, Number(item.quantity) || 1) } : null;
  }).filter(Boolean);
}
