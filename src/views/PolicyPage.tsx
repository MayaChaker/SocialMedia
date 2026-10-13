import Link from "next/link";
import type { Policy } from "../data/policies";

/** Server-rendered customer-care page; the route resolves content from POLICIES. */
export default function PolicyPage({ content }: { content: Policy }) {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "care@velourabeauty.com";
  return (
    <main className="policyPage">
      <span className="kicker">Customer care</span>
      <h1>{content.title}</h1>
      <p className="policyIntro">{content.intro}</p>
      <div>
        {content.sections.map(([title, copy]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{copy}</p>
          </section>
        ))}
      </div>
      <div className="policyActions">
        <a className="button dark" href={`mailto:${contact}`}>
          Contact customer care
        </a>
        <Link className="textLink" href="/shop">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
