import type { Variant } from "../../types/commerce";

/** A selectable shade with its own price and stock. */
export const shade = (
  id: string,
  name: string,
  swatch: string,
  price: number,
  stock = 24,
): Variant => ({
  id,
  name,
  swatch,
  price,
  stock,
});
