import { PRODUCTS } from "../data/products";
import type { Product, ProductId } from "../types/commerce";

const getAll = (): Product[] => [...PRODUCTS];

/** Accepts string ids too, because ids read back from storage or URLs may be strings. */
const getById = (id: ProductId | string | undefined): Product | undefined =>
  PRODUCTS.find((product) => product.id === Number(id));

const getBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((product) => product.slug === slug);

const getManyByIds = (ids: Array<ProductId | string> = []): Product[] =>
  ids.map((id) => getById(id)).filter((product): product is Product => Boolean(product));

export const productRepository = Object.freeze({
  getAll,
  getById,
  getBySlug,
  getManyByIds,
});
