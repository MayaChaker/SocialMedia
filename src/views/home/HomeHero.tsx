import Link from "next/link";
import { ArrowForward } from "@mui/icons-material";
import EditorialImage from "../../components/EditorialImage";

interface HomeHeroProps {
  brandCount: number;
}

export default function HomeHero({ brandCount }: HomeHeroProps) {
  return (
    <section className="homeHero">
      <div className="homeHeroCopy">
        <span className="kicker">{brandCount} beauty houses, one bag</span>
        <h1>
          Every icon,
          <br />
          <em>in one place.</em>
        </h1>
        <p>
          Chanel, Dior, NARS, The Ordinary and more, across makeup, skincare, fragrance and hair.
          Find your foundation shade or build a skincare routine in a few taps.
        </p>
        <div className="homeHeroActions">
          <Link className="button dark" href="/shop?collection=bestsellers">
            Shop bestsellers <ArrowForward />
          </Link>
          <Link className="textLink" href="/shop?collection=new">
            New arrivals
          </Link>
        </div>
      </div>
      <div className="homeHeroImage">
        <EditorialImage
          name="hero"
          alt="Portrait of a woman with luminous skin against a warm background"
          sizes="(max-width: 700px) 100vw, 55vw"
          priority
        />
      </div>
    </section>
  );
}
