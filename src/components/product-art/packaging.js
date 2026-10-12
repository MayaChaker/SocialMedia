// Packaging materials for the Veloura range. Product data refers to these by key.
export const PACKAGING = {
  // Frosted porcelain glass with rose-gold caps: the core skincare range.
  porcelain: { body: "#f3ece5", cap: "#c28f7d", label: "#fbf7f2", ink: "#6d4b43" },
  // Blush-tinted glass for cleansers and balms.
  blush: { body: "#ecd2c8", cap: "#b47f6f", label: "#f9efe9", ink: "#6b433a" },
  // Deep burgundy for night products.
  burgundy: { body: "#5c2a35", cap: "#c99583", label: "#6d3541", ink: "#f2e2da" },
  // Black-cherry lacquer with warm gold trims: the colour range.
  lacquer: { body: "#2f1a1f", cap: "#c7a07c", label: "#3d242a", ink: "#ecd6c2" },
};

export const getPackaging = (key) => PACKAGING[key] || PACKAGING.porcelain;
