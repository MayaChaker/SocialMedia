import { ArrowForward } from "@mui/icons-material";
import { motion } from "framer-motion";
import { SHADE_PROFILES } from "./shadeMatchLogic";

/** Landing screen of the shade finder, with a fan of the five shade families. */
export default function ShadeIntro({ onStart }: { onStart: () => void }) {
  return (
    <main className="shadePage shadeLanding">
      <section>
        <span className="kicker">Estée Lauder Double Wear</span>
        <h1>
          Meet your
          <br />
          <em>closest shade.</em>
        </h1>
        <p>
          A guided starting point based on depth, undertone, and the finish you love. No camera or
          personal image required.
        </p>
        <button className="button dark" onClick={onStart}>
          Find my shade <ArrowForward />
        </button>
      </section>
      <div className="shadeFan">
        <span className="shadeFamilyLabel">5 complexion families</span>
        <div className="shadeSamples" aria-hidden="true">
          {SHADE_PROFILES.map((shade, index) => (
            <motion.i
              key={shade.variantId}
              style={{ "--shade": shade.swatch, "--index": index }}
              initial={{ rotate: 0, y: 8 }}
              animate={{ rotate: (index - 2) * 7, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.035 }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
