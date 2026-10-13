// Shared types for what a shopper saves about themselves.

import type { ProductId } from "./commerce";

export interface BeautyProfile {
  skinGoals: string[];
  skinType: string;
  preferences: string[];
  /** Set by the shade finder. */
  shade?: string;
  shadeVariantId?: string;
  shadeAnswers?: Partial<Record<string, string>>;
}

export interface SavedRoutine {
  productIds: ProductId[];
  answers: Record<string, string>;
}

/**
 * Older saves stored the routine as a bare list of product ids or names,
 * so readers must accept both shapes.
 */
export type StoredRoutine = SavedRoutine | Array<ProductId | string>;
