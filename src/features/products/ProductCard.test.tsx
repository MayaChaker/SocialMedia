import { fireEvent, render, screen } from "@testing-library/react";
import { productRepository } from "../../repositories/productRepository";
import { CommerceProvider } from "../../hooks/useCommerce";
import type { Product } from "../../types/commerce";
import ProductCard from "./ProductCard";

const renderCard = (product: Product) =>
  render(
    <CommerceProvider>
      <ProductCard product={product} />
    </CommerceProvider>,
  );

const stored = (key: string) => JSON.parse(window.localStorage.getItem(key) ?? "null");

const catalogueProduct = (product: Product | undefined): Product => {
  if (!product) throw new Error("Expected product is missing from the catalogue");
  return product;
};

test("a shade selection updates the product art and the added cart variant", () => {
  const product = catalogueProduct(productRepository.getBySlug("petal-skin-tint"));
  renderCard(product);
  expect(screen.getByRole("img", { name: product.name })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Choose shade" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Select Mahogany 09 shade" }));
  expect(screen.getByRole("img", { name: `${product.name} in Mahogany 09` })).toBeTruthy();
  expect(screen.getByText("Shade: Mahogany 09")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Add to bag" }));
  const cart = stored("velouraBeauty.cart.v2");
  expect(cart[0]).toMatchObject({
    productId: product.id,
    variantId: "deep",
    selectedVariant: "Mahogany 09",
    cartId: `${product.id}:deep`,
  });
  expect(cart[0].swatch).toBe("#503127");
});

test("wishlist remains functional on a refined card", () => {
  const product = catalogueProduct(productRepository.getAll()[0]);
  renderCard(product);
  fireEvent.click(screen.getByRole("button", { name: `Add ${product.name} to wishlist` }));
  expect(stored("velouraBeauty.wishlist.v1")).toEqual([product.id]);
});
