"use client";

import { Check } from "@mui/icons-material";
import { BESTSELLER_IDS } from "../data/merchandising";
import { productRepository } from "../repositories/productRepository";
import ProductCard from "../features/products/ProductCard";
import { useCartDrawer } from "../hooks/useCartDrawer";
import EveningEdit from "./home/EveningEdit";
import HomeCategories from "./home/HomeCategories";
import HomeHero from "./home/HomeHero";
import SectionHeading from "./home/SectionHeading";

const TRUST_POINTS = [
  "Skincare, makeup, and sets",
  "Browser-saved profile",
  "Guided shade suggestions",
  "Complimentary delivery on $75+",
];

const bestsellers = productRepository.getManyByIds(BESTSELLER_IDS);

export default function HomePage() {
  const { openCart } = useCartDrawer();

  return (
    <main className="homePage">
      <HomeHero />

      <section className="trustBar" aria-label="Why shop Veloura">
        {TRUST_POINTS.map((point) => (
          <div key={point}>
            <Check />
            <span>{point}</span>
          </div>
        ))}
      </section>

      <section className="homeSection bestsellersSection">
        <SectionHeading
          title="Bestsellers"
          copy="Made to be reached for."
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
      <EveningEdit />
    </main>
  );
}
