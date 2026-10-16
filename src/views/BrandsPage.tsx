import { BRANDS } from "../data/brands";
import { PRODUCTS } from "../data/products";
import Breadcrumb from "../components/ui/Breadcrumb";
import type { Category } from "../types/commerce";
import BrandDirectory, { type BrandEntry } from "./BrandDirectory";
import styles from "./BrandsPage.module.css";

const CATEGORY_LABEL: Partial<Record<Category, string>> = { Hair: "Haircare" };
const FEATURED_COUNT = 6;

/** Every brand with the categories Veloura carries from it and one of its products to picture it. */
const ENTRIES: BrandEntry[] = BRANDS.map((brand) => {
  const products = PRODUCTS.filter((product) => product.brand === brand.name);
  return {
    ...brand,
    categories: [
      ...new Set(products.map((product) => CATEGORY_LABEL[product.category] ?? product.category)),
    ],
    product: products.find((product) => product.isBestseller) ?? products[0],
  };
});

/** The brands with the widest selection, shown with a photograph above the full list. */
const FEATURED = [...ENTRIES]
  .sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name))
  .slice(0, FEATURED_COUNT);

export default function BrandsPage() {
  return (
    <main className={styles.page}>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />
      <BrandDirectory brands={ENTRIES} featured={FEATURED} />
    </main>
  );
}
