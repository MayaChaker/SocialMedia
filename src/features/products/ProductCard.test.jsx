import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PRODUCTS } from "../../data/products";
import { StoreProvider } from "../../hooks/useStore";
import ProductCard from "./ProductCard";

const renderCard = (product) => render(<StoreProvider><MemoryRouter><ProductCard product={product}/></MemoryRouter></StoreProvider>);

beforeEach(() => window.localStorage.clear());

test("a shade selection changes the product image and the added cart variant", () => {
  const product = PRODUCTS.find((item) => item.slug === "petal-skin-tint");
  renderCard(product);
  const image = screen.getByRole("img", { name: product.name });
  expect(image.getAttribute("src")).toContain("petal-skin-tint-porcelain.webp");
  fireEvent.click(screen.getByRole("button", { name: "Select Deep shade" }));
  expect(image.getAttribute("src")).toContain("petal-skin-tint-deep.webp");
  expect(screen.getByText("Shade: Deep")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Add to bag" }));
  const cart = JSON.parse(window.localStorage.getItem("velouraBeauty.cart.v2"));
  expect(cart[0]).toMatchObject({ productId: product.id, variantId: "deep", selectedVariant: "Deep", cartId: `${product.id}:deep` });
  expect(cart[0].image).toContain("petal-skin-tint-deep.webp");
});

test("wishlist remains functional on a refined card", () => {
  const product = PRODUCTS[0];
  renderCard(product);
  fireEvent.click(screen.getByRole("button", { name: `Add ${product.name} to wishlist` }));
  expect(JSON.parse(window.localStorage.getItem("velouraBeauty.wishlist.v1"))).toEqual([product.id]);
});
