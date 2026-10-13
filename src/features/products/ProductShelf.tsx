import type { Product } from "../../types/commerce";
import ProductCard from "./ProductCard";

interface ProductShelfProps {
  title: string;
  eyebrow: string;
  products: Product[];
  openCart: () => void;
  /** Modifier for the section's class name, e.g. "related" → "relatedShelf". */
  shelf: string;
}

/** A titled row of product cards, e.g. "Pairs well with" or "Recently viewed". */
export default function ProductShelf({
  title,
  eyebrow,
  products,
  openCart,
  shelf,
}: ProductShelfProps) {
  return (
    <section className={`recommendations ${shelf}Shelf`}>
      <div className="sectionHeader">
        <div>
          <span className="kicker">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="productGrid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdded={openCart} />
        ))}
      </div>
    </section>
  );
}
