// Shared types for the catalogue and the commerce domain.

export type ProductId = number;

export type Category = "Skincare" | "Makeup" | "Sets";

/** Packaging shape drawn by ProductArt. */
export type ProductType =
  | "serum"
  | "bottle"
  | "pump"
  | "wand"
  | "gloss"
  | "mascara"
  | "tube"
  | "jar"
  | "lipstick"
  | "compact"
  | "palette"
  | "set";

/** Packaging material, see components/product-art/packaging.js. */
export type Packaging = "porcelain" | "blush" | "burgundy" | "lacquer";

/** Background tone class used behind product art. */
export type Tone = "ivory" | "blush" | "plum" | "sand" | "rose" | "sage" | "clay" | "espresso";

export interface Variant {
  id: string;
  name: string;
  /** Hex colour of the formula, used for swatches and product art. */
  swatch: string;
  price: number;
  stock: number;
}

interface ProductBase {
  id: ProductId;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  size: string;
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviews: number;
  note: string;
  description: string;
  ingredients: string;
  benefits: string[];
  texture: string;
  finish: string;
  ritual: string;
  order: string;
  matches: string[];
  color: Tone;
  variants?: Variant[];
  stock?: number;
}

/** A single item: drawn from its packaging type and material. */
export interface SingleProduct extends ProductBase {
  type: Exclude<ProductType, "set">;
  packaging: Packaging;
}

/** A set: drawn by composing the products it includes. */
export interface ProductSet extends ProductBase {
  type: "set";
  includes: ProductId[];
}

export type Product = SingleProduct | ProductSet;

/** A product as chosen by the shopper: the base product merged with the selected variant. */
export type ProductSelection = Product & {
  productId: ProductId;
  /** Unique per product + variant, e.g. "7:deep". */
  cartId: string;
  variantId?: string;
  selectedVariant?: string;
  swatch?: string;
};

export type CartLine = ProductSelection & { quantity: number };

/**
 * A bag line as persisted in localStorage. Only the identity fields are trusted;
 * everything else is re-read from the catalogue (older saves may carry stale data).
 */
export interface StoredCartLine {
  productId?: ProductId;
  id?: ProductId | string;
  variantId?: string;
  cartId?: string;
  quantity?: number | string;
  [key: string]: unknown;
}

export interface Promotion {
  /** Fraction taken off the subtotal, e.g. 0.1 for 10%. */
  rate: number;
  label: string;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  promotion: Promotion | null;
}
