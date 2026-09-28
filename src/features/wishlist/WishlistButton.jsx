import { FavoriteBorder, Favorite } from "@mui/icons-material";
import { useCommerce } from "../../hooks/useCommerce";
export default function WishlistButton({ productId, productName }) {
  const { wishlist, toggleWishlist } = useCommerce(); const active = wishlist.includes(productId);
  return <button className={`wishlistButton ${active ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleWishlist(productId); }} aria-label={`${active ? "Remove" : "Add"} ${productName} ${active ? "from" : "to"} wishlist`} aria-pressed={active}>{active ? <Favorite/> : <FavoriteBorder/>}</button>;
}
