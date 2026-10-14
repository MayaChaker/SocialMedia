import { productRepository } from "../../repositories/productRepository";
import type { Product } from "../../types/commerce";
import { filterAndSortProducts, searchableProductText, type ShopFilters } from "./shopLogic";

const PRODUCTS = productRepository.getAll();

const options: ShopFilters = {
  category: "",
  collection: "",
  query: "",
  concern: "",
  underFifty: false,
  inStock: false,
  sort: "featured",
};

test("search covers shade names and product benefits", () => {
  const foundation = PRODUCTS.find(
    (product) => product.slug === "estee-lauder-double-wear",
  ) as Product;
  expect(searchableProductText(foundation)).toContain("6w1 sandalwood");
  expect(
    filterAndSortProducts(PRODUCTS, { ...options, query: "broad-spectrum" }).map(
      (product) => product.slug,
    ),
  ).toContain("glossier-invisible-shield-spf-35");
});

test("multiple filters combine", () => {
  const results = filterAndSortProducts(PRODUCTS, {
    ...options,
    category: "skincare",
    concern: "Dehydration",
    underFifty: true,
  });
  expect(results.length).toBeGreaterThan(0);
  expect(
    results.every(
      (product) =>
        product.category === "Skincare" &&
        product.price < 50 &&
        product.matches.includes("Dehydration"),
    ),
  ).toBe(true);
});

test("price sorting is correct", () => {
  const low = filterAndSortProducts(PRODUCTS, { ...options, sort: "price-low" });
  const high = filterAndSortProducts(PRODUCTS, { ...options, sort: "price-high" });
  expect(low[0]?.price).toBe(Math.min(...PRODUCTS.map((product) => product.price)));
  expect(high[0]?.price).toBe(Math.max(...PRODUCTS.map((product) => product.price)));
});
