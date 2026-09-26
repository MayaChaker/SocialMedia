import { useState } from "react";

export default function ProductVisual({ type, product }) {
  const [failedImage, setFailedImage] = useState("");
  const generatedImage = product?.image || product?.variants?.[0]?.image || ({ tube: "/products/veloura-cleanser.webp", bottle: "/products/veloura-serum.webp", serum: "/products/veloura-serum-bestseller-v2.webp", lipstick: "/products/veloura-lipstick.webp", jar: "/products/veloura-jar.webp", compact: "/products/veloura-compact.webp", set: "/products/veloura-set.webp", duo: "/products/veloura-set.webp" }[type]);
  if (generatedImage && failedImage !== generatedImage) return <img className="realProductImage" src={generatedImage} alt={`${product?.name || "Veloura beauty product"}${product?.selectedVariant ? ` in ${product.selectedVariant}` : ""}`} loading="lazy" decoding="async" onError={() => setFailedImage(generatedImage)}/>;
  if (generatedImage) return <div className="productImageFallback" role="img" aria-label={`${product?.name || "Product"} image unavailable`}><span>Image unavailable</span></div>;
  return <div className={`productObject ${type}`} aria-hidden="true"><div className="cap"/><div className="vLabel">V<span>VELOURA</span></div>{type === "set" && <div className="setSecond"><b>V</b></div>}{type === "duo" && <div className="duoSecond"><b>V</b></div>}</div>;
}
