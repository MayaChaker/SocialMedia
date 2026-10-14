import Link from "next/link";
import { resolveProductSelection } from "../../domain/product/productSelection";
import { productRepository } from "../../repositories/productRepository";
import { useCustomer } from "../../hooks/useCustomer";
import ProductVisual from "../../components/product-art/ProductVisual";

/** The shade saved from Shade Match, or a prompt to find one. */
export default function SavedShadeCard() {
  const { profile } = useCustomer();
  const tint = productRepository.getBySlug("petal-skin-tint");
  const shade = tint?.variants?.find((item) => item.id === profile.shadeVariantId);
  const shadeProduct = tint && shade ? resolveProductSelection(tint, shade.id) : null;

  return (
    <article className="savedProfileCard">
      <span className="kicker">Saved shade</span>
      {shade && shadeProduct ? (
        <div className="savedShadeContent">
          <div className="savedShadeVisual">
            <ProductVisual product={shadeProduct} sizes="200px" />
          </div>
          <div>
            <h2>{shade.name}</h2>
            <p>{shadeProduct.name}</p>
            <Link className="textLink" href={`/product/${shadeProduct.slug}?variant=${shade.id}`}>
              View shade
            </Link>
            <Link className="textLink" href="/shade-match">
              Retake Shade Match
            </Link>
          </div>
        </div>
      ) : (
        <div className="profileEmpty">
          <h2>No saved shade yet</h2>
          <p>Shade Match offers a suggested starting point for Petal Skin Tint.</p>
          <Link className="button outline" href="/shade-match">
            Find my shade
          </Link>
        </div>
      )}
    </article>
  );
}
