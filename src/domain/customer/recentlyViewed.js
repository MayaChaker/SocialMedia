export const addRecentlyViewedItem = (items, id) => [id, ...items.filter((item) => item !== id)].slice(0, 6);
