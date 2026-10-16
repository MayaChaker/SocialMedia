import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { ShippingAddress } from "../../types/commerce";

/** "Building 14, 3rd floor, Rue Gouraud, Beirut, Gemmayzeh". */
export const formatAddress = (shipping: ShippingAddress): string =>
  [shipping.building, shipping.floor, shipping.street, shipping.area].filter(Boolean).join(", ");

/** The keys of T whose values are strings, i.e. the ones a text input can edit. */
type TextKey<T> = { [K in keyof T]-?: T[K] extends string ? K : never }[keyof T];

/** Wires a text input or textarea to one string field of a form state object. */
export function bindField<T, K extends TextKey<T>>(
  setter: Dispatch<SetStateAction<T>>,
  values: T,
  key: K,
) {
  return {
    name: String(key),
    value: values[key] as string,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setter((current) => ({ ...current, [key]: event.target.value })),
  };
}
