import ProductGrid, { ProductGridItem } from "../../components/ui/ProductGrid";
import SectionHeader from "../../components/ui/SectionHeader";
import type { Product } from "../../types/commerce";
import ProductCard from "./ProductCard";

interface ProductShelfProps {
  title: string;
  eyebrow?: string;
  products: Product[];
  openCart: () => void;
  /** "View all" link on the right of the title. */
  link?: { label: string; href: string };
}

/** A titled row of product cards, e.g. "Bestsellers" or "You may also like". */
export default function ProductShelf({
  title,
  eyebrow,
  products,
  openCart,
  link,
}: ProductShelfProps) {
  if (!products.length) return null;
  return (
    <section>
      <SectionHeader title={title} eyebrow={eyebrow} link={link} />
      <ProductGrid>
        {products.map((product) => (
          <ProductGridItem key={product.id}>
            <ProductCard product={product} onAdded={openCart} />
          </ProductGridItem>
        ))}
      </ProductGrid>
    </section>
  );
}
