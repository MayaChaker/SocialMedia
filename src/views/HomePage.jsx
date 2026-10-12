"use client";

import Link from "next/link";
import { ArrowForward, Check, LockOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { money } from "../lib/money";
import { BESTSELLER_IDS, EVENING_ROUTINE, HOME_CATEGORIES } from "../data/merchandising";
import { SCENES } from "../data/scenes";
import { productRepository } from "../repositories/productRepository";
import ProductCard from "../features/products/ProductCard";
import ProductScene from "../components/product-art/ProductScene";
import { useCartDrawer } from "../hooks/useCartDrawer";
import { useCommerce } from "../hooks/useCommerce";

const trustPoints = [
  "Skincare, makeup, and sets",
  "Browser-saved profile",
  "Guided shade suggestions",
  "Complimentary delivery on $75+",
];

export default function HomePage() {
  const { openCart } = useCartDrawer();
  const { addToCart } = useCommerce();
  const bestsellers = productRepository.getManyByIds(BESTSELLER_IDS);
  const routine = EVENING_ROUTINE.map(({ slug, step }) => ({
    ...productRepository.getBySlug(slug),
    step,
  }));
  const routineTotal = routine.reduce((sum, product) => sum + product.price, 0);
  const addRoutine = () => {
    routine.forEach((product) => addToCart(product));
    openCart();
  };

  return (
    <main className="homePage">
      <section className="hero homeHero">
        <motion.div
          className="heroCopy"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="kicker">Beauty, considered.</span>
          <h1>
            Quiet luxury
            <br />
            for your skin.
          </h1>
          <p>
            Explore Veloura skincare, makeup, and coordinated sets, with guided tools that narrow
            the collection around your routine and shade preferences.
          </p>
          <div className="heroActions">
            <Link className="button dark" href="/shop">
              Shop the collection <ArrowForward />
            </Link>
            <Link className="textLink" href="/shop?collection=bestsellers">
              Shop bestsellers
            </Link>
          </div>
          <p className="heroReassurance">
            <LockOutlined /> Complimentary delivery on $75+ · Checkout is clearly marked when in
            demo mode
          </p>
        </motion.div>
        <div className="heroImage">
          <ProductScene
            scene={SCENES.hero}
            label="Illustration of Veloura serum, night cream and lipstick on a stone plinth"
          />
        </div>
      </section>

      <section className="trustBar" aria-label="Why shop Veloura">
        {trustPoints.map((point) => (
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

      <section className="homeSection categorySection">
        <SectionHeading
          eyebrow="Find your ritual"
          title="Shop by category"
          copy="Skincare, colour, and considered sets—designed to live together."
        />
        <div className="categoryGrid">
          {HOME_CATEGORIES.map((category) => (
            <Link className="categoryCard" href={category.href} key={category.title}>
              <ProductScene scene={SCENES[category.scene]} />
              <span>
                <small>{category.copy}</small>
                <strong>{category.title}</strong>
                <em>
                  Shop now <ArrowForward />
                </em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="routineCommerce">
        <div className="routineImage">
          <ProductScene
            scene={SCENES.eveningEdit}
            label="Illustration of the Veloura evening routine: cleanser, serum and night cream"
          />
        </div>
        <div className="routineCopy">
          <div className="routineContent">
            <span className="kicker">The evening edit</span>
            <h2>
              Three steps.
              <br />A softer night.
            </h2>
            <p>
              A complete replenishing routine, layered from lightest to richest to support skin
              through the night.
            </p>
            <ol>
              {routine.map((product, index) => (
                <li key={product.id}>
                  <span>0{index + 1}</span>
                  <div>
                    <small>{product.step}</small>
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                  </div>
                  <b>{money(product.price)}</b>
                </li>
              ))}
            </ol>
            <div className="routineTotal">
              <span>Complete routine</span>
              <strong>{money(routineTotal)}</strong>
            </div>
            <div className="routineActions">
              <button className="button light" onClick={addRoutine}>
                Add the full routine
              </button>
              <Link className="textLink" href="/rituals">
                Build your own
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title, copy, href, link, external }) {
  return (
    <div className="homeSectionHeader">
      <div>
        {eyebrow && <span className="kicker">{eyebrow}</span>}
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {href &&
        (external ? (
          <a className="textLink" href={href} target="_blank" rel="noreferrer">
            {link}
            <ArrowForward />
          </a>
        ) : (
          <Link className="textLink" href={href}>
            {link}
            <ArrowForward />
          </Link>
        ))}
    </div>
  );
}
