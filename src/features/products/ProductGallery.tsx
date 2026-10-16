import ProductVisual from "../../components/product-art/ProductVisual";
import type { Product, ProductSelection, Variant } from "../../types/commerce";
import styles from "./ProductPage.module.css";

interface ProductGalleryProps {
  product: Product;
  /** The product as chosen, so the photograph follows the shade when it has its own. */
  display: Product | ProductSelection;
  shade?: Variant;
}

/**
 * The photograph, large, on the bone mat. Below it on desktop: the chosen shade as a
 * colour tile, and the texture and finish. Both come from the product data, so a product
 * with one photograph still gets a full gallery without inventing images.
 */
export default function ProductGallery({ product, display, shade }: ProductGalleryProps) {
  return (
    <div className={styles.gallery}>
      <div className={styles.photo}>
        <ProductVisual product={display} sizes="(max-width: 1023px) 100vw, 55vw" priority />
      </div>
      <div className={styles.tiles} aria-hidden="true">
        {shade ? (
          <div className={styles.shadeTile} style={{ background: shade.swatch }}>
            <p className="text-label">Shade</p>
            <p className={styles.tileTitle}>{shade.name}</p>
          </div>
        ) : (
          <div className={styles.sizeTile}>
            <p className="text-label text-muted">Size</p>
            <p className={styles.tileTitle}>{product.size}</p>
          </div>
        )}
        <div className={styles.textureTile}>
          <p className="text-label text-muted">Texture · Finish</p>
          <p className={styles.tileTitle}>
            {product.texture}
            <br />
            <em>{product.finish.toLowerCase()}</em>
          </p>
        </div>
      </div>
    </div>
  );
}
