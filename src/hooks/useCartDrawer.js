import { createContext, useContext } from "react";

export const CartDrawerContext = createContext(null);

/** Open/close the shopping bag from anywhere in the store. */
export const useCartDrawer = () => {
  const value = useContext(CartDrawerContext);
  if (!value) throw new Error("useCartDrawer must be used inside AppProviders");
  return value;
};
