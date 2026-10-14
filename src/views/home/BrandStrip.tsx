import Link from "next/link";

interface BrandStripProps {
  brands: string[];
}

/** Every brand in the catalogue; each links to the shop filtered by that brand. */
export default function BrandStrip({ brands }: BrandStripProps) {
  return (
    <nav className="brandStrip" aria-label="Shop by brand">
      <ul>
        {brands.map((brand) => (
          <li key={brand}>
            <Link href={`/shop?search=${encodeURIComponent(brand)}`}>{brand}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
