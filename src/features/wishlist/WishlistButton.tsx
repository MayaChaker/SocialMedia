"use client";

import { FavoriteBorder, Favorite } from "@mui/icons-material";
import { useCommerce } from "../../hooks/useCommerce";
import type { ProductId } from "../../types/commerce";
import styles from "./WishlistButton.module.css";

interface WishlistButtonProps {
  productId: ProductId;
  /** Used in the accessible label, e.g. "Add Luminous Veil Serum to wishlist". */
  productName: string;
  className?: string;
}

export default function WishlistButton({ productId, productName, className }: WishlistButtonProps) {
  const { wishlist, toggleWishlist } = useCommerce();
  const active = wishlist.includes(productId);
  return (
    <button
      type="button"
      className={[styles.wishlist, className].filter(Boolean).join(" ")}
      onClick={(event) => {
        event.preventDefault();
        toggleWishlist(productId);
      }}
      aria-label={`${active ? "Remove" : "Add"} ${productName} ${active ? "from" : "to"} wishlist`}
      aria-pressed={active}
    >
      {active ? <Favorite aria-hidden="true" /> : <FavoriteBorder aria-hidden="true" />}
    </button>
  );
}
