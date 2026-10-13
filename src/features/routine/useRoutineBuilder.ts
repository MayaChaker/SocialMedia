import { useMemo, useState } from "react";
import { useCartDrawer } from "../../hooks/useCartDrawer";
import { useCommerce } from "../../hooks/useCommerce";
import { useCustomer } from "../../hooks/useCustomer";
import type { Product, ProductId } from "../../types/commerce";
import {
  buildRoutineRecommendations,
  type RoutineAnswers,
  type RoutineStep,
} from "./routineRecommendations";
import { ROUTINE_QUESTIONS, isComplete, questionAt, type RoutineDraft } from "./routineQuestions";

export const isAvailable = (product: Product) => product.stock !== 0;

/** All state and actions of the routine builder: intro → questions → result. */
export function useRoutineBuilder() {
  const { openCart } = useCartDrawer();
  const { addToCart } = useCommerce();
  const { saveRoutine: persistRoutine } = useCustomer();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<RoutineDraft>({});
  const [result, setResult] = useState<RoutineAnswers | null>(null);
  const [generationError, setGenerationError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [addStatus, setAddStatus] = useState<Record<ProductId, "added">>({});
  const [fullStatus, setFullStatus] = useState<"idle" | "added">("idle");
  // Shopper-chosen alternatives, keyed by step index.
  const [replacements, setReplacements] = useState<Record<number, Product>>({});
  const [confirmReset, setConfirmReset] = useState(false);

  const recommendations = useMemo(
    (): RoutineStep[] =>
      result
        ? buildRoutineRecommendations(result).map((item, index) => {
            const replacement = replacements[index];
            return replacement
              ? {
                  ...item,
                  product: replacement,
                  reason: `A suitable alternative for the same ${item.step.toLowerCase()} step, selected by you.`,
                }
              : item;
          })
        : [],
    [result, replacements],
  );
  const availableRecommendations = useMemo(
    () => recommendations.filter(({ product }) => isAvailable(product)),
    [recommendations],
  );
  const routineTotal = useMemo(
    () => availableRecommendations.reduce((sum, item) => sum + item.product.price, 0),
    [availableRecommendations],
  );

  const selectAnswer = (value: string) => {
    // Values come from the current question's own options.
    setAnswers((current) => ({ ...current, [questionAt(step).key]: value }) as RoutineDraft);
    setSaved(false);
  };

  const finishQuiz = () => {
    let next: RoutineStep[] = [];
    try {
      if (isComplete(answers)) next = buildRoutineRecommendations(answers);
    } catch {
      // A routine product missing from the catalogue: show the retry message.
    }
    if (!next.length || !isComplete(answers)) {
      setGenerationError("No complete routine is available for these answers.");
      return;
    }
    setGenerationError("");
    setResult({ ...answers });
  };

  const continueQuestion = () => {
    if (!answers[questionAt(step).key]) return;
    if (step === ROUTINE_QUESTIONS.length - 1) finishQuiz();
    else setStep((current) => current + 1);
  };

  const goBack = () => {
    if (step === 0) setStarted(false);
    else setStep((current) => current - 1);
  };

  const resetRoutine = () => {
    setResult(null);
    setStep(0);
    setAnswers({});
    setSaved(false);
    setSaveStatus("");
    setAddStatus({});
    setFullStatus("idle");
    setReplacements({});
    setConfirmReset(false);
  };

  const startAgain = () => {
    if (!saved && !confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetRoutine();
  };

  const addProduct = (product: Product) => {
    if (!isAvailable(product)) return;
    addToCart(product);
    setAddStatus((current) => ({ ...current, [product.id]: "added" }));
    openCart();
  };

  const addRoutine = () => {
    if (!availableRecommendations.length) return;
    availableRecommendations.forEach(({ product }) => addToCart(product));
    setAddStatus(
      Object.fromEntries(availableRecommendations.map(({ product }) => [product.id, "added"])),
    );
    setFullStatus("added");
    openCart();
  };

  const replaceStep = (index: number, product: Product) => {
    setReplacements((current) => ({ ...current, [index]: product }));
    setSaved(false);
    setFullStatus("idle");
  };

  const saveRoutine = () => {
    if (!result) return;
    persistRoutine({
      productIds: recommendations.map(({ product }) => product.id),
      answers: result,
    });
    setSaved(true);
    setSaveStatus("Routine saved in this browser.");
  };

  const editAnswers = () => {
    setResult(null);
    setStep(0);
    setSaved(false);
    setSaveStatus("");
  };

  return {
    started,
    step,
    answers,
    result,
    generationError,
    saved,
    saveStatus,
    addStatus,
    fullStatus,
    confirmReset,
    recommendations,
    availableRecommendations,
    routineTotal,
    start: () => setStarted(true),
    selectAnswer,
    continueQuestion,
    retry: finishQuiz,
    goBack,
    startAgain,
    addProduct,
    addRoutine,
    replaceStep,
    saveRoutine,
    editAnswers,
  };
}

export type RoutineBuilder = ReturnType<typeof useRoutineBuilder>;
