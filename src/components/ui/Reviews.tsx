import type { Review } from "../../types/commerce";
import Rating, { Stars } from "./Rating";
import styles from "./Reviews.module.css";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(iso),
  );

/** The reviews section of a product page. Renders nothing when there are no real reviews. */
export default function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;
  return (
    <section className={styles.reviews} aria-labelledby="reviews-title">
      <header className={styles.head}>
        <h2 id="reviews-title" className="text-h3">
          Reviews
        </h2>
        <Rating reviews={reviews} />
      </header>
      <ul className={styles.list}>
        {reviews.map((review) => (
          <li key={review.id} className={styles.item}>
            <Stars value={review.rating} />
            <span className="srOnly">{review.rating} out of 5 stars</span>
            <h3 className="text-h5">{review.title}</h3>
            <p>{review.body}</p>
            <p className="text-caption text-muted">
              {review.author} · {formatDate(review.date)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
