"use client";

import { useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import CartDrawer from "../features/cart/CartDrawer";
import { CartDrawerContext, type CartDrawerControls } from "../hooks/useCartDrawer";
import { CommerceProvider } from "../hooks/useCommerce";
import { CustomerProvider } from "../hooks/useCustomer";

// Client-side state shared by every page: bag, wishlist, orders, profile and the bag drawer.
export default function AppProviders({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const drawer = useMemo<CartDrawerControls>(
    () => ({ openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false) }),
    [],
  );

  return (
    <MotionConfig reducedMotion="user">
      <CommerceProvider>
        <CustomerProvider>
          <CartDrawerContext.Provider value={drawer}>
            {children}
            <CartDrawer open={cartOpen} close={drawer.closeCart} />
          </CartDrawerContext.Provider>
        </CustomerProvider>
      </CommerceProvider>
    </MotionConfig>
  );
}
