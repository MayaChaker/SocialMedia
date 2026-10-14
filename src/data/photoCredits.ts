/**
 * Every photograph comes from Unsplash under the Unsplash License, which allows free use
 * without permission. Credits are kept anyway.
 */
export interface PhotoCredit {
  photographer: string;
  source: string;
}

/** Product photographs, keyed by product slug. */
export const PHOTO_CREDITS: Record<string, PhotoCredit> = {
  "chanel-no-5-eau-de-parfum": {
    photographer: "Sofía Klimavicius",
    source: "https://images.unsplash.com/photo-1658266844003-1c4ed7bb49a4",
  },
  "chanel-gabrielle-eau-de-parfum": {
    photographer: "Laura Chouette",
    source: "https://images.unsplash.com/photo-1590156221350-bbf9f89cd368",
  },
  "dior-sauvage-eau-de-parfum": {
    photographer: "Farhan Chohan",
    source: "https://images.unsplash.com/photo-1747916148863-7164d8920b57",
  },
  "miss-dior-blooming-bouquet": {
    photographer: "Annie Le",
    source: "https://images.unsplash.com/photo-1678984633768-c4fd5a01732a",
  },
  "dior-jadore-eau-de-parfum": {
    photographer: "Irina Rybcko",
    source: "https://images.unsplash.com/photo-1703161560568-72b2e0e4dd7e",
  },
  "dior-poison-girl": {
    photographer: "Cristina P",
    source: "https://images.unsplash.com/photo-1625207695351-5555c02a4db0",
  },
  "dior-homme-sport": {
    photographer: "Pirvu Alex",
    source: "https://images.unsplash.com/photo-1604588715397-aa9b2fa10fa5",
  },
  "ysl-libre-eau-de-parfum": {
    photographer: "Pavlo Talpa",
    source: "https://images.unsplash.com/photo-1724157073080-fcffb8d6c956",
  },
  "ysl-y-eau-de-parfum": {
    photographer: "One91creative",
    source: "https://images.unsplash.com/photo-1761845047498-56827f416735",
  },
  "gucci-guilty-pour-femme": {
    photographer: "Andrey Ilkevich",
    source: "https://images.unsplash.com/photo-1619007556336-4d99b008471e",
  },
  "gucci-memoire-dune-odeur": {
    photographer: "Anna Keibalo",
    source: "https://images.unsplash.com/photo-1687198193157-7914b3ccdb91",
  },
  "jo-malone-wood-sage-sea-salt": {
    photographer: "Maria Lupan",
    source: "https://images.unsplash.com/photo-1688413580186-fdec38c39553",
  },
  "chanel-rouge-allure": {
    photographer: "Cat Han",
    source: "https://images.unsplash.com/photo-1617229649830-3c949e1fabbe",
  },
  "lancome-labsolu-rouge": {
    photographer: "Amanda Dalbjörn",
    source: "https://images.unsplash.com/photo-1542452255191-c85a98f2c5d1",
  },
  "mac-matte-lipstick": {
    photographer: "Barbara Barbara",
    source: "https://images.unsplash.com/photo-1615967747773-5c9d58c57eef",
  },
  "nars-lipstick": {
    photographer: "Pavlo Talpa",
    source: "https://images.unsplash.com/photo-1729016723287-30f88a7fc59a",
  },
  "nars-radiant-creamy-concealer": {
    photographer: "Karly Jones",
    source: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc",
  },
  "nars-eyeshadow-palette": {
    photographer: "siyan li",
    source: "https://images.unsplash.com/photo-1583280157557-63caa755ba13",
  },
  "estee-lauder-double-wear": {
    photographer: "Denisa-Elena Ficau",
    source: "https://images.unsplash.com/photo-1776015036380-4022fe844ed8",
  },
  "dior-backstage-face-body-foundation": {
    photographer: "Mercy",
    source: "https://images.unsplash.com/photo-1577036251102-9cf1285e487a",
  },
  "dior-forever-foundation": {
    photographer: "Hitesh Dewasi",
    source: "https://images.unsplash.com/photo-1599733589046-10c005739ef9",
  },
  "armani-luminous-silk-foundation": {
    photographer: "Karly Jones",
    source: "https://images.unsplash.com/photo-1557205465-f3762edea6d3",
  },
  "abh-modern-renaissance-palette": {
    photographer: "Paola Aguilar",
    source: "https://images.unsplash.com/photo-1547934659-7fa699ef3ce0",
  },
  "maybelline-the-city-mini-palette": {
    photographer: "Andrey Ilkevich",
    source: "https://images.unsplash.com/photo-1748408361384-11446ba79316",
  },
  "too-faced-better-than-sex-mascara": {
    photographer: "Annie Spratt",
    source: "https://images.unsplash.com/photo-1512207159096-c2c91b1dfadd",
  },
  "glossier-cloud-paint": {
    photographer: "Reuben Mansell",
    source: "https://images.unsplash.com/photo-1629198702514-dbb6bc305224",
  },
  "the-ordinary-hyaluronic-acid-2-b5": {
    photographer: "Isaac Wolff",
    source: "https://images.unsplash.com/photo-1715027155125-810cb995203f",
  },
  "the-ordinary-salicylic-acid-2": {
    photographer: "soroush chr",
    source: "https://images.unsplash.com/photo-1719132881586-9f54b7016f4c",
  },
  "the-ordinary-aha-30-bha-2-peeling-solution": {
    photographer: "Okan You",
    source: "https://images.unsplash.com/photo-1582103645388-b85304592cb0",
  },
  "glossier-milky-jelly-cleanser": {
    photographer: "Reuben Mansell",
    source: "https://images.unsplash.com/photo-1629198726018-604230bdb091",
  },
  "glossier-invisible-shield-spf-35": {
    photographer: "Reuben Mansell",
    source: "https://images.unsplash.com/photo-1629198716082-b92910910a59",
  },
  "glossier-solution": {
    photographer: "Reuben Mansell",
    source: "https://images.unsplash.com/photo-1629198735660-e39ea93f5c18",
  },
  "la-roche-posay-effaclar-mat": {
    photographer: "Cosmin Ursea",
    source: "https://images.unsplash.com/photo-1641130290711-01c4c4558562",
  },
  "la-roche-posay-lipikar-baume-ap": {
    photographer: "Polina Zimenkova",
    source: "https://images.unsplash.com/photo-1680461494862-754e01607c83",
  },
  "uriage-eau-thermale-water-cream": {
    photographer: "Isaac Wolff",
    source: "https://images.unsplash.com/photo-1708642448328-37631ca58d65",
  },
  "olaplex-no-6-bond-smoother": {
    photographer: "Shayna Douglas",
    source: "https://images.unsplash.com/photo-1642005801149-b33da87c1175",
  },
};

/** Homepage photographs in public/images/editorial, keyed by file name. */
export const EDITORIAL_CREDITS: Record<string, PhotoCredit> = {
  hero: {
    photographer: "Ayo Ogunseinde",
    source: "https://images.unsplash.com/photo-1791292183261-158a21a5e713",
  },
  "category-makeup": {
    photographer: "Good Faces",
    source: "https://images.unsplash.com/photo-1632765866070-3fadf25d3d5b",
  },
  "category-skincare": {
    photographer: "Fleur Kaan",
    source: "https://images.unsplash.com/photo-1581182800629-7d90925ad072",
  },
  "category-fragrance": {
    photographer: "Olena Bohovyk",
    source: "https://images.unsplash.com/photo-1598121496608-3d0b9627155e",
  },
  "category-hair": {
    photographer: "Hadis Safari",
    source: "https://images.unsplash.com/photo-1535579710123-3c0f261c474e",
  },
  "evening-routine": {
    photographer: "Laura Jaeger",
    source: "https://images.unsplash.com/photo-1670201203208-055d6d79db4a",
  },
  "shop-the-look": {
    photographer: "Daria Gordova",
    source: "https://images.unsplash.com/photo-1611605472181-7962c1c85ed5",
  },
};
