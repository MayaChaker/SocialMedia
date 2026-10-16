import { money } from "../../lib/money";
import styles from "./Price.module.css";

interface PriceProps {
  amount: number;
  /** The previous price, shown struck through when the item is reduced. */
  compareAt?: number;
  /** "From $28" for products whose shades are priced differently. */
  from?: boolean;
  size?: "default" | "large";
}

export default function Price({ amount, compareAt, from = false, size = "default" }: PriceProps) {
  const reduced = compareAt !== undefined && compareAt > amount;
  return (
    <p className={`${styles.price} ${size === "large" ? styles.large : ""}`}>
      <span className={reduced ? styles.sale : undefined}>
        {from && "From "}
        {money(amount)}
      </span>
      {reduced && (
        <>
          <del className={styles.compare} aria-hidden="true">
            {money(compareAt)}
          </del>
          <span className="srOnly">Reduced from {money(compareAt)}</span>
        </>
      )}
    </p>
  );
}
