import Link from "next/link";
import { ArrowForward } from "@mui/icons-material";
import { HOME_CATEGORIES } from "../../data/merchandising";
import { SCENES } from "../../data/scenes";
import ProductScene from "../../components/product-art/ProductScene";
import SectionHeading from "./SectionHeading";

export default function HomeCategories() {
  return (
    <section className="homeSection categorySection">
      <SectionHeading
        eyebrow="Find your ritual"
        title="Shop by category"
        copy="Skincare, colour, and considered sets—designed to live together."
      />
      <div className="categoryGrid">
        {HOME_CATEGORIES.map((category) => (
          <Link className="categoryCard" href={category.href} key={category.title}>
            <ProductScene scene={SCENES[category.scene]} />
            <span>
              <small>{category.copy}</small>
              <strong>{category.title}</strong>
              <em>
                Shop now <ArrowForward />
              </em>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
