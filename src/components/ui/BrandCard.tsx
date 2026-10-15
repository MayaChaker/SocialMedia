import Link from "next/link";
import { brandHref, type Brand } from "../../data/brands";
import styles from "./BrandCard.module.css";

/**
 * A brand tile. Veloura has no licence for brand logos, so the brand name is set
 * as a typographic wordmark instead of an image.
 */
export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={brandHref(brand.slug)} className={styles.card}>
      <span className={styles.wordmark}>{brand.name}</span>
      <span className="text-caption text-muted">
        {brand.productCount} {brand.productCount === 1 ? "product" : "products"}
      </span>
    </Link>
  );
}
