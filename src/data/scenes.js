// Art direction for the illustrated still lifes used across the site.
// Each item references a product by slug; x/scale place it on a 600 × 400 stage.

const BURGUNDY_STUDIO = { wall: "#57283a", arch: "#663243", plinth: "#d8c2b4" };
const WARM_STONE = { wall: "#dcc6b6", arch: "#eadbd0", plinth: "#c6a998" };
const BLUSH_ROOM = { wall: "#e8d3ca", arch: "#f4e7e0", plinth: "#d6bdb1" };

export const SCENES = {
  hero: {
    ...BURGUNDY_STUDIO,
    items: [
      { slug: "restorative-night-cream", x: 372, scale: 0.88 },
      { slug: "luminous-veil-serum", x: 236, scale: 1.08 },
      { slug: "velvet-ritual-lip", tint: "#713846", x: 304, scale: 0.86 },
    ],
  },
  eveningEdit: {
    ...BURGUNDY_STUDIO,
    items: [
      { slug: "cloud-melt-cleanser", x: 214, scale: 0.92 },
      { slug: "restorative-night-cream", x: 386, scale: 0.86 },
      { slug: "luminous-veil-serum", x: 300, scale: 1.02 },
    ],
  },
  skincare: {
    ...BLUSH_ROOM,
    items: [
      { slug: "petal-water-essence", x: 256, scale: 1.02 },
      { slug: "luminous-veil-serum", x: 344, scale: 0.94 },
    ],
  },
  makeup: {
    wall: "#764553",
    arch: "#875463",
    plinth: "#d4b3a6",
    items: [
      { slug: "cloud-cheek-colour", tint: "#cf8991", x: 350, scale: 0.78 },
      { slug: "velvet-ritual-lip", tint: "#8f4f58", x: 252, scale: 0.98 },
    ],
  },
  sets: {
    ...WARM_STONE,
    items: [
      { slug: "cloud-melt-cleanser", x: 222, scale: 0.86 },
      { slug: "restorative-night-cream", x: 380, scale: 0.8 },
      { slug: "luminous-veil-serum", x: 300, scale: 0.98 },
    ],
  },
  newArrivals: {
    wall: "#e3c6c1",
    arch: "#efdcd8",
    plinth: "#cdaea6",
    items: [
      { slug: "noir-lift-mascara", x: 236, scale: 0.92 },
      { slug: "soft-light-palette", x: 372, scale: 0.7 },
      { slug: "luminous-lip-oil", x: 296, scale: 0.98 },
    ],
  },
  campaign: {
    ...WARM_STONE,
    // The About hero overlays its heading on the left, so the still life sits right.
    shift: 120,
    plinthWidth: 360,
    items: [
      { slug: "petal-water-essence", x: 196, scale: 0.7 },
      { slug: "restorative-night-cream", x: 404, scale: 0.6 },
      { slug: "luminous-veil-serum", x: 264, scale: 0.78 },
      { slug: "velvet-ritual-lip", tint: "#8f4f58", x: 330, scale: 0.64 },
    ],
  },
  lipstickShades: {
    ...BURGUNDY_STUDIO,
    items: [
      { slug: "velvet-ritual-lip", tint: "#b96c78", x: 210, scale: 0.78 },
      { slug: "velvet-ritual-lip", tint: "#32131d", x: 390, scale: 0.78 },
      { slug: "velvet-ritual-lip", tint: "#8f4f58", x: 255, scale: 0.86 },
      { slug: "velvet-ritual-lip", tint: "#4f2330", x: 345, scale: 0.86 },
      { slug: "velvet-ritual-lip", tint: "#713846", x: 300, scale: 0.94 },
    ],
  },
  morningLayers: {
    ...BLUSH_ROOM,
    items: [
      { slug: "petal-water-essence", x: 220, scale: 0.94 },
      { slug: "daily-silk-spf-50", x: 382, scale: 0.86 },
      { slug: "luminous-veil-serum", x: 300, scale: 1.04 },
    ],
  },
};
