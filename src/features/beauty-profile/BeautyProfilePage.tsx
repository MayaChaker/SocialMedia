"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "@mui/icons-material";
import { resolveProductSelection } from "../../domain/product/productSelection";
import { productRepository } from "../../repositories/productRepository";
import { useCustomer } from "../../hooks/useCustomer";
import ProductArt from "../../components/product-art/ProductArt";
import type { Product } from "../../types/commerce";
import type { BeautyProfile } from "../../types/customer";

const catalogue = productRepository.getAll();

const CONCERNS = ["Dehydration", "Dullness", "Sensitive skin", "Fine lines"];
const PREFERENCES = [
  "Natural coverage",
  "Fragrance-free feel",
  "Weightless textures",
  "Rich textures",
];
export default function BeautyProfilePage() {
  const { profile, saveProfile, routineResults } = useCustomer();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const toggle = (key: "skinGoals" | "preferences", value: string) =>
    setDraft((current: BeautyProfile) => {
      const values = current[key] || [];
      return {
        ...current,
        [key]: values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });
  const routineProducts = useMemo(() => {
    // Older saves are a bare list of ids or product names.
    const saved = Array.isArray(routineResults) ? routineResults : routineResults?.productIds || [];
    return saved
      .map((item) =>
        typeof item === "number"
          ? productRepository.getById(item)
          : catalogue.find((product) => product.name === item),
      )
      .filter((product): product is Product => Boolean(product));
  }, [routineResults]);
  const tint = productRepository.getBySlug("petal-skin-tint");
  const shade = tint?.variants?.find((item) => item.id === profile.shadeVariantId);
  const shadeProduct = tint && shade ? resolveProductSelection(tint, shade.id) : null;
  const save = () => {
    saveProfile(draft);
    setSaved(true);
  };
  return (
    <main className="profilePage">
      <header className="profileHeader">
        <span className="kicker">Your Veloura</span>
        <h1>Beauty profile</h1>
        <p>
          Personalise recommendations on this device. Your profile is stored only in this browser,
          not in an online account.
        </p>
      </header>
      <div className="profileLayout">
        <section className="profileForm">
          <label>
            Skin type
            <select
              value={draft.skinType}
              onChange={(event) => setDraft({ ...draft, skinType: event.target.value })}
            >
              <option>Balanced</option>
              <option>Dry</option>
              <option>Combination</option>
              <option>Oily</option>
              <option>Sensitive</option>
            </select>
          </label>
          <ChoiceGroup
            legend="Skin concerns"
            values={CONCERNS}
            selected={draft.skinGoals || []}
            onToggle={(value) => toggle("skinGoals", value)}
          />
          <ChoiceGroup
            legend="Makeup and texture preferences"
            values={PREFERENCES}
            selected={draft.preferences || []}
            onToggle={(value) => toggle("preferences", value)}
          />
          <button className="button dark" onClick={save}>
            {saved ? (
              <>
                <Check /> Profile saved
              </>
            ) : (
              "Save profile"
            )}
          </button>
          <p className="profileSaveStatus" role="status">
            {saved ? "Your browser-saved preferences are up to date." : ""}
          </p>
        </section>
        <aside className="profileSaved">
          <article className="savedProfileCard">
            <span className="kicker">Saved shade</span>
            {shade && shadeProduct ? (
              <div className="savedShadeContent">
                <div className="savedShadeVisual">
                  <ProductArt product={shadeProduct} />
                </div>
                <div>
                  <h2>{shade.name}</h2>
                  <p>{shadeProduct.name}</p>
                  <Link
                    className="textLink"
                    href={`/product/${shadeProduct.slug}?variant=${shade.id}`}
                  >
                    View shade
                  </Link>
                  <Link className="textLink" href="/shade-match">
                    Retake Shade Match
                  </Link>
                </div>
              </div>
            ) : (
              <div className="profileEmpty">
                <h2>No saved shade yet</h2>
                <p>Shade Match offers a suggested starting point for Petal Skin Tint.</p>
                <Link className="button outline" href="/shade-match">
                  Find my shade
                </Link>
              </div>
            )}
          </article>
          <article className="savedProfileCard">
            <span className="kicker">Saved routine</span>
            {routineProducts.length ? (
              <>
                <div className="savedRoutineGrid">
                  {routineProducts.map((product) => (
                    <Link href={`/product/${product.slug}`} key={product.id}>
                      <span className={`savedRoutineThumb ${product.color}`}>
                        <ProductArt product={product} />
                      </span>
                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.size}</small>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link className="button outline" href="/rituals">
                  View or edit routine
                </Link>
              </>
            ) : (
              <div className="profileEmpty">
                <h2>No saved routine yet</h2>
                <p>Answer three questions for a concise routine that fits your preferences.</p>
                <Link className="button outline" href="/rituals">
                  Build my routine
                </Link>
              </div>
            )}
          </article>
        </aside>
      </div>
    </main>
  );
}
interface ChoiceGroupProps {
  legend: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function ChoiceGroup({ legend, values, selected, onToggle }: ChoiceGroupProps) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div>
        {values.map((value) => (
          <button
            type="button"
            className={selected.includes(value) ? "selected" : ""}
            onClick={() => onToggle(value)}
            key={value}
          >
            {selected.includes(value) && <Check />}
            {value}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
