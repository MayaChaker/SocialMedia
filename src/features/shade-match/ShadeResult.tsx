import { useState } from "react";
import Link from "next/link";
import { Check } from "@mui/icons-material";
import { useCustomer } from "../../hooks/useCustomer";
import { productRepository } from "../../repositories/productRepository";
import ProductArt from "../../components/product-art/ProductArt";
import {
  matchShade,
  matchedProductUrl,
  SHADE_PROFILES,
  type ShadeAnswers,
  type ShadeProfile,
} from "./shadeMatchLogic";

interface ShadeResultProps {
  answers: ShadeAnswers;
  onStartAgain: () => void;
}

/** The matched shade, its neighbours, and saving it to the beauty profile. */
export default function ShadeResult({ answers, onStartAgain }: ShadeResultProps) {
  const { profile, saveProfile } = useCustomer();
  const [saved, setSaved] = useState(false);
  const result = matchShade(answers);
  const product = result && productRepository.getBySlug(result.productSlug);
  if (!result || !product) return null;

  const resultIndex = SHADE_PROFILES.findIndex((item) => item.variantId === result.variantId);
  const nearby = [SHADE_PROFILES[resultIndex - 1], SHADE_PROFILES[resultIndex + 1]].filter(
    (shade): shade is ShadeProfile => Boolean(shade),
  );
  const saveShade = () => {
    saveProfile({
      ...profile,
      shade: result.name,
      shadeVariantId: result.variantId,
      shadeAnswers: answers,
    });
    setSaved(true);
  };

  return (
    <main className="shadeResultPage">
      <div className="shadeResultLayout">
        <section className="shadeResultVisual" aria-label={`${result.name} shade sample`}>
          <ProductArt
            product={{ ...product, swatch: result.swatch, selectedVariant: result.name }}
          />
          <div className="matchedShadeSample" style={{ "--shade": result.swatch }}>
            <span>{result.name}</span>
          </div>
        </section>
        <section className="shadeResultCopy">
          <span className="kicker">Your suggested match</span>
          <h1>{result.name}</h1>
          <p className="shadeProfile">
            {result.depth} depth <i /> {result.undertone} undertone
          </p>
          <p className="shadeExplanation">
            {result.description} This is a suggested starting point; compare it in natural light for
            your best match.
          </p>
          <dl className="shadeFacts">
            <div>
              <dt>Depth</dt>
              <dd>{result.depth}</dd>
            </div>
            <div>
              <dt>Undertone</dt>
              <dd>{result.undertone}</dd>
            </div>
            <div>
              <dt>Preferred finish</dt>
              <dd>{answers.finish}</dd>
            </div>
          </dl>
          {nearby.length > 0 && (
            <div className="nearbyShades">
              <span>Compare nearby shades</span>
              {nearby.map((shade) => (
                <Link key={shade.variantId} href={matchedProductUrl(shade)}>
                  <i style={{ "--shade": shade.swatch }} />
                  {shade.name}
                </Link>
              ))}
            </div>
          )}
          <div className="shadeResultActions">
            <Link className="button dark" href={matchedProductUrl(result)}>
              Shop {result.name}
            </Link>
            <button
              className={`saveShadeButton ${saved ? "saved" : ""}`}
              onClick={saveShade}
              aria-pressed={saved}
            >
              {saved && <Check />}
              {saved ? "Shade saved" : "Save my shade"}
            </button>
          </div>
          <p className="shadeSaveStatus" role="status" aria-live="polite">
            {saved ? `We'll keep ${result.name} for you.` : "Save your shade to revisit anytime."}
          </p>
          <button className="textLink shadeRestart" onClick={onStartAgain}>
            Start again
          </button>
        </section>
      </div>
    </main>
  );
}
