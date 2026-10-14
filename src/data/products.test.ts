import { existsSync } from "fs";
import path from "path";
import { PHOTO_CREDITS } from "./photoCredits";
import { PRODUCTS } from "./products";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

test("every product has a photograph on disk", () => {
  const missing = PRODUCTS.filter(({ image }) => !image || !existsSync(publicFile(image)));
  expect(missing.map((product) => product.slug)).toEqual([]);
});

test("every product has a photo credit", () => {
  const uncredited = PRODUCTS.filter((product) => !PHOTO_CREDITS[product.slug]);
  expect(uncredited.map((product) => product.slug)).toEqual([]);
});

test("every catalog product has a unique identity", () => {
  expect(new Set(PRODUCTS.map((product) => product.id)).size).toBe(PRODUCTS.length);
  expect(new Set(PRODUCTS.map((product) => product.slug)).size).toBe(PRODUCTS.length);
});
