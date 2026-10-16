"use client";

import { useState } from "react";
import Link from "next/link";
import { Close, Tune } from "@mui/icons-material";
import { getBrand } from "../../data/brands";
import { SUBCATEGORIES } from "../../data/subcategories";
import { productRepository } from "../../repositories/productRepository";
import { useCartDrawer } from "../../hooks/useCartDrawer";
import Breadcrumb, { type Crumb } from "../../components/ui/Breadcrumb";
import Button from "../../components/ui/Button";
import Drawer from "../../components/ui/Drawer";
import { Select } from "../../components/ui/Field";
import FiltersSidebar, { type FilterGroup } from "../../components/ui/FiltersSidebar";
import Pagination from "../../components/ui/Pagination";
import ProductGrid, { ProductGridItem } from "../../components/ui/ProductGrid";
import type { Category } from "../../types/commerce";
import ProductCard from "./ProductCard";
import {
  CATEGORIES,
  PAGE_SIZE,
  PRICE_BANDS,
  SORT_OPTIONS,
  facetCounts,
  filterAndSortProducts,
  pageCount,
} from "./shopLogic";
import { useShopFilters } from "./useShopFilters";
import styles from "./ShopPage.module.css";

const catalogue = productRepository.getAll();

const CATEGORY_LABELS: Record<string, { label: string; category: Category }> = {
  makeup: { label: "Makeup", category: "Makeup" },
  skincare: { label: "Skincare", category: "Skincare" },
  fragrance: { label: "Fragrance", category: "Fragrance" },
  hair: { label: "Haircare", category: "Hair" },
};

const plural = (count: number) => `${count} ${count === 1 ? "product" : "products"}`;

interface ShopPageProps {
  /** Category segment from /shop/[category]. */
  category?: string;
  /** Brand slug from /brands/[slug]. */
  brandSlug?: string;
  /** The /search results page. */
  search?: boolean;
}

/**
 * Every product listing: the shop, a category, a brand and search results. Filters live
 * in the URL; the sidebar sits beside the grid on desktop and in a drawer on phones.
 */
export default function ShopPage({ category, brandSlug, search = false }: ShopPageProps) {
  const { openCart } = useCartDrawer();
  const brand = brandSlug ? getBrand(brandSlug) : undefined;
  const shop = useShopFilters({ category, brand: brand?.name });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { filters } = shop;

  const products = filterAndSortProducts(catalogue, filters);
  const counts = facetCounts(catalogue, filters);
  const pages = pageCount(products.length);
  const page = Math.min(shop.page, pages);
  const visible = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const current = category ? CATEGORY_LABELS[category] : undefined;
  const subs = current
    ? SUBCATEGORIES[current.category]
        .map((sub) => ({
          ...sub,
          count: catalogue.filter(
            (product) => product.category === current.category && product.subcategory === sub.slug,
          ).length,
        }))
        .filter((sub) => sub.count > 0)
    : [];

  const title = brand
    ? brand.name
    : search
      ? filters.query
        ? `Results for “${filters.query}”`
        : "Search"
      : filters.collection === "new"
        ? "New in"
        : filters.collection === "bestsellers"
          ? "Bestsellers"
          : (current?.label ?? "All products");

  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];
  if (brand) crumbs.push({ label: "Brands", href: "/brands" }, { label: brand.name });
  else if (search) crumbs.push({ label: "Search" });
  else {
    crumbs.push({ label: "Shop", href: "/shop" });
    if (current) crumbs.push({ label: current.label, href: `/shop/${category}` });
    const sub = subs.find((item) => item.slug === filters.subcategory);
    if (sub) crumbs.push({ label: sub.label });
  }

  const groups: FilterGroup[] = [
    ...(!category && !brand && !search
      ? [
          {
            id: "category",
            legend: "Category",
            multiple: false,
            selected: [],
            onChange: ([value]: string[]) => shop.goToCategory(value ?? ""),
            options: CATEGORIES.map((segment) => ({
              value: segment,
              label: CATEGORY_LABELS[segment]?.label ?? segment,
              count: catalogue.filter(
                (product) => product.category === CATEGORY_LABELS[segment]?.category,
              ).length,
            })),
          },
        ]
      : []),
    ...(!brand
      ? [
          {
            id: "brand",
            legend: "Brand",
            multiple: true,
            selected: filters.brands,
            onChange: shop.setBrands,
            options: counts.brands.map(([name, count]) => ({ value: name, label: name, count })),
          },
        ]
      : []),
    {
      id: "price",
      legend: "Price",
      multiple: true,
      selected: filters.prices,
      onChange: shop.setPrices,
      options: counts.prices.map(([slug, count]) => ({
        value: slug,
        label: PRICE_BANDS.find((band) => band.slug === slug)?.label ?? slug,
        count,
      })),
    },
    {
      id: "stock",
      legend: "Availability",
      multiple: true,
      selected: filters.inStock ? ["in"] : [],
      onChange: (values: string[]) => shop.setInStock(values.includes("in")),
      options: [{ value: "in", label: "In stock", count: counts.inStock }],
    },
  ];

  const chips = [
    ...filters.brands.map((name) => ({
      label: name,
      remove: () => shop.setBrands(filters.brands.filter((value) => value !== name)),
    })),
    ...filters.prices.map((slug) => ({
      label: PRICE_BANDS.find((band) => band.slug === slug)?.label ?? slug,
      remove: () => shop.setPrices(filters.prices.filter((value) => value !== slug)),
    })),
    ...(filters.inStock ? [{ label: "In stock", remove: () => shop.setInStock(false) }] : []),
  ];

  const sidebar = <FiltersSidebar groups={groups} onClear={shop.clearFilters} />;

  return (
    <main className={styles.page}>
      <Breadcrumb items={crumbs} />
      <header className={styles.head}>
        {brand && <p className="text-label text-muted">Brand</p>}
        <h1>{title}</h1>
        <p className="text-small text-muted" aria-live="polite">
          {plural(products.length)}
        </p>
      </header>

      {subs.length > 0 && (
        <nav className={styles.subs} aria-label={`${current?.label} types`}>
          <Link href={shop.hrefForSub()} aria-current={!filters.subcategory ? "page" : undefined}>
            All
          </Link>
          {subs.map((sub) => (
            <Link
              key={sub.slug}
              href={shop.hrefForSub(sub.slug)}
              aria-current={filters.subcategory === sub.slug ? "page" : undefined}
            >
              {sub.label} <span>{sub.count}</span>
            </Link>
          ))}
        </nav>
      )}

      <div className={styles.toolbar}>
        <button type="button" className={styles.filterButton} onClick={() => setFiltersOpen(true)}>
          <Tune aria-hidden="true" />
          Filters{shop.filterCount > 0 && ` (${shop.filterCount})`}
        </button>
        {chips.length > 0 && (
          <ul className={styles.chips} aria-label="Filters in use">
            {chips.map((chip) => (
              <li key={chip.label}>
                <button type="button" onClick={chip.remove} aria-label={`Remove ${chip.label}`}>
                  {chip.label}
                  <Close aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.sort}>
          <Select
            label="Sort by"
            hideLabel
            value={filters.sort}
            onChange={(event) => shop.setSort(event.target.value)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar} aria-label="Filters">
          {sidebar}
        </aside>
        <div>
          {visible.length ? (
            <>
              <ProductGrid>
                {visible.map((product, index) => (
                  <ProductGridItem key={product.id}>
                    <ProductCard product={product} onAdded={openCart} priority={index < 2} />
                  </ProductGridItem>
                ))}
              </ProductGrid>
              <div className={styles.pagination}>
                <p className="text-small text-muted">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + visible.length} of{" "}
                  {products.length}
                </p>
                <Pagination page={page} pageCount={pages} hrefFor={shop.hrefForPage} />
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <h2 className="text-h3">
                {filters.query ? `Nothing found for “${filters.query}”` : "No products match"}
              </h2>
              <p className="text-muted">
                Try another search, or remove a filter to see more products.
              </p>
              <div className={styles.emptyActions}>
                {shop.filterCount > 0 && (
                  <Button variant="secondary" onClick={shop.clearFilters}>
                    Clear filters
                  </Button>
                )}
                <Button href="/shop">View all products</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <Button fullWidth onClick={() => setFiltersOpen(false)}>
            Show {plural(products.length)}
          </Button>
        }
      >
        {sidebar}
      </Drawer>
    </main>
  );
}
