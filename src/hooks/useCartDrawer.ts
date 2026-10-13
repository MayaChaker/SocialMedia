import { createContext, useContext } from "react";

export interface CartDrawerControls {
  openCart: () => void;
  closeCart: () => void;
}

export const CartDrawerContext = createContext<CartDrawerControls | null>(null);

/** Open/close the shopping bag from anywhere in the store. */
export const useCartDrawer = (): CartDrawerControls => {
  const value = useContext(CartDrawerContext);
  if (!value) throw new Error("useCartDrawer must be used inside AppProviders");
  return value;
};
