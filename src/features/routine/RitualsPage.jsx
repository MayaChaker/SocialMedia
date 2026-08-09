import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowBack, ArrowForward, AutoAwesomeOutlined, Check, Loop, Tune } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { money } from "../../data/products";
import { useStore } from "../../hooks/useStore";
import ProductVisual from "../products/ProductVisual";
import { buildRoutineRecommendations, routineTitle } from "./routineRecommendations";

const questions = [
  { key: "goal", eyebrow: "Your focus", title: "What would you most like to support?", options: [["Dehydration", "Comfort and lasting hydration"], ["Dullness", "A brighter, more rested look"], ["Fine lines", "Smoothness and resilience"], ["Sensitive skin", "Calm, barrier-first care"]] },
  { key: "time", eyebrow: "Your pace", title: "How much time feels realistic?", options: [["Essential", "Two effortless steps"], ["Balanced", "A complete three-step ritual"], ["Immersive", "Four considered layers"]] },
  { key: "texture", eyebrow: "Your preference", title: "Which textures do you reach for?", options: [["Weightless", "Fresh gels and fluid layers"], ["Cushioning", "Soft creams and comforting emulsions"], ["Rich", "Velvety, replenishing finishes"]] },
];

const principles = [
  [AutoAwesomeOutlined, "Personal", "Shaped around what your skin needs now."],
  [Tune, "Concise", "Only the steps that genuinely earn their place."],
  [Loop, "Flexible", "Easy to revisit whenever your needs change."],
];

export default function RitualsPage({ openCart }) {
  const { addToCart, setRoutineResults } = useStore();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [addedIds, setAddedIds] = useState([]);

  const recommendations = useMemo(() => result ? buildRoutineRecommendations(result) : [], [result]);

  const selectAnswer = (value) => {
    setAnswers((current) => ({ ...current, [questions[step].key]: value }));
  };

  const continueQuestion = () => {
    if (!answers[questions[step].key]) return;
    if (step === questions.length - 1) {
      setResult(answers);
      setSaved(false);
      return;
    }
    setStep((current) => current + 1);
  };

  const goBack = () => {
    if (step === 0) setStarted(false);
    else setStep((current) => current - 1);
  };

  const startAgain = () => {
    setResult(null);
    setStep(0);
    setAnswers({});
    setSaved(false);
    setAddedIds([]);
  };

  const addProduct = (product) => {
    addToCart(product);
    setAddedIds((ids) => ids.includes(product.id) ? ids : [...ids, product.id]);
    openCart?.();
  };

  const addRoutine = () => {
    recommendations.forEach(({ product }) => addToCart(product));
    setAddedIds(recommendations.map(({ product }) => product.id));
    openCart?.();
  };

  const saveRoutine = () => {
    setRoutineResults(recommendations.map(({ product }) => product.name));
    setSaved(true);
  };

  if (!started) return <main className="contentPage ritualsPage">
    <section className="contentHero ritualsHero">
      <span className="kicker">Routine builder</span>
      <h1>Your ritual,<br/><em>beautifully simple.</em></h1>
      <p>Three thoughtful questions. A concise routine shaped around your skin, your preferences, and the time you actually have.</p>
      <button className="button dark" onClick={() => setStarted(true)}>Build my ritual <ArrowForward/></button>
    </section>
    <section className="ritualPrinciples" aria-label="Why build a Veloura ritual">
      {principles.map(([Icon, title, copy], index) => <article key={title}><div><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true"/></div><h2>{title}</h2><p>{copy}</p></article>)}
    </section>
  </main>;

  if (result) return <main className="routineResultPage">
    <div className="routineResultLayout">
      <section className="routineResultIntro">
        <span className="kicker">Your routine</span>
        <h1>{routineTitle(result)}</h1>
        <p>A considered {recommendations.length}-step ritual, selected for your {result.texture.toLowerCase()} texture preference and the pace that feels natural to you.</p>
        <ol className="resultOrder" aria-label="Recommended routine order">
          {recommendations.map(({ product, step: stepName }, index) => <li key={product.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{stepName}</strong><small>{product.name}</small></div></li>)}
        </ol>
        <div className="routinePrimaryActions">
          <button className="button dark" onClick={addRoutine}>Add routine to bag</button>
          <button className={`saveRitualButton ${saved ? "saved" : ""}`} onClick={saveRoutine} aria-pressed={saved}>{saved && <Check/>}{saved ? "Ritual saved" : "Save my ritual"}</button>
        </div>
        <p className="saveRitualStatus" role="status" aria-live="polite">{saved ? "Your ritual is ready to revisit anytime." : "Save this routine to revisit anytime."}</p>
        <div className="routineSecondaryActions"><Link className="textLink" to="/shop">Explore the full collection</Link><button className="textLink" onClick={startAgain}>Start again</button></div>
      </section>

      <section className="routineRecommendations" aria-label="Your recommended products">
        {recommendations.map(({ product, step: stepName, reason }, index) => <article className="routineProduct" key={product.id}>
          <Link className={`routineProductVisual ${product.color}`} to={`/product/${product.slug}`} aria-label={`View ${product.name}`}><ProductVisual type={product.type} product={product}/></Link>
          <div className="routineProductCopy">
            <span className="routineStep">{String(index + 1).padStart(2, "0")} · {stepName}</span>
            <div className="routineProductTitle"><Link to={`/product/${product.slug}`}><h2>{product.name}</h2></Link><strong>{money(product.price)}</strong></div>
            <p>{reason}</p>
            <button className="routineAddButton" onClick={() => addProduct(product)}>{addedIds.includes(product.id) ? <><Check/> Added to bag</> : "Add to bag"}</button>
          </div>
        </article>)}
      </section>
    </div>
  </main>;

  const question = questions[step];
  const selected = answers[question.key];
  return <main className="builderPage questionPage">
    <div className="questionShell">
      <div className="questionTopline">
        <button className="backLink" onClick={goBack}><ArrowBack/> Back</button>
        <span className="stepCount">Step {step + 1} of {questions.length}</span>
      </div>
      <div className="builderProgress" role="progressbar" aria-label={`Step ${step + 1} of ${questions.length}`} aria-valuemin="1" aria-valuemax={questions.length} aria-valuenow={step + 1}>
        {questions.map((item, index) => <span key={item.key} className={index <= step ? "active" : ""}/>) }
      </div>
      <AnimatePresence mode="wait">
        <motion.section key={question.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}>
          <span className="kicker">{question.eyebrow}</span>
          <h1>{question.title}</h1>
          <div className="choiceGrid" role="radiogroup" aria-label={question.title}>
            {question.options.map(([value, copy]) => {
              const isSelected = selected === value;
              return <button type="button" role="radio" aria-checked={isSelected} className={isSelected ? "selected" : ""} onClick={() => selectAnswer(value)} key={value}><span className="choiceCopy"><strong>{value}</strong><span>{copy}</span></span><span className="choiceIndicator" aria-hidden="true">{isSelected ? <Check/> : <ArrowForward/>}</span></button>;
            })}
          </div>
          <div className="questionActions"><button className="button dark" disabled={!selected} onClick={continueQuestion}>{step === questions.length - 1 ? "See my ritual" : "Continue"}<ArrowForward/></button></div>
        </motion.section>
      </AnimatePresence>
    </div>
  </main>;
}
