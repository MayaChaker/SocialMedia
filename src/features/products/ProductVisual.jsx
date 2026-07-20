export default function ProductVisual({ type }) {
  return <div className={`productObject ${type}`} aria-hidden="true"><div className="cap"/><div className="vLabel">V<span>VELOURA</span></div>{type === "set" && <div className="setSecond"><b>V</b></div>}{type === "duo" && <div className="duoSecond"><b>V</b></div>}</div>;
}
