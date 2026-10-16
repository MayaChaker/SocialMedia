import Link from "next/link";
import { BRANDS, brandHref } from "../data/brands";
import { PRODUCTS } from "../data/products";
import Breadcrumb from "../components/ui/Breadcrumb";
import styles from "./BrandsPage.module.css";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const CATEGORY_LABEL: Record<string, string> = { Hair: "Haircare" };

const initial = (name: string) => name.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();

/** Every brand, grouped by first letter, with the categories Veloura carries from it. */
const GROUPS = LETTERS.map((letter) => ({
  letter,
  brands: BRANDS.filter((brand) => initial(brand.name) === letter).map((brand) => ({
    ...brand,
    categories: [
      ...new Set(
        PRODUCTS.filter((product) => product.brand === brand.name).map(
          (product) => CATEGORY_LABEL[product.category] ?? product.category,
        ),
      ),
    ],
  })),
}));

export default function BrandsPage() {
  return (
    <main className={styles.page}>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />
      <header className={styles.head}>
        <p className="text-label text-muted">The houses</p>
        <h1>
          Brands <em>A–Z</em>
        </h1>
        <p className="text-muted">
          {BRANDS.length} brands across makeup, skincare, fragrance and haircare.
        </p>
      </header>

      <nav className={styles.letters} aria-label="Jump to letter">
        {GROUPS.map(({ letter, brands }) =>
          brands.length ? (
            <a key={letter} href={`#letter-${letter}`}>
              {letter}
            </a>
          ) : (
            <span key={letter} aria-hidden="true">
              {letter}
            </span>
          ),
        )}
      </nav>

      <div className={styles.groups}>
        {GROUPS.filter((group) => group.brands.length).map(({ letter, brands }) => (
          <section key={letter} id={`letter-${letter}`} className={styles.group}>
            <h2 className={styles.letter}>{letter}</h2>
            <ul>
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link href={brandHref(brand.name)}>
                    <span className={styles.name}>{brand.name}</span>
                    <span className="text-caption text-muted">
                      {brand.categories.join(" · ")} · {brand.productCount}{" "}
                      {brand.productCount === 1 ? "product" : "products"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
