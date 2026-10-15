import type { ReactNode } from "react";
import Link from "next/link";
import { money } from "../../lib/money";
import type { Product, Variant } from "../../types/commerce";

interface ProductCardDetailsProps {
  product: Product;
  /** Price of the chosen shade, or of the product. */
  price: number;
  selected: Variant | undefined;
  swatches: ReactNode;
  productHref: string;
}

/** Brand, name, price and shade of a product card. */
export default function ProductCardDetails({
  product,
  price,
  selected,
  swatches,
  productHref,
}: ProductCardDetailsProps) {
  const shadeLine = product.variants
    ? selected
      ? `Shade: ${selected.name}`
      : `${product.variants.length} shades`
    : product.size;

  return (
    <div className="cardBody">
      <p className="cardBrand">{product.brand}</p>
      <Link className="cardName" href={productHref}>
        <h3>{product.name}</h3>
      </Link>
      <p className="cardPrice">
        <span>{money(price)}</span>
        {product.originalPrice && <del>{money(product.originalPrice)}</del>}
      </p>
      <p className="cardShade">{shadeLine}</p>
      {product.variants && swatches}
    </div>
  );
}
