import Link from "next/link";

export default function Footer() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "care@velourabeauty.com";

  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div className="footerGrid">
          <div className="footerBrand">
            <Link className="wordmark" href="/">
              VELOURA<span>BEAUTY</span>
            </Link>
            <p>Skincare, colour, and sets for considered everyday routines.</p>
          </div>
          <div className="footerColumn">
            <h4>Shop</h4>
            <Link href="/shop">All products</Link>
            <Link href="/shop/skincare">Skincare</Link>
            <Link href="/shop/makeup">Makeup</Link>
            <Link href="/shop/sets">Sets</Link>
            <Link href="/shop?collection=new">New arrivals</Link>
          </div>
          <div className="footerColumn">
            <h4>Customer care</h4>
            <a href={`mailto:${contact}`}>Contact</a>
            <Link href="/care/faq">FAQ</Link>
            <Link href="/care/shipping">Shipping & returns</Link>
            <Link href="/care/refund">Refund policy</Link>
            <Link href="/care/track">Track order</Link>
          </div>
          <div className="footerColumn">
            <h4>About Veloura</h4>
            <Link href="/about">Our story</Link>
            <Link href="/rituals">Routine builder</Link>
            <Link href="/shade-match">Shade match</Link>
            <Link href="/care/accessibility">Accessibility</Link>
          </div>
        </div>
        <div className="footerBottom">
          <span>
            Veloura is a fictional brand: a portfolio project by Maya Chaker. No real orders or
            payments are processed.
          </span>
          <div className="footerLegal">
            <Link href="/care/privacy">Privacy</Link>
            <Link href="/care/terms">Terms</Link>
          </div>
          {process.env.NEXT_PUBLIC_CHECKOUT_URL && (
            <span className="checkoutProviderNote">
              Payment methods shown by the secure checkout provider
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
