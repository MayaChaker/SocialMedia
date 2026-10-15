import type { Category } from "../types/commerce";
import { BRANDS, FEATURED_BRANDS, brandHref, brandSlug } from "./brands";
import { PRODUCTS } from "./products";
import { SUBCATEGORIES } from "./subcategories";

export interface MenuLink {
  label: string;
  href: string;
}

export interface MenuColumn {
  title: string;
  links: MenuLink[];
}

export interface MenuItem extends MenuLink {
  /** Off until the section has products; turning it on is a one-word change. */
  enabled: boolean;
  /** Catalogue category whose subcategories and brands fill the mega-menu panel. */
  category?: Category;
  /** The Brands item opens a panel of featured brands. */
  brands?: boolean;
}

/** The main menu, in order. Body, Tools and Sale wait for products. */
export const MENU: readonly MenuItem[] = [
  { label: "Makeup", href: "/shop/makeup", category: "Makeup", enabled: true },
  { label: "Skincare", href: "/shop/skincare", category: "Skincare", enabled: true },
  { label: "Fragrance", href: "/shop/fragrance", category: "Fragrance", enabled: true },
  { label: "Hair", href: "/shop/hair", category: "Hair", enabled: true },
  { label: "Body", href: "/shop/body", enabled: false },
  { label: "Tools", href: "/shop/tools", enabled: false },
  { label: "Brands", href: "/brands", brands: true, enabled: true },
  { label: "New", href: "/shop?collection=new", enabled: true },
  { label: "Sale", href: "/shop?collection=sale", enabled: false },
];

export const NAVIGATION: readonly MenuItem[] = MENU.filter((item) => item.enabled);

const MAX_BRANDS = 6;

/** The columns of an item's mega-menu panel, built from the catalogue; empty for plain links. */
export function menuColumns(item: MenuItem): MenuColumn[] {
  if (item.brands)
    return [
      {
        title: "Featured brands",
        links: FEATURED_BRANDS.map((brand) => ({ label: brand.name, href: brandHref(brand.slug) })),
      },
      {
        title: "Discover",
        links: [{ label: `All ${BRANDS.length} brands A–Z`, href: "/brands" }],
      },
    ];
  if (!item.category) return [];

  const inCategory = PRODUCTS.filter((product) => product.category === item.category);
  const types = SUBCATEGORIES[item.category]
    .filter((sub) => inCategory.some((product) => product.subcategory === sub.slug))
    .map((sub) => ({ label: sub.label, href: `${item.href}?sub=${sub.slug}` }));
  const brandCounts = inCategory.reduce<Record<string, number>>((counts, product) => {
    counts[product.brand] = (counts[product.brand] ?? 0) + 1;
    return counts;
  }, {});
  const brands = Object.entries(brandCounts)
    .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
    .slice(0, MAX_BRANDS)
    .map(([name]) => ({ label: name, href: brandHref(brandSlug(name)) }));

  return [
    {
      title: `Shop ${item.label.toLowerCase()}`,
      links: [{ label: `All ${item.label.toLowerCase()}`, href: item.href }, ...types],
    },
    { title: "Featured brands", links: brands },
  ];
}
