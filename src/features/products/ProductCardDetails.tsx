import type { ReactNode } from "react";
import Link from "next/link";
import { Star } from "@mui/icons-material";
import { money } from "../../lib/money";
import type { Product, Variant } from "../../types/commerce";

interface ProductCardDetailsProps {
  product: Product;
  /** Price of the chosen shade, or of the product. */
  price: number;
  selected: Variant | undefined;
  swatches: ReactNode;
  productHref: string;
  /** The denser layout used on the shop grid. */
  shopLayout: boolean;
}

/** Name, rating, price and shade of a product card, in the shop or the default layout. */
export default function ProductCardDetails({
  product,
  price,
  selected,
  swatches,
  productHref,
  shopLayout,
}: ProductCardDetailsProps) {
  const originalPrice = product.originalPrice && <del>{money(product.originalPrice)}</del>;

  if (shopLayout)
    return (
      <>
        <div className="productMeta">{product.category}</div>
        <div className="productInfo shopProductInfo">
          <Link className="productNameLink" href={productHref}>
            <h3>{product.name}</h3>
          </Link>
          {product.rating && product.reviews ? (
            <div
              className="cardRating"
              aria-label={`${product.rating} out of 5 stars from ${product.reviews} reviews`}
            >
              <Star />
              <span>
                {product.rating} <small>({product.reviews} reviews)</small>
              </span>
            </div>
          ) : (
            <div className="cardRating neutral">Not yet rated</div>
          )}
          <p>{product.note}</p>
          <div className="cardPrice">
            <strong>{money(price)}</strong>
            {originalPrice}
          </div>
          <div className="cardVariantInfo">
            {product.variants ? (
              <>
                Selected shade: <strong>{selected?.name || "Choose a shade"}</strong>
              </>
            ) : (
              product.size
            )}
          </div>
        </div>
        <div className="cardOptions">{product.variants && swatches}</div>
      </>
    );

  return (
    <>
      <div className="productMeta">
        <span>
          {product.category} · {product.brand.replace("Veloura ", "")}
        </span>
        <div className="cardRating" aria-label={`${product.rating} out of 5 stars`}>
          <Star /> {product.rating} <small>({product.reviews})</small>
        </div>
      </div>
      <div className="productInfo">
        <div>
          <Link href={productHref}>
            <h3>{product.name}</h3>
          </Link>
          <p>{product.note}</p>
          <small>{selected ? `Shade: ${selected.name}` : product.size}</small>
        </div>
        <div className="price">
          <span>{money(price)}</span>
          {originalPrice}
        </div>
      </div>
      {product.variants && swatches}
    </>
  );
}
