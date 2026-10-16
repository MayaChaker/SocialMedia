"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRANDS, brandHref } from "../../data/brands";
import { PRODUCTS } from "../../data/products";
import styles from "./BrandIndex.module.css";

/** One product photograph per brand, shown beside the list while that brand is hovered. */
const PREVIEWS = Object.fromEntries(
  BRANDS.map((brand) => [brand.name, PRODUCTS.find((product) => product.brand === brand.name)]),
);
const FIRST = BRANDS.find((brand) => brand.name === "Chanel") ?? BRANDS[0];

/**
 * Every brand as a typographic A–Z list. Hovering or focusing a name swaps in one of its
 * products beside the list; on phones the list stands alone.
 */
export default function BrandIndex() {
  const [active, setActive] = useState(FIRST?.name ?? "");
  const preview = PREVIEWS[active];

  return (
    <section id="brands" className={styles.section} aria-labelledby="brands-title">
      <div className={styles.intro}>
        <p className="text-label text-muted">The houses</p>
        <h2 id="brands-title">
          Brands we <em>carry</em>
        </h2>
        <p className={styles.copy}>
          Heritage maisons, cult skincare laboratories and modern makeup artists, side by side.
        </p>
      </div>
      <ul className={styles.list}>
        {BRANDS.map((brand) => (
          <li key={brand.slug}>
            <Link
              href={brandHref(brand.name)}
              className={brand.name === active ? styles.active : undefined}
              onMouseEnter={() => setActive(brand.name)}
              onFocus={() => setActive(brand.name)}
            >
              {brand.name}
              <span>{brand.productCount}</span>
            </Link>
          </li>
        ))}
      </ul>
      {preview?.image && (
        <figure className={styles.preview} aria-hidden="true">
          <span className={styles.previewImage}>
            <Image src={preview.image} alt="" fill sizes="22vw" quality={85} />
          </span>
          <figcaption>
            <strong>{active}</strong>
            {preview.name}
          </figcaption>
        </figure>
      )}
    </section>
  );
}
