"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AccountCircleOutlined,
  Close,
  FavoriteBorder,
  Menu,
  Search,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import { useCartDrawer } from "../../hooks/useCartDrawer";
import { useCommerce } from "../../hooks/useCommerce";
import { useModalDialog } from "../../hooks/useModalDialog";
import GlobalSearch from "./GlobalSearch";

const navItems = [
  ["Shop", "/shop"],
  ["Routine builder", "/rituals"],
  ["Shade match", "/shade-match"],
  ["Our story", "/about"],
] as const;

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export default function Header() {
  const { cart, wishlist } = useCommerce();
  const { openCart } = useCartDrawer();
  const pathname = usePathname();
  // Panels remember the page they were opened on, so navigating closes them
  // without an effect.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [searchPath, setSearchPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const searchOpen = searchPath === pathname;
  const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null);
  const setSearchOpen = (open: boolean) => setSearchPath(open ? pathname : null);
  const navRef = useRef<HTMLElement>(null);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  useModalDialog(menuOpen, navRef, () => setMenuOpen(false));

  return (
    <>
      <div className="announcement" role="region" aria-label="Store announcements">
        <span>Complimentary delivery on orders $75+</span>
        <span className="announcementAlt">Build a routine · Find a suggested shade</span>
      </div>
      <header className="siteHeader">
        <button
          className="mobileMenu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mainNav"
        >
          {menuOpen ? <Close /> : <Menu />}
        </button>
        <Link className="wordmark" href="/" aria-label="Veloura Beauty home">
          VELOURA<span>BEAUTY</span>
        </Link>
        <nav
          ref={navRef}
          id="mainNav"
          className={menuOpen ? "open" : ""}
          aria-label="Main navigation"
        >
          {navItems.map(([label, href]) => (
            <Link
              className={isActive(pathname, href) ? "active" : undefined}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              key={label}
              href={href}
            >
              {label}
            </Link>
          ))}
          <div className="mobileNavExtras">
            <Link onClick={() => setMenuOpen(false)} href="/profile">
              <AccountCircleOutlined />
              <span>Account</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/wishlist">
              <FavoriteBorder />
              <span>Wishlist{wishlist.length > 0 && ` (${wishlist.length})`}</span>
            </Link>
          </div>
        </nav>
        <div className="headerActions">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <Close /> : <Search />}
          </button>
          <Link
            className="secondaryHeaderAction"
            href="/wishlist"
            aria-label={`Wishlist with ${wishlist.length} items`}
          >
            <FavoriteBorder />
            {wishlist.length > 0 && <span>{wishlist.length}</span>}
          </Link>
          <Link
            className="secondaryHeaderAction"
            href="/profile"
            aria-label="Beauty profile and account"
          >
            <AccountCircleOutlined />
          </Link>
          <button onClick={openCart} aria-label={`Shopping bag with ${cartCount} items`}>
            <ShoppingBagOutlined />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </header>
      <button
        className={menuOpen ? "menuBackdrop open" : "menuBackdrop"}
        onClick={() => setMenuOpen(false)}
        aria-label="Close navigation menu"
        tabIndex={menuOpen ? 0 : -1}
      />
      <GlobalSearch open={searchOpen} onSearch={() => setSearchOpen(false)} />
    </>
  );
}
