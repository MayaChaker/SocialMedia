"use client";

import { useState } from "react";
import { productRepository } from "../../repositories/productRepository";
import { useCartDrawer } from "../../hooks/useCartDrawer";
import ActiveFilters from "./ActiveFilters";
import FilterDrawer from "./FilterDrawer";
import ProductCard from "./ProductCard";
import ShopToolbar from "./ShopToolbar";
import { filterAndSortProducts } from "./shopLogic";
import { useShopFilters } from "./useShopFilters";

const catalogue = productRepository.getAll();

const TITLES: Record<string, string> = {
  all: "All products",
  new: "New arrivals",
  makeup: "Makeup",
  skincare: "Skincare",
  fragrance: "Fragrance",
  hair: "Hair",
};

interface ShopPageProps {
  /** Category segment from /shop/[category]; absent on /shop. */
  category?: string;
}

export default function ShopPage({ category }: ShopPageProps) {
  const { openCart } = useCartDrawer();
  const shop = useShopFilters(category);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const products = filterAndSortProducts(catalogue, shop.filters);
  const { query, collection } = shop.filters;
  const title =
    collection === "bestsellers" ? "Bestsellers" : (TITLES[shop.activeCategory] ?? "All products");

  return (
    <main className="shopPage">
      <header className="shopHead">
        <p className="kicker">Shop</p>
        <h1>{title}</h1>
        <p className="shopCount" aria-live="polite">
          <strong>{products.length}</strong> {products.length === 1 ? "product" : "products"}
          {query && <span> for “{query}”</span>}
        </p>
      </header>
      <ShopToolbar
        shop={shop}
        filtersOpen={filtersOpen}
        onOpenFilters={() => setFiltersOpen(true)}
      />
      <ActiveFilters shop={shop} />
      <FilterDrawer
        shop={shop}
        open={filtersOpen}
        resultCount={products.length}
        onClose={() => setFiltersOpen(false)}
      />
      {products.length ? (
        <div className="productGrid shopGrid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdded={openCart} />
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <span className="kicker">Nothing here yet</span>
          <h2>{query ? `No products found for “${query}”` : "No products match"}</h2>
          <p>Try another category or search, or remove the filters in use.</p>
          <button className="button dark" onClick={shop.clearAll}>
            View all products
          </button>
        </div>
      )}
    </main>
  );
}
