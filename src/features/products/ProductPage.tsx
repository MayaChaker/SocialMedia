"use client";

import { useEffect, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check } from "@mui/icons-material";
import { money } from "../../lib/money";
import { textOn } from "../../lib/contrast";
import { resolveProductSelection } from "../../domain/product/productSelection";
import { productRepository } from "../../repositories/productRepository";
import { useCartDrawer } from "../../hooks/useCartDrawer";
import { useCommerce } from "../../hooks/useCommerce";
import { useCustomer } from "../../hooks/useCustomer";
import ProductVisual from "../../components/product-art/ProductVisual";
import NotFoundPage from "../../views/NotFoundPage";
import WishlistButton from "../wishlist/WishlistButton";
import ProductFacts from "./ProductFacts";
import ProductShelf from "./ProductShelf";
import ShadeSwatches from "./ShadeSwatches";

const catalogue = productRepository.getAll();

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { openCart } = useCartDrawer();
  const product = productRepository.getBySlug(slug);
  // The selected shade is part of the URL (?variant=deep) so it can be linked to directly.
  const selected =
    product?.variants?.find((variant) => variant.id === params.get("variant")) ||
    product?.variants?.[0];
  const selectShade = (variantId: string) =>
    router.replace(`${pathname}?variant=${encodeURIComponent(variantId)}`, { scroll: false });
  const { addToCart } = useCommerce();
  const { addRecentlyViewed, recentlyViewed, profile } = useCustomer();
  const productId = product?.id;
  useEffect(() => {
    if (productId) addRecentlyViewed(productId);
  }, [productId, addRecentlyViewed]);
  if (!product) return <NotFoundPage />;
  // Memoised by the React Compiler; the catalogue is small enough to filter on every render.
  const related = catalogue
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category === product.category ||
          product.matches.some((match) => item.matches.includes(match))),
    )
    .slice(0, 4);
  const display = resolveProductSelection(product, selected?.id) ?? product;
  const recent = productRepository
    .getManyByIds(recentlyViewed.filter((id) => id !== product.id))
    .slice(0, 4);
  const profileMatches = product.matches.filter((match) =>
    [...profile.skinGoals, ...profile.preferences].includes(match),
  );
  const add = () => {
    addToCart(display);
    openCart();
  };

  return (
    <main className="productPage">
      <nav className="pdpCrumbs" aria-label="Breadcrumb">
        <Link href="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/shop/${product.category.toLowerCase()}`}>{product.category}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.brand}</span>
      </nav>

      <section className="pdp">
        <div className="pdpMedia">
          <div className={`detailVisual ${product.color}`}>
            <ProductVisual product={display} sizes="(max-width: 900px) 100vw, 55vw" priority />
            {product.badge && <span className="productBadge">{product.badge}</span>}
          </div>
          {selected && (
            <div
              className="pdpShadeBand"
              style={
                {
                  "--shade": selected.swatch,
                  "--on-shade": textOn(selected.swatch),
                } as CSSProperties
              }
            >
              <span className="textRoll">
                <span key={selected.id}>{selected.name}</span>
              </span>
            </div>
          )}
        </div>

        <div className="pdpPanel">
          <div className="detailTopline">
            <span className="kicker">{product.brand}</span>
            <WishlistButton productId={product.id} productName={product.name} />
          </div>
          <h1>{product.name}</h1>
          <p className="detailNote">{product.note}</p>
          <p className="detailPrice">
            {money(display.price)} <small>{product.size}</small>
          </p>
          <p className="description">{product.description}</p>
          {product.variants && (
            <div className="detailVariants">
              <span>
                Shade: <strong>{selected?.name}</strong>
              </span>
              <ShadeSwatches
                productName={product.name}
                variants={product.variants}
                selectedId={selected?.id}
                onSelect={selectShade}
                showCheck={false}
              />
            </div>
          )}
          <button className="button dark full" onClick={add}>
            Add to bag · {money(display.price)}
          </button>
          <p className="pdpService">
            Complimentary delivery from $75 · Demo checkout, no payment taken
          </p>
          <dl className="pdpSpecs">
            <div>
              <dt>Texture</dt>
              <dd>{product.texture}</dd>
            </div>
            <div>
              <dt>Finish</dt>
              <dd>{product.finish}</dd>
            </div>
          </dl>
          <div className="matchPanel">
            <Check />
            <div>
              <strong>Why it suits you</strong>
              <p>
                {profileMatches.length
                  ? `Matches your ${profileMatches.join(" and ").toLowerCase()} preferences.`
                  : `A versatile fit for your ${profile.skinType.toLowerCase()} skin profile.`}
              </p>
            </div>
          </div>
          <ProductFacts product={product} />
        </div>
      </section>

      <ProductShelf
        title="Pairs well with"
        eyebrow="Complete the look"
        products={related}
        openCart={openCart}
        shelf="related"
      />
      {recent.length > 0 && (
        <ProductShelf
          title="Recently viewed"
          eyebrow="Continue exploring"
          products={recent}
          openCart={openCart}
          shelf="recent"
        />
      )}
    </main>
  );
}
