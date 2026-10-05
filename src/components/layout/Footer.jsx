import { Link } from "react-router-dom";

export default function Footer() {
  return <FooterContent/>;
}

export function FooterContent({ LinkComponent = Link }) {
  const contact = process.env.REACT_APP_CONTACT_EMAIL || "care@velourabeauty.com";

  return <footer className="siteFooter"><div className="footerInner"><div className="footerGrid"><div className="footerBrand"><LinkComponent className="wordmark" to="/">VELOURA<span>BEAUTY</span></LinkComponent><p>Skincare, colour, and sets for considered everyday routines.</p></div><div className="footerColumn"><h4>Shop</h4><LinkComponent to="/shop">All products</LinkComponent><LinkComponent to="/shop/skincare">Skincare</LinkComponent><LinkComponent to="/shop/makeup">Makeup</LinkComponent><LinkComponent to="/shop/sets">Sets</LinkComponent><LinkComponent to="/shop?collection=new">New arrivals</LinkComponent></div><div className="footerColumn"><h4>Customer care</h4><a href={`mailto:${contact}`}>Contact</a><LinkComponent to="/care/faq">FAQ</LinkComponent><LinkComponent to="/care/shipping">Shipping & returns</LinkComponent><LinkComponent to="/care/refund">Refund policy</LinkComponent><LinkComponent to="/care/track">Track order</LinkComponent></div><div className="footerColumn"><h4>About Veloura</h4><LinkComponent to="/about">Our story</LinkComponent><LinkComponent to="/rituals">Routine builder</LinkComponent><LinkComponent to="/shade-match">Shade match</LinkComponent><LinkComponent to="/care/accessibility">Accessibility</LinkComponent></div></div><div className="footerBottom"><span>© {new Date().getFullYear()} Veloura Beauty</span><div className="footerLegal"><LinkComponent to="/care/privacy">Privacy</LinkComponent><LinkComponent to="/care/terms">Terms</LinkComponent></div>{process.env.REACT_APP_CHECKOUT_URL&&<span className="checkoutProviderNote">Payment methods shown by the secure checkout provider</span>}</div></div></footer>;
}
