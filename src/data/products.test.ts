import { existsSync } from "fs";
import path from "path";
import { PRODUCTS } from "./products";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

test("every product and every shade has a photograph on disk", () => {
  const images = PRODUCTS.flatMap((product) => [
    product.image,
    ...(product.variants ?? []).map((variant) => variant.image),
  ]);
  const missing = images.filter((src) => !src || !existsSync(publicFile(src)));
  expect(missing).toEqual([]);
});

test("every catalog product has a unique identity", () => {
  expect(new Set(PRODUCTS.map((product) => product.id)).size).toBe(PRODUCTS.length);
  expect(new Set(PRODUCTS.map((product) => product.slug)).size).toBe(PRODUCTS.length);
});
