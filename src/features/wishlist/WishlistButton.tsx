"use client";

import { FavoriteBorder, Favorite } from "@mui/icons-material";
import { useCommerce } from "../../hooks/useCommerce";
import type { ProductId } from "../../types/commerce";

interface WishlistButtonProps {
  productId: ProductId;
  /** Used in the accessible label, e.g. "Add Luminous Veil Serum to wishlist". */
  productName: string;
}

export default function WishlistButton({ productId, productName }: WishlistButtonProps) {
  const { wishlist, toggleWishlist } = useCommerce();
  const active = wishlist.includes(productId);
  return (
    <button
      className={`wishlistButton ${active ? "active" : ""}`}
      onClick={(event) => {
        event.preventDefault();
        toggleWishlist(productId);
      }}
      aria-label={`${active ? "Remove" : "Add"} ${productName} ${active ? "from" : "to"} wishlist`}
      aria-pressed={active}
    >
      {active ? <Favorite /> : <FavoriteBorder />}
    </button>
  );
}
