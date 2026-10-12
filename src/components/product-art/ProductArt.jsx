import { productRepository } from "../../repositories/productRepository";
import { getPackaging } from "./packaging";
import { SHAPES } from "./shapes";

const LINES = { Skincare: "SKIN", Makeup: "COLOUR", Sets: "RITUALS" };

// Where each item of a set sits (centre x) and how much it is scaled down.
const SET_LAYOUTS = {
  2: { scale: 0.66, centres: [72, 128] },
  3: { scale: 0.6, centres: [52, 148, 100] },
  4: { scale: 0.5, centres: [38, 162, 79, 121] },
};

function Piece({ product, tint }) {
  const Shape = SHAPES[product.type] || SHAPES.bottle;
  const swatch = tint || product.variants?.[0]?.swatch;
  return (
    <Shape pack={getPackaging(product.packaging)} tint={swatch} line={LINES[product.category]} />
  );
}

function SetPieces({ product }) {
  const items = productRepository.getManyByIds(product.includes);
  const layout = SET_LAYOUTS[items.length] || SET_LAYOUTS[3];
  return (
    <g>
      <rect x="12" y="226" width="176" height="18" rx="4" fill="#000" opacity="0.07" />
      {items.map((item, index) => {
        const centre = layout.centres[index] ?? 100;
        const offsetX = centre - 100 * layout.scale;
        const offsetY = 242 - 242 * layout.scale;
        return (
          <g key={item.id} transform={`translate(${offsetX} ${offsetY}) scale(${layout.scale})`}>
            <Piece product={item} />
          </g>
        );
      })}
    </g>
  );
}

/**
 * Vector illustration of a Veloura product. Shade variants recolour the formula
 * (bullet, pan or liquid), so new shades need no new artwork.
 */
export default function ProductArt({ product, className = "productArt", decorative = false }) {
  if (!product) return null;
  const label = `${product.name}${product.selectedVariant ? ` in ${product.selectedVariant}` : ""}`;
  return (
    <svg
      className={className}
      viewBox="0 0 200 260"
      preserveAspectRatio="xMidYMid meet"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      {product.type === "set" ? (
        <SetPieces product={product} />
      ) : (
        <Piece product={product} tint={product.swatch} />
      )}
    </svg>
  );
}
