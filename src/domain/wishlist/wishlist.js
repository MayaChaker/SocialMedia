export const toggleWishlistItem = (items, id) => items.includes(id)
  ? items.filter((item) => item !== id)
  : [...items, id];
