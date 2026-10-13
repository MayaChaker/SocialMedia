import Link from "next/link";
import { ArrowForward } from "@mui/icons-material";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  copy?: string;
  href?: string;
  /** Link text, shown when `href` is set. */
  link?: string;
  /** Opens `href` in a new tab instead of client-side navigation. */
  external?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  copy,
  href,
  link,
  external,
}: SectionHeadingProps) {
  return (
    <div className="homeSectionHeader">
      <div>
        {eyebrow && <span className="kicker">{eyebrow}</span>}
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {href &&
        (external ? (
          <a className="textLink" href={href} target="_blank" rel="noreferrer">
            {link}
            <ArrowForward />
          </a>
        ) : (
          <Link className="textLink" href={href}>
            {link}
            <ArrowForward />
          </Link>
        ))}
    </div>
  );
}
