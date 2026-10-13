import type { Product } from "../../types/commerce";

/** Benefits, ingredients and usage notes on the product page. */
export default function ProductFacts({ product }: { product: Product }) {
  return (
    <div className="detailFacts">
      <div>
        <span>Benefits</span>
        <ul>
          {product.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>
      <div>
        <span>Key ingredients</span>
        <p>{product.ingredients}</p>
      </div>
      <div>
        <span>How to use</span>
        <p>{product.ritual}</p>
      </div>
      <div>
        <span>Usage order</span>
        <p>{product.order}</p>
      </div>
    </div>
  );
}
