import { PRODUCTS } from "../data/products";
import { productRepository } from "./productRepository";

test("getAll returns the catalogue in stable order without exposing the source array", () => {
  const products = productRepository.getAll();

  expect(products.map((product) => product.id)).toEqual(PRODUCTS.map((product) => product.id));
  expect(products).not.toBe(PRODUCTS);
});

test("getById accepts catalogue ID input and returns undefined when missing", () => {
  expect(productRepository.getById(7)?.slug).toBe("petal-skin-tint");
  expect(productRepository.getById("7")?.slug).toBe("petal-skin-tint");
  expect(productRepository.getById("missing")).toBeUndefined();
});

test("getBySlug returns the matching product and undefined when missing", () => {
  expect(productRepository.getBySlug("luminous-veil-serum")?.id).toBe(3);
  expect(productRepository.getBySlug("missing-product")).toBeUndefined();
});

test("getManyByIds preserves requested order and safely skips missing IDs", () => {
  expect(productRepository.getManyByIds([3, "1", 999, 2]).map((product) => product.id)).toEqual([3, 1, 2]);
  expect(productRepository.getManyByIds()).toEqual([]);
});
