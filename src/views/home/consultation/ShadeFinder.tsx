"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { DEPTH_COLORS, SHADE_QUESTIONS } from "../../../features/shade-match/shadeQuestions";
import { matchShade, matchedProductUrl } from "../../../features/shade-match/shadeMatchLogic";
import { useCommerce } from "../../../hooks/useCommerce";
import { textOn } from "../../../lib/contrast";
import { money } from "../../../lib/money";
import { productRepository } from "../../../repositories/productRepository";
import ChoiceRow from "./ChoiceRow";

const [DEPTH, TONE] = SHADE_QUESTIONS;

/**
 * The first two shade-match questions, answered inline. The suggestion updates as soon as an
 * answer changes, using the same matching rules as the full shade match page.
 */
export default function ShadeFinder() {
  const [depth, setDepth] = useState("Medium");
  const [tone, setTone] = useState("Both · neutral");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCommerce();

  const shade = matchShade({ depth, tone });
  const product = shade ? productRepository.getBySlug(shade.productSlug) : undefined;
  const variant = product?.variants?.find((item) => item.id === shade?.variantId);
  if (!DEPTH || !TONE || !shade || !product || !variant) return null;
  const added = addedId === variant.id;

  return (
    <div
      className="pgTool"
      style={{ "--shade": shade.swatch, "--on-shade": textOn(shade.swatch) } as CSSProperties}
    >
      <div className="pgToolControls">
        <ChoiceRow
          name="finder-depth"
          legend="Your skin in daylight"
          options={DEPTH.options}
          value={depth}
          onChange={setDepth}
          swatches={DEPTH_COLORS}
        />
        <ChoiceRow
          name="finder-tone"
          legend="The jewellery that suits you"
          options={TONE.options}
          value={tone}
          onChange={setTone}
        />
        <p className="pgToolNote">
          A starting point, not a diagnosis. The full shade match adds finish and saves the result
          to your profile.
        </p>
      </div>

      <div className="pgToolResult" aria-live="polite">
        <div className="pgShadeField">
          <span className="pgShadeFieldLabel">Your suggested shade</span>
          <span className="pgShadeFieldName">
            <span className="textRoll">
              <span key={shade.variantId}>{shade.name}</span>
            </span>
          </span>
          <span className="pgShadeFieldMeta">
            {shade.depth} · {shade.undertone}
          </span>
        </div>
        <div className="pgToolProduct">
          <figure className={`pgToolThumb ${product.color}`}>
            {product.image && <Image src={product.image} alt="" fill sizes="96px" quality={90} />}
          </figure>
          <div>
            <span className="pgToolBrand">{product.brand}</span>
            <Link href={matchedProductUrl(shade)}>{product.name}</Link>
            <span className="pgToolPrice">{money(variant.price)}</span>
          </div>
        </div>
        <div className="pgActions">
          <button
            className={added ? "pgButton isDone" : "pgButton"}
            onClick={() => {
              addToCart({ productId: product.id, variantId: variant.id });
              setAddedId(variant.id);
            }}
          >
            {added ? `${variant.name} added` : `Add ${variant.name}`}
          </button>
          <Link className="pgTextLink" href="/shade-match">
            Take the full shade match
          </Link>
        </div>
      </div>
    </div>
  );
}
