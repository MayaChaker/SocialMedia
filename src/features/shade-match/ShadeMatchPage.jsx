import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowBack, ArrowForward, Check } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../hooks/useStore";

const steps = [
  { title: "How does your skin read in daylight?", key: "depth", options: ["Fair","Light","Medium","Tan","Deep"] },
  { title: "Which jewellery feels most harmonious?", key: "tone", options: ["Silver · cool","Both · neutral","Gold · warm"] },
  { title: "What finish feels most like you?", key: "finish", options: ["Fresh and sheer","Soft satin","Polished glow"] },
];
const shades = { Fair:["Porcelain 01","Shell 02"], Light:["Linen 03","Petal 04"], Medium:["Honey 05","Almond 06"], Tan:["Amber 07","Caramel 08"], Deep:["Mahogany 09","Cocoa 10"] };

export default function ShadeMatchPage() {
  const { profile,setProfile }=useStore(); const [started,setStarted]=useState(false); const [step,setStep]=useState(0); const [answers,setAnswers]=useState({}); const [saved,setSaved]=useState(false);
  const choose=(value)=>{setAnswers({...answers,[steps[step].key]:value});if(step<steps.length-1)setStep(step+1);else setStep(steps.length)};
  if(!started)return <main className="shadePage"><section><span className="kicker">Petal Skin Tint</span><h1>Meet your<br/><em>closest shade.</em></h1><p>A guided starting point based on depth, undertone, and the finish you love. No camera or personal image required.</p><button className="button dark" onClick={()=>setStarted(true)}>Find my shade <ArrowForward/></button></section><div className="shadeFan" aria-hidden="true">{["#ead8c7","#d9b89e","#c99a76","#a96f4d","#724634"].map((color,index)=><motion.i key={color} style={{background:color,"--index":index}} initial={{rotate:0}} animate={{rotate:(index-2)*8}}/>)}</div></main>;
  if(step===steps.length){const options=shades[answers.depth]||shades.Medium;const selected=answers.tone?.startsWith("Gold")?options[1]:options[0];return <main className="shadeResult"><span className="kicker">Your closest match</span><div className="shadeSwatch" style={{background:answers.depth==="Deep"?"#724634":answers.depth==="Tan"?"#a96f4d":answers.depth==="Medium"?"#c99a76":answers.depth==="Light"?"#d9b89e":"#ead8c7"}}/><h1>{selected}</h1><p>{answers.tone?.split(" · ")[1]} undertone · {answers.finish.toLowerCase()}</p><div className="shadeActions"><button className="button dark" onClick={()=>{setProfile({...profile,shade:selected});setSaved(true)}}>{saved?<><Check/> Saved to profile</>:"Save my shade"}</button><Link className="textLink" to="/product/petal-skin-tint">View Petal Skin Tint</Link></div><button className="backLink" onClick={()=>{setStep(0);setAnswers({});setSaved(false)}}>Start again</button></main>}
  const current=steps[step];return <main className="builderPage questionPage shadeQuestion"><div className="builderProgress"><span style={{width:`${((step+1)/steps.length)*100}%`}}/></div><button className="backLink" onClick={()=>step?setStep(step-1):setStarted(false)}><ArrowBack/> Back</button><AnimatePresence mode="wait"><motion.section key={current.key} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><span className="kicker">Shade match · {step+1} of {steps.length}</span><h1>{current.title}</h1><div className="shadeChoices">{current.options.map((value,index)=><button onClick={()=>choose(value)} key={value}><i style={{background:["#ead8c7","#d9b89e","#c99a76","#a96f4d","#724634"][index%5]}}/><strong>{value}</strong><ArrowForward/></button>)}</div></motion.section></AnimatePresence></main>;
}
