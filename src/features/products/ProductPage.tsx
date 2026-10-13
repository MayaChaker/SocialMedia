"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Star } from "@mui/icons-material";
import { money } from "../../lib/money";
import { resolveProductSelection } from "../../domain/product/productSelection";
import { productRepository } from "../../repositories/productRepository";
import { useCartDrawer } from "../../hooks/useCartDrawer";
import { useCommerce } from "../../hooks/useCommerce";
import { useCustomer } from "../../hooks/useCustomer";
import ProductArt from "../../components/product-art/ProductArt";
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
    .slice(0, 3);
  const display = resolveProductSelection(product, selected?.id) ?? product;
  const recent = productRepository
    .getManyByIds(recentlyViewed.filter((id) => id !== product.id))
    .slice(0, 3);
  const profileMatches = product.matches.filter((match) =>
    [...profile.skinGoals, ...profile.preferences].includes(match),
  );
  const add = () => {
    addToCart(display);
    openCart();
  };
  return (
    <main className={`productPage ${product.slug === "petal-skin-tint" ? "shadeProductPage" : ""}`}>
      <button className="backLink" onClick={() => router.back()}>
        ← Back to collection
      </button>
      <section className="productDetail">
        <div className="productGallery">
          <div className={`detailVisual ${product.color}`}>
            <ProductArt product={display} />
            {product.badge && <span className="detailBadge">{product.badge}</span>}
          </div>
          <div className="galleryDetails">
            <div>
              <span>Texture</span>
              <strong>{product.texture}</strong>
            </div>
            <div>
              <span>Finish</span>
              <strong>{product.finish}</strong>
            </div>
          </div>
        </div>
        <div className="detailCopy">
          <div className="detailTopline">
            <span className="kicker">{product.brand}</span>
            <WishlistButton productId={product.id} productName={product.name} />
          </div>
          <h1>{product.name}</h1>
          <p className="detailNote">{product.note}</p>
          <div className="rating">
            <Star /> {product.rating} <span>{product.reviews} reviews</span>
          </div>
          <div className="detailPrice">
            {money(display.price)} <small>{product.size}</small>
          </div>
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
          <button className="button dark full ripple" onClick={add}>
            Add to bag · {money(display.price)}
          </button>
          <div className="matchPanel">
            <Check />
            <div>
              <strong>Why it matches you</strong>
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
        eyebrow="Complete the ritual"
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
