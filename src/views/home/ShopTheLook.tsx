import Link from "next/link";
import EditorialImage from "../../components/EditorialImage";
import ProductVisual from "../../components/product-art/ProductVisual";
import { SHOP_THE_LOOK } from "../../data/merchandising";
import { useCartDrawer } from "../../hooks/useCartDrawer";
import { useCommerce } from "../../hooks/useCommerce";
import { money } from "../../lib/money";
import { productRepository } from "../../repositories/productRepository";

const products = SHOP_THE_LOOK.slugs.flatMap((slug) => {
  const product = productRepository.getBySlug(slug);
  return product ? [product] : [];
});
const lookTotal = products.reduce((sum, product) => sum + product.price, 0);

/** A campaign photograph with the products that recreate it, addable to the bag together. */
export default function ShopTheLook() {
  const { openCart } = useCartDrawer();
  const { addToCart } = useCommerce();
  const addLook = () => {
    products.forEach((product) => addToCart(product));
    openCart();
  };

  return (
    <section className="shopTheLook" aria-labelledby="look-title">
      <div className="shopTheLookImage">
        <EditorialImage
          name={SHOP_THE_LOOK.image}
          alt={SHOP_THE_LOOK.alt}
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </div>
      <div className="shopTheLookCopy">
        <span className="kicker">Shop the look</span>
        <h2 id="look-title">{SHOP_THE_LOOK.title}</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <div className={`lookThumb ${product.color}`}>
                <ProductVisual product={product} sizes="88px" decorative />
              </div>
              <div>
                <small>{product.brand}</small>
                <Link href={`/product/${product.slug}`}>{product.name}</Link>
              </div>
              <b>{money(product.price)}</b>
            </li>
          ))}
        </ul>
        <button className="button dark" onClick={addLook}>
          Add the look · {money(lookTotal)}
        </button>
      </div>
    </section>
  );
}
