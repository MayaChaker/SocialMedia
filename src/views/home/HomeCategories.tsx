import Link from "next/link";
import { ArrowForward } from "@mui/icons-material";
import EditorialImage from "../../components/EditorialImage";
import { HOME_CATEGORIES } from "../../data/merchandising";
import SectionHeading from "./SectionHeading";

export default function HomeCategories() {
  return (
    <section className="homeSection">
      <SectionHeading eyebrow="Explore" title="Shop by category" />
      <div className="categoryGrid">
        {HOME_CATEGORIES.map((category) => (
          <Link className="categoryCard" href={category.href} key={category.title}>
            <EditorialImage
              name={category.image}
              alt={category.alt}
              sizes="(max-width: 700px) 50vw, 25vw"
            />
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
