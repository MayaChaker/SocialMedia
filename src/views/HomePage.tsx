"use client";

import { BESTSELLER_IDS } from "../data/merchandising";
import { productRepository } from "../repositories/productRepository";
import ProductCard from "../features/products/ProductCard";
import { useCartDrawer } from "../hooks/useCartDrawer";
import BrandStrip from "./home/BrandStrip";
import EveningEdit from "./home/EveningEdit";
import HomeCategories from "./home/HomeCategories";
import HomeHero from "./home/HomeHero";
import SectionHeading from "./home/SectionHeading";
import ShopTheLook from "./home/ShopTheLook";

const bestsellers = productRepository.getManyByIds(BESTSELLER_IDS);
const brands = [...new Set(productRepository.getAll().map((product) => product.brand))].sort(
  (a, b) => a.localeCompare(b),
);

export default function HomePage() {
  const { openCart } = useCartDrawer();

  return (
    <main className="homePage">
      <HomeHero brandCount={brands.length} />
      <BrandStrip brands={brands} />

      <section className="homeSection">
        <SectionHeading
          eyebrow="Most loved"
          title="Bestsellers"
          href="/shop?collection=bestsellers"
          link="Shop all bestsellers"
        />
        <div className="productGrid homeGrid">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} onAdded={openCart} />
          ))}
        </div>
      </section>

      <HomeCategories />
      <ShopTheLook />
      <EveningEdit />
    </main>
  );
}
