import { Star, StarBorder, StarHalf } from "@mui/icons-material";
import type { Review } from "../../types/commerce";
import styles from "./Rating.module.css";

/** Average of real reviews, to one decimal. */
export const averageRating = (reviews: Review[]) =>
  Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;

function Stars({ value }: { value: number }) {
  return (
    <span className={styles.stars} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((step) =>
        value >= step ? (
          <Star key={step} />
        ) : value >= step - 0.5 ? (
          <StarHalf key={step} />
        ) : (
          <StarBorder key={step} />
        ),
      )}
    </span>
  );
}

/** Star average and review count. Renders nothing when there are no real reviews. */
export default function Rating({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;
  const average = averageRating(reviews);
  return (
    <span className={styles.rating}>
      <Stars value={average} />
      <span className="srOnly">
        {average} out of 5 stars from {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
      </span>
      <span aria-hidden="true" className={styles.count}>
        {average} ({reviews.length})
      </span>
    </span>
  );
}

export { Stars };
