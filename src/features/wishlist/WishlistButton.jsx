import { FavoriteBorder, Favorite } from "@mui/icons-material";
import { useStore } from "../../hooks/useStore";
export default function WishlistButton({ productId, productName }) {
  const { wishlist, toggleWishlist } = useStore(); const active = wishlist.includes(productId);
  return <button className={`wishlistButton ${active ? "active" : ""}`} onClick={(event) => { event.preventDefault(); toggleWishlist(productId); }} aria-label={`${active ? "Remove" : "Add"} ${productName} ${active ? "from" : "to"} wishlist`} aria-pressed={active}>{active ? <Favorite/> : <FavoriteBorder/>}</button>;
}
