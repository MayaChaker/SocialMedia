import { productRepository } from "../../repositories/productRepository";
import { getPackaging } from "./packaging";
import { SHAPES } from "./shapes";
import { shade } from "./color";

const WIDTH = 600;
const HEIGHT = 400;

function ScenePiece({ slug, tint, x, baseline, scale }) {
  const product = productRepository.getBySlug(slug);
  if (!product) return null;
  const Shape = SHAPES[product.type] || SHAPES.bottle;
  const offsetX = x - 100 * scale;
  const offsetY = baseline - 242 * scale;
  return (
    <g transform={`translate(${offsetX} ${offsetY}) scale(${scale})`}>
      <Shape
        pack={getPackaging(product.packaging)}
        tint={tint || product.variants?.[0]?.swatch}
        line={product.category === "Makeup" ? "COLOUR" : "SKIN"}
      />
    </g>
  );
}

/**
 * A styled still life: an arch, a stone plinth and a few products.
 * `scene` comes from `src/data/scenes.js`, so art direction lives with the content.
 */
export default function ProductScene({ scene, className = "productScene", label }) {
  // `shift` moves the whole still life sideways, e.g. to leave room for overlaid copy.
  const { wall, arch, plinth, items, plinthWidth = 340, shift = 0 } = scene;
  const plinthX = (WIDTH - plinthWidth) / 2;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <rect width={WIDTH} height={HEIGHT} fill={wall} />
      <g transform={`translate(${shift} 0)`}>
        <path d={`M170 ${HEIGHT} V150 A130 130 0 0 1 430 150 V${HEIGHT} Z`} fill={arch} />
        <rect x={plinthX} y="300" width={plinthWidth} height="100" fill={shade(plinth, -0.12)} />
        <rect x={plinthX} y="292" width={plinthWidth} height="16" rx="3" fill={plinth} />
        {items.map((item) => (
          <ScenePiece key={`${item.slug}-${item.x}`} {...item} baseline={item.baseline ?? 300} />
        ))}
      </g>
    </svg>
  );
}
