import Link from "next/link";
import { productRepository } from "../../repositories/productRepository";
import { useCustomer } from "../../hooks/useCustomer";
import ProductVisual from "../../components/product-art/ProductVisual";
import type { Product } from "../../types/commerce";
import type { StoredRoutine } from "../../types/customer";

const catalogue = productRepository.getAll();

/** Older saves are a bare list of ids or product names; newer ones store product ids. */
function routineProducts(routine: StoredRoutine): Product[] {
  const saved = Array.isArray(routine) ? routine : routine.productIds || [];
  return saved
    .map((item) =>
      typeof item === "number"
        ? productRepository.getById(item)
        : catalogue.find((product) => product.name === item),
    )
    .filter((product): product is Product => Boolean(product));
}

/** The routine saved from the routine builder, or a prompt to build one. */
export default function SavedRoutineCard() {
  const { routineResults } = useCustomer();
  const products = routineProducts(routineResults);

  return (
    <article className="savedProfileCard">
      <span className="kicker">Saved routine</span>
      {products.length ? (
        <>
          <div className="savedRoutineGrid">
            {products.map((product) => (
              <Link href={`/product/${product.slug}`} key={product.id}>
                <span className={`savedRoutineThumb ${product.color}`}>
                  <ProductVisual product={product} sizes="96px" />
                </span>
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.size}</small>
                </span>
              </Link>
            ))}
          </div>
          <Link className="button outline" href="/rituals">
            View or edit routine
          </Link>
        </>
      ) : (
        <div className="profileEmpty">
          <h2>No saved routine yet</h2>
          <p>Answer three questions for a concise routine that fits your preferences.</p>
          <Link className="button outline" href="/rituals">
            Build my routine
          </Link>
        </div>
      )}
    </article>
  );
}
