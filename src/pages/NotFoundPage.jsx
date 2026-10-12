import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="emptyState notFoundPage">
      <span className="kicker">404</span>
      <h1>We couldn’t find that page.</h1>
      <p>The link may be out of date, or the page may have moved.</p>
      <Link className="button dark" to="/shop">
        Shop the collection
      </Link>
    </main>
  );
}
