"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { BRANDS, FEATURED_BRANDS } from "../data/brands";
import { reviewsFor } from "../data/reviews";
import { productRepository } from "../repositories/productRepository";
import { useCartDrawer } from "../hooks/useCartDrawer";
import Accordion from "../components/ui/Accordion";
import Badge from "../components/ui/Badge";
import BrandCard from "../components/ui/BrandCard";
import Breadcrumb from "../components/ui/Breadcrumb";
import Button from "../components/ui/Button";
import Drawer from "../components/ui/Drawer";
import { Check, Input, Select } from "../components/ui/Field";
import FiltersSidebar from "../components/ui/FiltersSidebar";
import Pagination from "../components/ui/Pagination";
import Price from "../components/ui/Price";
import ProductGrid, { ProductGridItem } from "../components/ui/ProductGrid";
import Rating from "../components/ui/Rating";
import Reviews from "../components/ui/Reviews";
import SectionHeader from "../components/ui/SectionHeader";
import ProductCard from "../features/products/ProductCard";
import styles from "./StyleguidePage.module.css";

const products = productRepository.getAll();
const sample = [
  "estee-lauder-double-wear",
  "dior-sauvage-eau-de-parfum",
  "glossier-solution",
  "olaplex-no-6-bond-smoother",
]
  .map((slug) => productRepository.getBySlug(slug))
  .filter((product) => product !== undefined);

const COLOURS = [
  ["--color-black", "#111111", "Text, primary buttons"],
  ["--color-bg", "#FAF8F5", "Page background"],
  ["--color-surface", "#F2EFEA", "Image mats, footer"],
  ["--color-white", "#FFFFFF", "Inputs, brand tiles"],
  ["--color-grey-100", "#EBE7E1", "Hover fills"],
  ["--color-grey-200", "#E0DBD4", "Borders, dividers"],
  ["--color-grey-400", "#A39D96", "Disabled, icons"],
  ["--color-grey-600", "#66605A", "Secondary text"],
  ["--color-accent", "#7A2E3A", "The one accent: focus, sale price, Exclusive"],
] as const;

const TYPE = [
  ["text-h1", "H1 · Cormorant 40–64", "The beauty edit"],
  ["text-h2", "H2 · Cormorant 32–44", "Shop by category"],
  ["text-h3", "H3 · Cormorant 26–32", "You may also like"],
  ["text-h4", "H4 · Cormorant 24", "Your bag"],
  ["text-h5", "H5 · Cormorant 20", "Dior"],
  ["text-h6", "H6 · Inter 12 caps", "Featured brands"],
  ["text-body", "Body · Inter 15", "A long-wear foundation with a natural matte finish."],
  ["text-small", "Small · Inter 13", "Product names, links, form labels"],
  ["text-caption", "Caption · Inter 12", "Shade: 6W1 Sandalwood · 30 ml"],
] as const;

const SPACES = [4, 8, 12, 16, 24, 32, 48, 64, 96];

function Block({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className={styles.block}>
      <div className={styles.blockHead}>
        <h2 className="text-h3">{title}</h2>
        {note && <p className="text-small text-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

const countBy = (key: (product: (typeof products)[number]) => string) =>
  products.reduce<Record<string, number>>((counts, product) => {
    counts[key(product)] = (counts[key(product)] ?? 0) + 1;
    return counts;
  }, {});

export default function StyleguidePage() {
  const { openCart } = useCartDrawer();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [category, setCategory] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const categories = countBy((product) => product.category);
  const brandCounts = countBy((product) => product.brand);

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.intro}>
        <p className="text-h6 text-muted">Design system</p>
        <h1>Veloura styleguide</h1>
        <p className="text-muted">
          Every token and shared component, rendered from the real code. Pages may only use what is
          on this page. The header and footer above and below are the shared ones.
        </p>
      </header>

      <Block
        title="Colour"
        note="Near-black, off-white, a grey ramp and one accent. No other colours."
      >
        <ul className={styles.swatches}>
          {COLOURS.map(([token, hex, use]) => (
            <li key={token}>
              <span
                className={styles.swatch}
                style={{ "--fill": `var(${token})` } as CSSProperties}
              />
              <strong className="text-small">{hex}</strong>
              <code className="text-caption">{token}</code>
              <span className="text-caption text-muted">{use}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        title="Type scale"
        note="Cormorant Garamond for headings, Inter for everything else. These nine sizes only."
      >
        <dl className={styles.type}>
          {TYPE.map(([className, label, sampleText]) => (
            <div key={className}>
              <dt className="text-caption text-muted">{label}</dt>
              <dd className={className}>{sampleText}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block
        title="Space, radius, grid"
        note="4px base. Radius 2px everywhere. Container 1440px; gutter 16 / 24 / 40px."
      >
        <ul className={styles.spaces}>
          {SPACES.map((space) => (
            <li key={space}>
              <span style={{ width: space, height: space }} />
              <span className="text-caption">{space}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        title="Buttons"
        note="Primary, secondary and text. Hover changes colour in 150ms, nothing moves."
      >
        <div className={styles.row}>
          <Button>Add to bag</Button>
          <Button variant="secondary">View all</Button>
          <Button variant="text">Clear filters</Button>
          <Button disabled>Out of stock</Button>
          <Button variant="secondary" disabled>
            Choose shade
          </Button>
          <Button href="/shop" variant="secondary">
            A link styled as a button
          </Button>
        </div>
      </Block>

      <Block title="Badges" note="Only these three. Other labels in the data are not shown.">
        <div className={`${styles.row} ${styles.onSurface}`}>
          <Badge kind="New" />
          <Badge kind="Bestseller" />
          <Badge kind="Exclusive" />
        </div>
      </Block>

      <Block title="Forms">
        <div className={styles.forms}>
          <Input label="Email address" type="email" placeholder="you@example.com" />
          <Input label="Postcode" hint="Used for delivery estimates only." />
          <Input
            label="Phone"
            error="Enter a phone number with the country code."
            defaultValue="12"
          />
          <Select
            label="Sort by"
            options={[
              { value: "featured", label: "Featured" },
              { value: "price-low", label: "Price: low to high" },
              { value: "price-high", label: "Price: high to low" },
            ]}
          />
          <div>
            <Check label="In stock only" />
            <Check label="Under $50" defaultChecked />
          </div>
        </div>
      </Block>

      <Block title="Breadcrumb, price, rating">
        <div className={styles.stack}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Makeup", href: "/shop/makeup" },
              { label: "Double Wear Stay-in-Place Foundation" },
            ]}
          />
          <div className={styles.row}>
            <Price amount={52} />
            <Price amount={39} compareAt={52} />
            <Price amount={28} from />
            <Price amount={52} size="large" />
          </div>
          <p className="text-small text-muted">
            Rating and Reviews render nothing until real reviews exist (src/data/reviews.ts is
            empty). Nothing appears below this line, which is correct:
          </p>
          <Rating reviews={reviewsFor(1)} />
          <Reviews reviews={reviewsFor(1)} />
        </div>
      </Block>

      <Block title="Accordion" note="Native details and summary. Used on the product page.">
        <div className={styles.narrow}>
          <Accordion
            defaultOpen="details"
            items={[
              {
                id: "details",
                title: "Details",
                content: <p>Product details from the catalogue.</p>,
              },
              {
                id: "use",
                title: "How to use",
                content: <p>Application steps from the catalogue.</p>,
              },
              {
                id: "ingredients",
                title: "Ingredients",
                content: <p>The full ingredient list.</p>,
              },
            ]}
          />
        </div>
      </Block>

      <Block title="Pagination" note="Renders nothing when everything fits on one page.">
        <Pagination page={2} pageCount={4} hrefFor={(page) => `/styleguide?page=${page}`} />
      </Block>

      <Block
        title="Product card and grid"
        note="2 columns on phones, 3 on tablets, 4 on desktop. Hover photo only when a second image exists."
      >
        <ProductGrid>
          {sample.map((product) => (
            <ProductGridItem key={product.id}>
              <ProductCard product={product} onAdded={openCart} />
            </ProductGridItem>
          ))}
        </ProductGrid>
      </Block>

      <Block
        title="Section header and brand card"
        note="Brand names are set as wordmarks: Veloura has no licence for brand logos."
      >
        <SectionHeader
          eyebrow="Featured"
          title="Brands"
          link={{ label: `All ${BRANDS.length} brands`, href: "/brands" }}
        />
        <ul className={styles.brands}>
          {FEATURED_BRANDS.map((brand) => (
            <li key={brand.slug}>
              <BrandCard brand={brand} />
            </li>
          ))}
        </ul>
      </Block>

      <Block
        title="Filters sidebar and drawer"
        note="The same filters sit beside the grid on desktop and in a drawer on phones."
      >
        <div className={styles.filters}>
          <FiltersSidebar
            groups={[
              {
                id: "category",
                legend: "Category",
                multiple: false,
                selected: category,
                onChange: setCategory,
                options: Object.entries(categories).map(([value, count]) => ({
                  value,
                  label: value,
                  count,
                })),
              },
              {
                id: "brand",
                legend: "Brand",
                multiple: true,
                selected: brands,
                onChange: setBrands,
                options: Object.entries(brandCounts)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .slice(0, 8)
                  .map(([value, count]) => ({ value, label: value, count })),
              },
            ]}
            onClear={() => {
              setCategory([]);
              setBrands([]);
            }}
          />
          <div>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open a drawer
            </Button>
          </div>
        </div>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Drawer"
          footer={
            <Button fullWidth onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
          }
        >
          <p className="text-muted">
            The bag, the filters on phones and the mobile menu all use this panel. It slides in over
            300ms; Escape, the close button or a click outside closes it.
          </p>
        </Drawer>
      </Block>
    </main>
  );
}
