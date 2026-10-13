import Link from "next/link";
import { Check } from "@mui/icons-material";
import { money } from "../../lib/money";
import ProductArt from "../../components/product-art/ProductArt";
import type { Product } from "../../types/commerce";
import type { RoutineStep } from "./routineRecommendations";
import { isAvailable } from "./useRoutineBuilder";

interface RoutineProductCardProps {
  item: RoutineStep;
  /** Position in the routine, starting at 0. */
  index: number;
  /** Other skincare products that can take this step. */
  alternatives: Product[];
  added: boolean;
  onAdd: (product: Product) => void;
  onReplace: (product: Product) => void;
}

/** One step of the recommended routine, with add-to-bag and an optional swap. */
export default function RoutineProductCard({
  item: { product, step, reason },
  index,
  alternatives,
  added,
  onAdd,
  onReplace,
}: RoutineProductCardProps) {
  const available = isAvailable(product);
  return (
    <article className="routineProduct">
      <Link
        className={`routineProductVisual ${product.color}`}
        href={`/product/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        <ProductArt product={product} />
      </Link>
      <div className="routineProductCopy">
        <span className="routineStep">
          {String(index + 1).padStart(2, "0")} · {step}
        </span>
        <div className="routineProductTitle">
          <Link href={`/product/${product.slug}`}>
            <h2>{product.name}</h2>
          </Link>
          <strong>{money(product.price)}</strong>
        </div>
        <p>{reason}</p>
        <p className={`routineMeta ${available ? "" : "unavailable"}`}>
          {product.size} · {available ? "In stock" : "Out of stock"}
        </p>
        {alternatives.length > 0 && (
          <label className="routineReplace">
            <span>Replace this step</span>
            <select
              value=""
              onChange={(event) => {
                const replacement = alternatives.find(
                  (candidate) => candidate.id === Number(event.target.value),
                );
                if (replacement) onReplace(replacement);
              }}
            >
              <option value="">Choose an alternative</option>
              {alternatives.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} · {money(candidate.price)}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="routineAddButton" disabled={!available} onClick={() => onAdd(product)}>
          {!available ? (
            "Out of stock"
          ) : added ? (
            <>
              <Check aria-hidden="true" /> Added
            </>
          ) : (
            "Add Item"
          )}
        </button>
      </div>
    </article>
  );
}
