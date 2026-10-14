import { productRepository } from "../repositories/productRepository";
import FragranceRoom from "./home/FragranceRoom";
import Hero from "./home/Hero";
import ShadeStudio from "./home/ShadeStudio";

const studioProduct = productRepository.getBySlug("mac-matte-lipstick");

/**
 * Homepage prototype for the "Pigment" direction: the opening sequence, one editorial
 * chapter and one product interaction. Server-rendered; only the motion and the shade
 * studio run in the browser.
 */
export default function HomePage() {
  return (
    <main className="pgHome">
      <Hero />
      <FragranceRoom />
      {studioProduct && <ShadeStudio product={studioProduct} />}
    </main>
  );
}
