export function getAvatarDataUrl(value) {
  const initial = String(value || "")
    .trim()
    .charAt(0)
    .toUpperCase() || "?";
  const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 60 60"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f81f7"/><stop offset="1" stop-color="#7c5cff"/></linearGradient></defs><rect width="60" height="60" rx="30" fill="#111"/><circle cx="30" cy="30" r="30" fill="url(#g)" opacity="0.22"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Roboto, Arial, sans-serif" font-size="26" font-weight="900" fill="#e9e9e9">${initial}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(avatarSvg)}`;
}

