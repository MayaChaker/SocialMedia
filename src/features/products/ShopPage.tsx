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

interface ShopPageProps {
  /** Category segment from /shop/[category]; absent on /shop. */
  category?: string;
}

export default function ShopPage({ category }: ShopPageProps) {
  const { openCart } = useCartDrawer();
  const shop = useShopFilters(category);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const products = filterAndSortProducts(catalogue, shop.filters);
  const { query } = shop.filters;

  return (
    <main className="shopPage">
      <ShopToolbar
        shop={shop}
        resultCount={products.length}
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
            <ProductCard key={product.id} product={product} onAdded={openCart} shopLayout />
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <span className="kicker">Nothing here yet</span>
          <h2>{query ? `No products found for “${query}”` : "No products match"}</h2>
          <p>Try another category, search, or remove the active filters.</p>
          <button className="button dark" onClick={shop.clearAll}>
            View all products
          </button>
        </div>
      )}
    </main>
  );
}
