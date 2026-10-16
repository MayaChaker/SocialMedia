import styles from "./Badge.module.css";

/** The three labels a product can carry. Anything else in the data is not shown. */
export type BadgeKind = "New" | "Bestseller" | "Exclusive";

const KINDS: readonly string[] = ["New", "Bestseller", "Exclusive"];

export const isBadgeKind = (value: string | undefined): value is BadgeKind =>
  Boolean(value && KINDS.includes(value));

export default function Badge({ kind }: { kind: BadgeKind }) {
  return <span className={`${styles.badge} ${styles[kind.toLowerCase()]}`}>{kind}</span>;
}
