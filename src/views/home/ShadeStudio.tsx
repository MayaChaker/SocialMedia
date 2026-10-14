"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartDrawer } from "../../hooks/useCartDrawer";
import { useCommerce } from "../../hooks/useCommerce";
import { money } from "../../lib/money";
import RevealHeading from "../../motion/RevealHeading";
import type { Product } from "../../types/commerce";

/** Relative luminance of a #rrggbb colour (WCAG), to pick legible text on a shade. */
function luminance(hex: string) {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/**
 * One product, every shade: choosing a shade repaints the stage in that colour, rolls the
 * shade name in, and adds that exact shade to the bag. Uses the real cart and stock data.
 */
export default function ShadeStudio({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCommerce();
  const { openCart } = useCartDrawer();
  const selected = variants.find((variant) => variant.id === selectedId) ?? variants[0];
  if (!selected) return null;

  const onLight = luminance(selected.swatch) > 0.35;
  const stageStyle = {
    "--shade": selected.swatch,
    "--on-shade": onLight ? "var(--kohl)" : "var(--powder)",
  } as CSSProperties;
  const added = addedId === selected.id;

  const add = () => {
    addToCart({ productId: product.id, variantId: selected.id });
    setAddedId(selected.id);
  };

  return (
    <section className="pgStudio" style={stageStyle} aria-labelledby="studio-title">
      <div className="pgStudioStage">
        <span className="pgStudioShadeName" aria-hidden="true">
          <span className="textRoll">
            <span key={selected.id}>{selected.name}</span>
          </span>
        </span>
        <figure className="pgStudioFigure">
          {product.image && (
            <Image
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              fill
              sizes="(max-width: 900px) 70vw, 30vw"
              quality={90}
            />
          )}
        </figure>
      </div>

      <div className="pgStudioPanel">
        <p className="pgEyebrow">Chapter 03 · Shade studio</p>
        <RevealHeading
          id="studio-title"
          className="pgStudioTitle"
          lines={["One lipstick,", <em key="em">every mood.</em>]}
        />
        <p className="pgStudioProduct">
          <span>{product.brand}</span>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </p>

        <fieldset className="pgShades">
          <legend>
            Shade: <strong>{selected.name}</strong>
          </legend>
          <div className="pgShadeOptions">
            {variants.map((variant) => (
              <label key={variant.id} className="pgShade">
                <input
                  type="radio"
                  name="studio-shade"
                  value={variant.id}
                  checked={variant.id === selected.id}
                  onChange={() => setSelectedId(variant.id)}
                />
                <span className="pgShadeChip" style={{ background: variant.swatch }} />
                <span className="pgShadeLabel">{variant.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="pgPrice">{money(selected.price)}</p>
        <div className="pgActions">
          <button
            className={added ? "pgButton isDone" : "pgButton"}
            onClick={add}
            disabled={selected.stock <= 0}
          >
            {selected.stock <= 0 ? "Sold out" : added ? `${selected.name} added` : "Add to bag"}
          </button>
          {added && (
            <button className="pgTextLink" onClick={openCart}>
              View bag
            </button>
          )}
        </div>
        <p className="pgLive" aria-live="polite">
          {added ? `${product.name} in ${selected.name} added to your bag.` : ""}
        </p>
      </div>
    </section>
  );
}
