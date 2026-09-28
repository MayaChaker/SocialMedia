import { PRODUCTS } from "../data/products";

const getAll = () => [...PRODUCTS];

const getById = (id) => PRODUCTS.find((product) => product.id === Number(id));

const getBySlug = (slug) => PRODUCTS.find((product) => product.slug === slug);

const getManyByIds = (ids = []) => ids
  .map((id) => getById(id))
  .filter(Boolean);

export const productRepository = Object.freeze({
  getAll,
  getById,
  getBySlug,
  getManyByIds,
});
