"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FooterContent } from "../components/layout/Footer";
import { HeaderContent } from "../components/layout/Header";
import { CartDrawerContent } from "../features/cart/CartDrawer";
import { NextLink, NextNavLink } from "./navigation";

const CartShellContext = createContext(null);

export function useCartShell() {
  const value = useContext(CartShellContext);
  if (!value) throw new Error("useCartShell must be used inside AppShell");
  return value;
}

export default function AppShell({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const cartShell = useMemo(() => ({ openCart: () => setCartOpen(true) }), []);

  return <CartShellContext.Provider value={cartShell}><div className="siteShell"><a className="skipLink" href="#mainContent">Skip to content</a><HeaderContent openCart={cartShell.openCart} locationKey={pathname} LinkComponent={NextLink} NavLinkComponent={NextNavLink} onSearch={(href) => router.push(href)}/><div id="mainContent">{children}</div><FooterContent LinkComponent={NextLink}/><CartDrawerContent open={cartOpen} close={() => setCartOpen(false)} LinkComponent={NextLink} onCheckout={() => router.push("/checkout")}/></div></CartShellContext.Provider>;
}
