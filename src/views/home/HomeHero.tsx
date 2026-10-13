import Link from "next/link";
import { ArrowForward, LockOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { SCENES } from "../../data/scenes";
import ProductScene from "../../components/product-art/ProductScene";

export default function HomeHero() {
  return (
    <section className="hero homeHero">
      <motion.div
        className="heroCopy"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <span className="kicker">Beauty, considered.</span>
        <h1>
          Quiet luxury
          <br />
          for your skin.
        </h1>
        <p>
          Explore Veloura skincare, makeup, and coordinated sets, with guided tools that narrow the
          collection around your routine and shade preferences.
        </p>
        <div className="heroActions">
          <Link className="button dark" href="/shop">
            Shop the collection <ArrowForward />
          </Link>
          <Link className="textLink" href="/shop?collection=bestsellers">
            Shop bestsellers
          </Link>
        </div>
        <p className="heroReassurance">
          <LockOutlined /> Complimentary delivery on $75+ · Checkout is clearly marked when in demo
          mode
        </p>
      </motion.div>
      <div className="heroImage">
        <ProductScene
          scene={SCENES.hero}
          label="Illustration of Veloura serum, night cream and lipstick on a stone plinth"
        />
      </div>
    </section>
  );
}
