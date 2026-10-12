import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ProductScene from "../components/product-art/ProductScene";
import { SCENES } from "../data/scenes";

const selectionCriteria = [
  [
    "01",
    "Performance",
    "Products selected for quality, reliability, and how well they fit their intended purpose.",
  ],
  [
    "02",
    "Experience",
    "Textures, finishes, packaging, and details that make beauty enjoyable to use.",
  ],
  ["03", "Everyday Fit", "Products that can realistically become part of an everyday routine."],
];

export default function AboutPage() {
  return (
    <main className="storyFinal">
      <section className="storyFinalHero">
        <ProductScene
          scene={SCENES.campaign}
          label="Illustration of Veloura skincare and colour essentials on warm stone"
        />
        <div className="storyFinalHeroShade" aria-hidden="true" />
        <div className="storyFinalHeroCopy">
          <span className="storyEyebrow">Our story</span>
          <h1>
            Beauty, chosen
            <br />
            <em>with intention.</em>
          </h1>
          <p>
            A considered edit of skincare, makeup, and everyday beauty essentials, selected to make
            finding what works for you feel simpler.
          </p>
        </div>
        <span className="storyFinalHeroNote">Beauty, considered.</span>
      </section>

      <section className="storyFinalPhilosophy">
        <div className="storyFinalPhilosophyImage">
          <ProductScene
            scene={SCENES.lipstickShades}
            label="Illustration of five Velvet Ritual Lip shades"
          />
        </div>
        <div className="storyFinalPhilosophyCopy">
          <span className="storyEyebrow">Why Veloura</span>
          <h2>
            Less searching.
            <br />
            <em>Better discoveries.</em>
          </h2>
          <p>
            Beauty shopping can feel endless. Veloura brings together a more considered selection,
            making it easier to discover products that fit your routine, preferences, and everyday
            life.
          </p>
        </div>
      </section>

      <section className="storyEdit">
        <div className="storyEditCopy">
          <span className="storyEyebrow">The Veloura Edit</span>
          <h2>
            A considered collection,
            <br />
            <em>not an endless shelf.</em>
          </h2>
          <p>
            We look for products that balance performance, experience, and everyday usefulness—so
            every addition has a reason to be here.
          </p>
        </div>
        <div className="storyEditImage">
          <ProductScene
            scene={SCENES.morningLayers}
            label="Illustration of Veloura essence, serum and SPF"
          />
          <span>Selected with intention</span>
        </div>
      </section>

      <section className="storyCriteria storyCriteriaClosing" aria-labelledby="criteria-title">
        <header>
          <span className="storyEyebrow">How we choose</span>
          <h2 id="criteria-title">Chosen with a reason.</h2>
        </header>
        <div>
          {selectionCriteria.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="storyShelf storyDiscover">
        <div className="storyShelfImage">
          <ProductScene
            scene={SCENES.eveningEdit}
            label="Illustration of the Veloura evening routine"
          />
        </div>
        <div className="storyShelfCopy">
          <span className="storyEyebrow">Discover the edit</span>
          <h2>
            Find your next
            <br />
            everyday favorite.
          </h2>
          <p>
            Explore skincare, makeup, and beauty essentials selected for real routines and
            individual preferences.
          </p>
          <Link className="button light" to="/shop">
            Shop the collection <ArrowForward />
          </Link>
        </div>
      </section>
    </main>
  );
}
