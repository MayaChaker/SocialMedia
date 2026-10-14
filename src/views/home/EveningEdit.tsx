import Link from "next/link";
import { money } from "../../lib/money";
import { EVENING_ROUTINE } from "../../data/merchandising";
import { productRepository } from "../../repositories/productRepository";
import { useCartDrawer } from "../../hooks/useCartDrawer";
import { useCommerce } from "../../hooks/useCommerce";
import EditorialImage from "../../components/EditorialImage";

/** The promoted three-step evening routine, addable to the bag in one click. */
export default function EveningEdit() {
  const { openCart } = useCartDrawer();
  const { addToCart } = useCommerce();
  const routine = EVENING_ROUTINE.flatMap(({ slug, step }) => {
    const product = productRepository.getBySlug(slug);
    return product ? [{ ...product, step }] : [];
  });
  const routineTotal = routine.reduce((sum, product) => sum + product.price, 0);
  const addRoutine = () => {
    routine.forEach((product) => addToCart(product));
    openCart();
  };

  return (
    <section className="routineCommerce">
      <div className="routineImage">
        <EditorialImage
          name="evening-routine"
          alt="A woman pressing serum into her cheek"
          sizes="(max-width: 900px) 100vw, 53vw"
        />
      </div>
      <div className="routineCopy">
        <div className="routineContent">
          <span className="kicker">The evening edit</span>
          <h2>
            Three steps.
            <br />A softer night.
          </h2>
          <p>
            A complete replenishing routine, layered from lightest to richest to support skin
            through the night.
          </p>
          <ol>
            {routine.map((product, index) => (
              <li key={product.id}>
                <span>0{index + 1}</span>
                <div>
                  <small>
                    {product.step} · {product.brand}
                  </small>
                  <Link href={`/product/${product.slug}`}>{product.name}</Link>
                </div>
                <b>{money(product.price)}</b>
              </li>
            ))}
          </ol>
          <div className="routineTotal">
            <span>Complete routine</span>
            <strong>{money(routineTotal)}</strong>
          </div>
          <div className="routineActions">
            <button className="button light" onClick={addRoutine}>
              Add the full routine
            </button>
            <Link className="textLink" href="/rituals">
              Build your own
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
