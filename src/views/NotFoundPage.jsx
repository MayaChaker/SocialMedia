import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="emptyState notFoundPage">
      <span className="kicker">404</span>
      <h1>We couldn’t find that page.</h1>
      <p>The link may be out of date, or the page may have moved.</p>
      <Link className="button dark" href="/shop">
        Shop the collection
      </Link>
    </main>
  );
}
