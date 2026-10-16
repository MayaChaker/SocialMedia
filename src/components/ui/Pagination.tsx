import Link from "next/link";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  pageCount: number;
  /** Builds the link for a page, keeping the other URL parameters. */
  hrefFor: (page: number) => string;
}

/** Page links for long listings. Renders nothing when everything fits on one page. */
export default function Pagination({ page, pageCount, hrefFor }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={styles.step} aria-label="Previous page">
          <ChevronLeft aria-hidden="true" />
        </Link>
      ) : (
        <span className={styles.step} aria-hidden="true">
          <ChevronLeft />
        </span>
      )}
      <ol>
        {pages.map((number) => (
          <li key={number}>
            <Link
              href={hrefFor(number)}
              className={styles.page}
              aria-current={number === page ? "page" : undefined}
              aria-label={`Page ${number}`}
            >
              {number}
            </Link>
          </li>
        ))}
      </ol>
      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} className={styles.step} aria-label="Next page">
          <ChevronRight aria-hidden="true" />
        </Link>
      ) : (
        <span className={styles.step} aria-hidden="true">
          <ChevronRight />
        </span>
      )}
    </nav>
  );
}
