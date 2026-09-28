const titles = {
  shop: "Shop",
  product: "Product",
  wishlist: "Wishlist",
  rituals: "Routine Builder",
  "shade-match": "Shade Match",
  profile: "Beauty Profile",
  about: "Our Story",
  care: "Customer Care",
};

export function getRouteMetadata(pathname) {
  const section = pathname.split("/").filter(Boolean)[0];
  return {
    title: section ? `${titles[section] || "Beauty"} | Veloura Beauty` : "Veloura Beauty — Beauty, considered.",
    description: section === "shop"
      ? "Shop considered skincare, makeup, and curated beauty rituals from Veloura Beauty."
      : "High-performance beauty essentials made for daily ritual.",
  };
}

export function syncRouteMetadata(pathname) {
  const metadata = getRouteMetadata(pathname);
  document.title = metadata.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", metadata.description);
}
