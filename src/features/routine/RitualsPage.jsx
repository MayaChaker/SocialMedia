import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowBack, ArrowForward, AutoAwesomeOutlined, Check, Loop, Tune } from "@mui/icons-material";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { money } from "../../data/products";
import { useStore } from "../../hooks/useStore";
import ProductVisual from "../products/ProductVisual";
import { buildRoutineRecommendations, routineAlternatives, routineTitle } from "./routineRecommendations";

const questions = [
  { key: "goal", label: "Concern", eyebrow: "Your focus", title: "What would you most like to support?", options: [["Dehydration", "Tightness or lack of lasting moisture."], ["Dullness", "Skin that looks tired or lacks radiance."], ["Fine lines", "Early visible lines and dryness."], ["Sensitive skin", "Skin that reacts or feels easily irritated."]] },
  { key: "texture", label: "Texture", eyebrow: "Your preference", title: "Which textures do you reach for?", options: [["Weightless", "Light and quick-absorbing."], ["Cushioning", "Soft, comforting hydration."], ["Rich", "Deeply nourishing textures."]] },
  { key: "time", label: "Time", eyebrow: "Your pace", title: "How much time feels realistic?", options: [["Essential", "A streamlined 2-step routine."], ["Balanced", "A complete 3-step routine."], ["Immersive", "A considered 4-step routine."]] },
];

const principles = [
  [AutoAwesomeOutlined, "Personal", "Selected around your skin concerns."],
  [Tune, "Concise", "Only the steps your skin needs."],
  [Loop, "Flexible", "Easy to adjust as your routine changes."],
];

const timeLabel = { Essential: "2-step routine", Balanced: "3-step routine", Immersive: "4-step routine" };
const isAvailable = (product) => Boolean(product) && product.stock !== 0;

export default function RitualsPage({ openCart }) {
  const { addToCart, setRoutineResults } = useStore();
  const reduceMotion = useReducedMotion();
  const headingRef = useRef(null);
  const generationTimer = useRef(null);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [addStatus, setAddStatus] = useState({});
  const [fullStatus, setFullStatus] = useState("idle");
  const [replacements, setReplacements] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => () => clearTimeout(generationTimer.current), []);
  useEffect(() => {
    if (started) requestAnimationFrame(() => headingRef.current?.focus());
  }, [started, step, result, generating]);

  const recommendations = useMemo(() => result ? buildRoutineRecommendations(result).map((item, index) => replacements[index] ? { ...item, product: replacements[index], reason: `A suitable alternative for the same ${item.step.toLowerCase()} step, selected by you.` } : item).filter((item) => item.product) : [], [result, replacements]);
  const availableRecommendations = useMemo(() => recommendations.filter(({ product }) => isAvailable(product)), [recommendations]);
  const routineTotal = useMemo(() => availableRecommendations.reduce((sum, item) => sum + item.product.price, 0), [availableRecommendations]);

  const selectAnswer = (value) => {
    setAnswers((current) => ({ ...current, [questions[step].key]: value }));
    setSaved(false);
  };

  const finishQuiz = () => {
    setGenerationError("");
    setGenerating(true);
    generationTimer.current = setTimeout(() => {
      try {
        const next = buildRoutineRecommendations(answers);
        if (!next.length || next.some(({ product }) => !product)) throw new Error("No complete routine is available.");
        setResult({ ...answers });
      } catch (error) {
        setGenerationError(error.message || "We could not build your routine.");
      } finally {
        setGenerating(false);
      }
    }, reduceMotion ? 0 : 260);
  };

  const continueQuestion = () => {
    if (!answers[questions[step].key]) return;
    if (step === questions.length - 1) finishQuiz();
    else setStep((current) => current + 1);
  };

  const goBack = () => {
    if (step === 0) setStarted(false);
    else setStep((current) => current - 1);
  };

  const resetRoutine = () => {
    setResult(null); setStep(0); setAnswers({}); setSaved(false); setSaveStatus("");
    setAddStatus({}); setFullStatus("idle"); setReplacements({}); setConfirmReset(false);
  };

  const startAgain = () => {
    if (!saved && !confirmReset) { setConfirmReset(true); return; }
    resetRoutine();
  };

  const addProduct = (product) => {
    if (!isAvailable(product) || addStatus[product.id] === "adding") return;
    setAddStatus((current) => ({ ...current, [product.id]: "adding" }));
    try {
      addToCart(product);
      setAddStatus((current) => ({ ...current, [product.id]: "added" }));
      openCart?.();
    } catch {
      setAddStatus((current) => ({ ...current, [product.id]: "error" }));
    }
  };

  const addRoutine = () => {
    if (!availableRecommendations.length || fullStatus === "adding") return;
    setFullStatus("adding");
    try {
      availableRecommendations.forEach(({ product }) => addToCart(product));
      setAddStatus(Object.fromEntries(availableRecommendations.map(({ product }) => [product.id, "added"])));
      setFullStatus("added");
      openCart?.();
    } catch { setFullStatus("error"); }
  };

  const saveRoutine = () => {
    try {
      setRoutineResults({ productIds: recommendations.map(({ product }) => product.id), answers: result });
      setSaved(true);
      setSaveStatus("Routine saved in this browser.");
    } catch { setSaveStatus("We could not save your routine. Please try again."); }
  };

  const editAnswers = () => { setResult(null); setStep(0); setSaved(false); setSaveStatus(""); };

  if (!started) return <main className="contentPage ritualsPage">
    <section className="contentHero ritualsHero">
      <span className="kicker">Routine Builder</span>
      <h1>Your ritual,<br/><em>beautifully simple.</em></h1>
      <p>Answer 3 quick questions and discover a routine selected for your skin concerns, texture preferences, and available time.</p>
      <button className="button dark" onClick={() => setStarted(true)}>Build My Routine — 3 Questions <ArrowForward aria-hidden="true"/></button>
    </section>
    <section className="ritualPrinciples" aria-label="Why build a Veloura routine">
      {principles.map(([Icon, title, copy], index) => <article key={title}><div><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true"/></div><h2>{title}</h2><p>{copy}</p></article>)}
    </section>
  </main>;

  if (generating) return <main className="builderPage routineLoading" aria-live="polite" aria-busy="true"><div className="routineLoadingMark"/><h1 ref={headingRef} tabIndex="-1">Building your routine…</h1><p>Matching your preferences with the Veloura collection.</p></main>;

  if (result) return <main className="routineResultPage">
    <div className="routineResultLayout">
      <section className="routineResultIntro">
        <span className="kicker">Your routine</span>
        <h1 ref={headingRef} tabIndex="-1">{routineTitle(result)}</h1>
        <p>Selected for <strong>{result.goal.toLowerCase()}</strong>, your preference for <strong>{result.texture.toLowerCase()}</strong> textures, and a <strong>{timeLabel[result.time].toLowerCase()}</strong>.</p>
        <div className="routinePreferences">
          <div className="routinePreferencesTitle"><h2>Your preferences</h2><button type="button" onClick={editAnswers}>Edit Answers</button></div>
          <dl><div><dt>Concern</dt><dd>{result.goal}</dd></div><div><dt>Texture</dt><dd>{result.texture}</dd></div><div><dt>Time</dt><dd>{timeLabel[result.time]}</dd></div></dl>
        </div>
        <ol className="resultOrder" aria-label="Recommended routine order">
          {recommendations.map(({ product, step: stepName }, index) => <li key={`${index}-${product.id}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{stepName}</strong><small>{product.name}</small></div></li>)}
        </ol>
        <div className="routinePrimaryActions">
          <button className="button dark" disabled={!availableRecommendations.length || fullStatus === "adding"} onClick={addRoutine}>{fullStatus === "adding" ? "Adding…" : fullStatus === "added" ? "Added" : `Add Full Routine — ${money(routineTotal)}`}</button>
          <button className={`saveRitualButton ${saved ? "saved" : ""}`} onClick={saveRoutine} aria-pressed={saved}>{saved && <Check aria-hidden="true"/>}{saved ? "Routine Saved" : "Save Routine"}</button>
          <button className="button outline routineEditButton" onClick={editAnswers}>Edit Answers</button>
        </div>
        <p className={`saveRitualStatus ${fullStatus === "error" ? "error" : ""}`} role="status" aria-live="polite">{fullStatus === "error" ? "We could not add the routine. Please try again." : saveStatus || (saved ? "Routine saved in this browser." : "Save this routine to revisit it in Beauty Profile on this browser.")}</p>
        {availableRecommendations.length < recommendations.length && <p className="routineAvailabilityNote">Unavailable items are excluded from the full-routine total and action.</p>}
        <div className="routineSecondaryActions"><Link className="textLink" to="/shop">Explore All Products</Link><button className="textLink" onClick={startAgain}>{confirmReset ? "Confirm Start Again" : "Start Again"}</button></div>
        {confirmReset && <p className="resetNotice" role="status">Starting again will clear these unsaved answers. Select “Confirm Start Again” to continue.</p>}
      </section>

      <section className="routineRecommendations" aria-label="Your recommended products">
        {recommendations.map(({ product, step: stepName, reason }, index) => {
          const alternatives = routineAlternatives(product, recommendations);
          const status = addStatus[product.id] || "idle";
          const available = isAvailable(product);
          return <article className="routineProduct" key={`${index}-${product.id}`}>
            <Link className={`routineProductVisual ${product.color}`} to={`/product/${product.slug}`} aria-label={`View ${product.name}`}><ProductVisual type={product.type} product={product}/></Link>
            <div className="routineProductCopy">
              <span className="routineStep">{String(index + 1).padStart(2, "0")} · {stepName}</span>
              <div className="routineProductTitle"><Link to={`/product/${product.slug}`}><h2>{product.name}</h2></Link><strong>{money(product.price)}</strong></div>
              <p>{reason}</p><p className={`routineMeta ${available ? "" : "unavailable"}`}>{product.size} · {available ? "In stock" : "Out of stock"}</p>
              {alternatives.length > 0 && <label className="routineReplace"><span>Replace this step</span><select value="" onChange={(event) => { const replacement = alternatives.find((item) => item.id === Number(event.target.value)); if (replacement) { setReplacements((current) => ({ ...current, [index]: replacement })); setSaved(false); setFullStatus("idle"); } }}><option value="">Choose an alternative</option>{alternatives.map((item) => <option key={item.id} value={item.id}>{item.name} · {money(item.price)}</option>)}</select></label>}
              <button className="routineAddButton" disabled={!available || status === "adding"} onClick={() => addProduct(product)}>{!available ? "Out of stock" : status === "adding" ? "Adding…" : status === "added" ? <><Check aria-hidden="true"/> Added</> : status === "error" ? "Try Add Item Again" : "Add Item"}</button>
            </div>
          </article>;
        })}
      </section>
    </div>
  </main>;

  const question = questions[step];
  const selected = answers[question.key];
  const handleChoiceKeys = (event) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const controls = [...event.currentTarget.querySelectorAll('[role="radio"]')];
    const current = Math.max(0, controls.indexOf(document.activeElement));
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
    const next = controls[(current + direction + controls.length) % controls.length];
    next.focus(); next.click();
  };

  return <main className="builderPage questionPage">
    <div className="questionShell">
      <div className="questionTopline"><span className="stepCount">Step {step + 1} of {questions.length}</span></div>
      <ol className="routineProgress" aria-label={`Step ${step + 1} of ${questions.length}`}>
        {questions.map((item, index) => <li key={item.key} className={index < step ? "complete" : index === step ? "current" : "upcoming"} aria-current={index === step ? "step" : undefined}><span className="progressMark">{index < step ? <Check aria-hidden="true"/> : index + 1}</span><span>{item.label}</span></li>)}
      </ol>
      <AnimatePresence mode="wait">
        <motion.section key={question.key} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: reduceMotion ? 0 : .2 }}>
          <span className="kicker">{question.eyebrow}</span>
          <h1 ref={headingRef} tabIndex="-1">{question.title}</h1>
          <div className={`choiceGrid ${question.key}`} role="radiogroup" aria-label={question.title} onKeyDown={handleChoiceKeys}>
            {question.options.map(([value, copy], index) => {
              const isSelected = selected === value;
              const descriptionId = `${question.key}-${index}-description`;
              return <button type="button" role="radio" aria-checked={isSelected} aria-describedby={descriptionId} tabIndex={isSelected || (!selected && index === 0) ? 0 : -1} className={isSelected ? "selected" : ""} onClick={() => selectAnswer(value)} key={value}><span className="choiceCopy"><strong>{value}</strong><span id={descriptionId}>{copy}</span></span><span className="choiceIndicator" aria-hidden="true">{isSelected ? <Check/> : null}</span></button>;
            })}
          </div>
          <p className="choiceGuidance" aria-live="polite">{selected ? `${selected} selected.` : "Choose one option to continue."}</p>
          {generationError && <div className="routineError" role="alert"><p>{generationError}</p><button type="button" onClick={finishQuiz}>Retry</button></div>}
          <div className="questionActions"><button className="button outline" onClick={goBack}><ArrowBack aria-hidden="true"/> Back</button><button className="button dark" disabled={!selected} onClick={continueQuestion}>{step === questions.length - 1 ? "See My Routine" : "Continue"}<ArrowForward aria-hidden="true"/></button></div>
        </motion.section>
      </AnimatePresence>
    </div>
  </main>;
}
