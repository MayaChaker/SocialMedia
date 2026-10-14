import Image from "next/image";
import Link from "next/link";
import EditorialImage from "../../components/EditorialImage";
import { productImagePath } from "../../data/productImages";
import { productRepository } from "../../repositories/productRepository";
import HeroScene from "./HeroScene";

const products = productRepository.getAll();
const brandCount = new Set(products.map((product) => product.brand)).size;
// Every shade in the catalogue, in catalogue order: the ribbon is real data, not decoration.
const shades = products.flatMap((product) =>
  (product.variants ?? []).map((variant) => ({ ...variant, product: product.name })),
);
const firstShade = shades[0];
const lastShade = shades[shades.length - 1];

export default function Hero() {
  return (
    <section className="pgHero" aria-labelledby="hero-title">
      <HeroScene>
        <p className="pgEyebrow pgHeroMeta" data-reveal data-hero="meta">
          Edit 01 · Autumn 2026
        </p>
        <h1 id="hero-title" className="pgHeroTitle">
          <span className="lineMask">
            <span className="line" data-reveal data-hero="line">
              {brandCount} houses.
            </span>
          </span>
          <span className="lineMask">
            <span className="line" data-reveal data-hero="line">
              {products.length} icons.
            </span>
          </span>
          <span className="lineMask">
            <span className="line" data-reveal data-hero="line">
              <em>One edit.</em>
            </span>
          </span>
        </h1>

        <div className="pgHeroPortrait" data-reveal data-hero="portrait">
          <EditorialImage
            name="hero"
            alt="Portrait of a woman with luminous skin against a warm background"
            sizes="(max-width: 900px) 100vw, 40vw"
            priority
          />
        </div>
        <figure className="pgHeroInset" data-reveal data-hero="inset">
          <Image
            src={productImagePath("chanel-rouge-allure")}
            alt="Chanel Rouge Allure lipstick on marble"
            fill
            sizes="(max-width: 900px) 40vw, 16vw"
            quality={90}
            priority
          />
          <figcaption>Chanel · Rouge Allure</figcaption>
        </figure>

        <div className="pgHeroFoot" data-reveal data-hero="foot">
          <p>
            Makeup, skincare, fragrance and hair from the houses you already love, edited down to
            the pieces worth owning.
          </p>
          <div className="pgActions">
            <Link className="pgButton" href="/shop">
              Shop the edit
            </Link>
            <Link className="pgTextLink" href="/shade-match">
              Find your foundation shade
            </Link>
          </div>
        </div>

        <div className="pgRibbon">
          <div className="pgRibbonBars" aria-hidden="true">
            {shades.map((shade) => (
              <span
                key={`${shade.product}-${shade.id}`}
                data-reveal
                data-hero="bar"
                style={{ background: shade.swatch }}
              />
            ))}
          </div>
          {firstShade && lastShade && (
            <p className="pgRibbonCaption">
              {shades.length} shades on the shelf, from {firstShade.name} to {lastShade.name}
            </p>
          )}
        </div>
      </HeroScene>
    </section>
  );
}
