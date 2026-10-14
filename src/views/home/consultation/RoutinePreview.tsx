"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  buildRoutineRecommendations,
  type RoutineGoal,
  type RoutinePace,
  type RoutineTexture,
} from "../../../features/routine/routineRecommendations";
import { ROUTINE_QUESTIONS } from "../../../features/routine/routineQuestions";
import { useCartDrawer } from "../../../hooks/useCartDrawer";
import { useCommerce } from "../../../hooks/useCommerce";
import { money } from "../../../lib/money";
import ChoiceRow from "./ChoiceRow";

const question = (key: string) => ROUTINE_QUESTIONS.find((item) => item.key === key);
const optionsOf = (key: string) => question(key)?.options.map(([value]) => value) ?? [];
const hintsOf = (key: string) => Object.fromEntries(question(key)?.options ?? []);

/**
 * The routine builder's three questions, answered inline; the routine is rebuilt on every
 * change with the same rules as the full builder, and can go to the bag in one click.
 */
export default function RoutinePreview() {
  const [goal, setGoal] = useState<RoutineGoal>("Dehydration");
  const [texture, setTexture] = useState<RoutineTexture>("Weightless");
  const [time, setTime] = useState<RoutinePace>("Balanced");
  const { addToCart } = useCommerce();
  const { openCart } = useCartDrawer();

  const steps = buildRoutineRecommendations({ goal, texture, time });
  const total = steps.reduce((sum, { product }) => sum + product.price, 0);
  const addRoutine = () => {
    steps.forEach(({ product }) => addToCart(product.id));
    openCart();
  };

  return (
    <div className="pgTool">
      <div className="pgToolControls">
        <ChoiceRow
          name="routine-goal"
          legend="What you want to support"
          options={optionsOf("goal")}
          hints={hintsOf("goal")}
          value={goal}
          onChange={(value) => setGoal(value as RoutineGoal)}
        />
        <ChoiceRow
          name="routine-texture"
          legend="Textures you reach for"
          options={optionsOf("texture")}
          hints={hintsOf("texture")}
          value={texture}
          onChange={(value) => setTexture(value as RoutineTexture)}
        />
        <ChoiceRow
          name="routine-time"
          legend="Time you have"
          options={optionsOf("time")}
          hints={hintsOf("time")}
          value={time}
          onChange={(value) => setTime(value as RoutinePace)}
        />
      </div>

      <div className="pgToolResult" aria-live="polite">
        <p className="pgRoutineCount">Your {steps.length}-step routine</p>
        <ol className="pgRoutineSteps">
          {steps.map(({ product, step }, index) => (
            <li key={`${index}-${product.id}`}>
              <span className="pgRoutineIndex">{index + 1}</span>
              <figure className={`pgToolThumb ${product.color}`}>
                {product.image && (
                  <Image src={product.image} alt="" fill sizes="64px" quality={90} />
                )}
              </figure>
              <div>
                <span className="pgToolBrand">
                  {step} · {product.brand}
                </span>
                <Link href={`/product/${product.slug}`}>{product.name}</Link>
              </div>
              <span className="pgToolPrice">{money(product.price)}</span>
            </li>
          ))}
        </ol>
        <div className="pgRoutineTotal">
          <span>Routine total</span>
          <strong>{money(total)}</strong>
        </div>
        <div className="pgActions">
          <button className="pgButton" onClick={addRoutine}>
            Add the routine
          </button>
          <Link className="pgTextLink" href="/rituals">
            Open the routine builder
          </Link>
        </div>
      </div>
    </div>
  );
}
