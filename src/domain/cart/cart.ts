import { resolveProductSelection } from "../product/productSelection";
import type { CartLine, StoredCartLine } from "../../types/commerce";

/** Turns saved bag lines into catalogue-backed lines, dropping products that no longer exist. */
export function resolveCart(items: StoredCartLine[] = []): CartLine[] {
  return items
    .map((item): CartLine | null => {
      const canonical = resolveProductSelection(item, item.variantId);
      return canonical ? { ...canonical, quantity: Math.max(1, Number(item.quantity) || 1) } : null;
    })
    .filter((line): line is CartLine => line !== null);
}
