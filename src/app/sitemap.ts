import type { MetadataRoute } from "next";
import { CATEGORIES } from "../features/products/shopLogic";
import { productRepository } from "../repositories/productRepository";
import { POLICIES } from "../data/policies";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/shop",
    ...CATEGORIES.map((category) => `/shop/${category}`),
    ...productRepository.getAll().map((product) => `/product/${product.slug}`),
    "/rituals",
    "/shade-match",
    "/about",
    ...Object.keys(POLICIES).map((policy) => `/care/${policy}`),
  ];
  return paths.map((path) => ({ url: `${SITE}${path}` }));
}
