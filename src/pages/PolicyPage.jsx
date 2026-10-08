import { resolvePolicy } from "./policies";

export default function PolicyPage({ policy, LinkComponent }) {
  const content = resolvePolicy(policy);
  const contact = process.env.REACT_APP_CONTACT_EMAIL || "care@velourabeauty.com";

  return <main className="policyPage"><span className="kicker">Customer care</span><h1>{content.title}</h1><p className="policyIntro">{content.intro}</p><div>{content.sections.map(([title,copy])=><section key={title}><h2>{title}</h2><p>{copy}</p></section>)}</div><div className="policyActions"><a className="button dark" href={`mailto:${contact}`}>Contact customer care</a><LinkComponent className="textLink" to="/shop">Continue shopping</LinkComponent></div></main>;
}
