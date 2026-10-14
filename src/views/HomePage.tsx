import Consultation from "./home/consultation/Consultation";
import FragranceRoom from "./home/FragranceRoom";
import Hero from "./home/Hero";

/**
 * Homepage prototype for the "Pigment" direction: the opening sequence, one editorial
 * chapter and the consultation tools. Server-rendered; only motion and the tools run in
 * the browser.
 */
export default function HomePage() {
  return (
    <main className="pgHome">
      <Hero />
      <FragranceRoom />
      <Consultation />
    </main>
  );
}
