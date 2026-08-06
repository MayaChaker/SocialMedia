export default function ProductVisual({ type, product }) {
  const generatedImage = product?.image || ({ tube: "/products/veloura-cleanser.webp", bottle: "/products/veloura-serum.webp", lipstick: "/products/veloura-lipstick.webp", jar: "/products/veloura-jar.webp", compact: "/products/veloura-compact.webp", set: "/products/veloura-set.webp", duo: "/products/veloura-set.webp" }[type]);
  if (generatedImage) return <img className="realProductImage" src={generatedImage} alt="" loading="lazy" decoding="async"/>;
  return <div className={`productObject ${type}`} aria-hidden="true"><div className="cap"/><div className="vLabel">V<span>VELOURA</span></div>{type === "set" && <div className="setSecond"><b>V</b></div>}{type === "duo" && <div className="duoSecond"><b>V</b></div>}</div>;
}
