import type { MenuColumn, MenuLink } from "./navigation";

const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "care@velourabeauty.com";

/** Footer link columns. Socials and payment methods are separate because they are not set yet. */
export const FOOTER_COLUMNS: readonly MenuColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "Makeup", href: "/shop/makeup" },
      { label: "Skincare", href: "/shop/skincare" },
      { label: "Fragrance", href: "/shop/fragrance" },
      { label: "Hair", href: "/shop/hair" },
      { label: "Brands A–Z", href: "/brands" },
      { label: "New arrivals", href: "/shop?collection=new" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact us", href: `mailto:${contact}` },
      { label: "FAQ", href: "/care/faq" },
      { label: "Shipping & returns", href: "/care/shipping" },
      { label: "Refund policy", href: "/care/refund" },
      { label: "Track an order", href: "/care/track" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Routine builder", href: "/rituals" },
      { label: "Shade match", href: "/shade-match" },
      { label: "Accessibility", href: "/care/accessibility" },
    ],
  },
];

/**
 * Veloura has no social accounts yet. Add real profile URLs here and the footer shows
 * a Socials column; while the list is empty the column is not rendered.
 */
export const SOCIAL_LINKS: readonly MenuLink[] = [];

/**
 * Checkout is a demo and takes no payment, so no payment method is shown. Add the
 * methods a real payment provider accepts and the footer lists them.
 */
export const PAYMENT_METHODS: readonly string[] = [];

export const LEGAL_LINKS: readonly MenuLink[] = [
  { label: "Privacy", href: "/care/privacy" },
  { label: "Terms", href: "/care/terms" },
];
