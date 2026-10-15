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
            <p>Makeup, skincare, fragrance and hair from the brands you love, in one bag.</p>
          </div>
          <div className="footerColumn">
            <h4>Shop</h4>
            <Link href="/shop">All products</Link>
            <Link href="/shop/makeup">Makeup</Link>
            <Link href="/shop/skincare">Skincare</Link>
            <Link href="/shop/fragrance">Fragrance</Link>
            <Link href="/shop/hair">Hair</Link>
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
        <p className="footerMark" aria-hidden="true">
          VELOURA
        </p>
        <div className="footerBottom">
          <span>
            Veloura is a fictional store: a portfolio project by Maya Chaker. It is not affiliated
            with the brands shown, and no real orders or payments are processed. Photography from
            Unsplash.
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
