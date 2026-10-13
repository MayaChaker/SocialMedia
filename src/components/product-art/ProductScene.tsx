import type { Scene, SceneItem } from "../../data/scenes";
import { productRepository } from "../../repositories/productRepository";
import { getPackaging } from "./packaging";
import { ProductShape } from "./shapes";
import { shade } from "./color";

const WIDTH = 600;
const HEIGHT = 400;
/** Top of the plinth, where every product stands. */
const BASELINE = 300;

function ScenePiece({ slug, tint, x, scale }: SceneItem) {
  const product = productRepository.getBySlug(slug);
  if (!product) return null;
  const offsetX = x - 100 * scale;
  const offsetY = BASELINE - 242 * scale;
  return (
    <g transform={`translate(${offsetX} ${offsetY}) scale(${scale})`}>
      <ProductShape
        type={product.type}
        pack={getPackaging(product.type === "set" ? undefined : product.packaging)}
        tint={tint || product.variants?.[0]?.swatch}
        line={product.category === "Makeup" ? "COLOUR" : "SKIN"}
      />
    </g>
  );
}

interface ProductSceneProps {
  scene: Scene;
  className?: string;
  /** Accessible description; without one the scene is treated as decoration. */
  label?: string;
}

/**
 * A styled still life: an arch, a stone plinth and a few products.
 * `scene` comes from `src/data/scenes.ts`, so art direction lives with the content.
 */
export default function ProductScene({
  scene,
  className = "productScene",
  label,
}: ProductSceneProps) {
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
          <ScenePiece key={`${item.slug}-${item.x}`} {...item} />
        ))}
      </g>
    </svg>
  );
}
