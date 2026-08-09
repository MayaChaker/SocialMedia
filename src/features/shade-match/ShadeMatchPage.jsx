import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowBack, ArrowForward, Check } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../../hooks/useStore";
import { matchShade, matchedProductUrl, SHADE_PROFILES } from "./shadeMatchLogic";

const steps = [
  { title: "How does your skin read in daylight?", key: "depth", options: ["Fair", "Light", "Medium", "Tan", "Deep"] },
  { title: "Which jewellery feels most harmonious?", key: "tone", options: ["Silver · cool", "Both · neutral", "Gold · warm"] },
  { title: "What finish feels most like you?", key: "finish", options: ["Fresh and sheer", "Soft satin", "Polished glow"] },
];

const depthColors = Object.fromEntries(SHADE_PROFILES.map((shade) => [shade.depth, shade.color]));

export default function ShadeMatchPage() {
  const { profile, setProfile } = useStore();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectAnswer = (value) => setAnswers((current) => ({ ...current, [steps[step].key]: value }));

  const continueQuiz = () => {
    if (!answers[steps[step].key]) return;
    if (step === steps.length - 1) setCompleted(true);
    else setStep((current) => current + 1);
  };

  const goBack = () => {
    if (step === 0) setStarted(false);
    else setStep((current) => current - 1);
  };

  const startAgain = () => {
    setStep(0);
    setAnswers({});
    setCompleted(false);
    setSaved(false);
  };

  if (!started) return <main className="shadePage shadeLanding">
    <section>
      <span className="kicker">Petal Skin Tint</span>
      <h1>Meet your<br/><em>closest shade.</em></h1>
      <p>A guided starting point based on depth, undertone, and the finish you love. No camera or personal image required.</p>
      <button className="button dark" onClick={() => setStarted(true)}>Find my shade <ArrowForward/></button>
    </section>
    <div className="shadeFan">
      <span className="shadeFamilyLabel">5 complexion families</span>
      <div className="shadeSamples" aria-hidden="true">{SHADE_PROFILES.map((shade, index) => <motion.i key={shade.variantId} style={{ "--shade": shade.color, "--index": index }} initial={{ rotate: 0, y: 8 }} animate={{ rotate: (index - 2) * 7, y: 0 }} transition={{ duration: .45, delay: index * .035 }}/>)}</div>
    </div>
  </main>;

  if (completed) {
    const result = matchShade(answers);
    const saveShade = () => {
      setProfile({ ...profile, shade: result.name, shadeVariantId: result.variantId });
      setSaved(true);
    };
    return <main className="shadeResultPage">
      <div className="shadeResultLayout">
        <section className="shadeResultVisual" aria-label={`${result.name} shade sample`}>
          <div className="matchedShadeSample" style={{ "--shade": result.color }}><span>{result.name}</span></div>
        </section>
        <section className="shadeResultCopy">
          <span className="kicker">Your shade match</span>
          <h1>{result.name}</h1>
          <p className="shadeProfile">{result.depth} depth <i/> {result.undertone} undertone</p>
          <p className="shadeExplanation">{result.description}</p>
          <dl className="shadeFacts">
            <div><dt>Depth</dt><dd>{result.depth}</dd></div>
            <div><dt>Undertone</dt><dd>{result.undertone}</dd></div>
            <div><dt>Preferred finish</dt><dd>{answers.finish}</dd></div>
          </dl>
          <div className="shadeResultActions">
            <Link className="button dark" to={matchedProductUrl(result)}>Shop {result.name}</Link>
            <button className={`saveShadeButton ${saved ? "saved" : ""}`} onClick={saveShade} aria-pressed={saved}>{saved && <Check/>}{saved ? "Shade saved" : "Save my shade"}</button>
          </div>
          <p className="shadeSaveStatus" role="status" aria-live="polite">{saved ? `We'll keep ${result.name} for you.` : "Save your shade to revisit anytime."}</p>
          <button className="textLink shadeRestart" onClick={startAgain}>Start again</button>
        </section>
      </div>
    </main>;
  }

  const current = steps[step];
  const selected = answers[current.key];
  return <main className="builderPage questionPage shadeQuestion">
    <div className="shadeQuestionShell">
      <div className="questionTopline"><button className="backLink" onClick={goBack}><ArrowBack/> Back</button><span className="stepCount">Step {step + 1} of {steps.length}</span></div>
      <div className="builderProgress" role="progressbar" aria-label={`Shade Match step ${step + 1} of ${steps.length}`} aria-valuemin="1" aria-valuemax={steps.length} aria-valuenow={step + 1}>{steps.map((item, index) => <span key={item.key} className={index <= step ? "active" : ""}/>)}</div>
      <AnimatePresence mode="wait">
        <motion.section key={current.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}>
          <span className="kicker">Shade match</span>
          <h1>{current.title}</h1>
          <div className="shadeChoices" role="radiogroup" aria-label={current.title}>
            {current.options.map((value) => {
              const isSelected = selected === value;
              const swatchColor = current.key === "depth" ? depthColors[value] : null;
              return <button type="button" role="radio" aria-checked={isSelected} className={`${isSelected ? "selected" : ""} ${swatchColor ? "hasSwatch" : ""}`} onClick={() => selectAnswer(value)} key={value}>
                {swatchColor && <i style={{ "--shade": swatchColor }} aria-hidden="true"/>}
                <strong>{value}</strong>
                <span className="shadeChoiceIndicator" aria-hidden="true">{isSelected ? <Check/> : <ArrowForward/>}</span>
              </button>;
            })}
          </div>
          <div className="questionActions"><button className="button dark" disabled={!selected} onClick={continueQuiz}>{step === steps.length - 1 ? "See my shade" : "Continue"}<ArrowForward/></button></div>
        </motion.section>
      </AnimatePresence>
    </div>
  </main>;
}
