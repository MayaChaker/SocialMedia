import { productRepository } from "../../repositories/productRepository";

const SITE = "Veloura Beauty";
const DEFAULT_DESCRIPTION = "High-performance beauty essentials made for daily ritual.";

const titles = {
  shop: "Shop",
  wishlist: "Wishlist",
  rituals: "Routine Builder",
  "shade-match": "Shade Match",
  profile: "Beauty Profile",
  about: "Our Story",
  care: "Customer Care",
};

export function getRouteMetadata(pathname) {
  const [section, slug] = pathname.split("/").filter(Boolean);
  if (!section) return { title: `${SITE} — Beauty, considered.`, description: DEFAULT_DESCRIPTION };

  if (section === "product") {
    const product = productRepository.getBySlug(slug);
    return product
      ? { title: `${product.name} | ${SITE}`, description: product.description }
      : { title: `Page not found | ${SITE}`, description: DEFAULT_DESCRIPTION };
  }

  return {
    title: `${titles[section] || "Page not found"} | ${SITE}`,
    description:
      section === "shop"
        ? "Shop considered skincare, makeup, and curated beauty rituals from Veloura Beauty."
        : DEFAULT_DESCRIPTION,
  };
}

export function syncRouteMetadata(pathname) {
  const metadata = getRouteMetadata(pathname);
  document.title = metadata.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", metadata.description);
}
