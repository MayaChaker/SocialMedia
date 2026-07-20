# Veloura Beauty

Veloura Beauty is a premium, responsive beauty e-commerce experience built around a concise collection of skincare, makeup, sets, and guided rituals.

## Experience

- Editorial homepage and brand story
- Category-aware product collection
- Product detail pages with ingredients and ritual guidance
- Persistent shopping bag using the `velouraBeauty.cart.v1` browser-storage key
- Search, responsive navigation, and mobile-friendly shopping flows
- Wishlist, beauty profile, saved routine, and recently viewed products
- Interactive three-question Routine Builder with locally saved results
- Guided Shade Match with a saved profile shade
- Gift packaging, promotions, delivery estimates, and recommendations in the bag
- Three-step demo checkout with locally persisted order confirmations
- Original Veloura campaign artwork stored locally in `public/veloura-hero.png`

## Technology

- React 18
- React Router 6
- Material UI icons
- Framer Motion for restrained page, drawer, card, and hero motion
- Create React App

## Architecture

Product, cart, wishlist, routine, beauty-profile, checkout, and order concerns live in separate feature folders. Browser persistence is centralized in `src/repositories/storageRepository.js` and consumed through reusable hooks rather than accessed throughout the UI.

## Development

```bash
npm install
npm start
```

## Production build

```bash
npm run build
```

The optimized static site is written to `build/`.

## Routes

- `/` — editorial homepage
- `/shop`, `/shop/skincare`, `/shop/makeup`, `/shop/sets` — collection views
- `/product/:slug` — complete product experience
- `/rituals` — Routine Builder
- `/shade-match` — guided shade matching
- `/profile` and `/wishlist` — locally persisted customer tools
- `/checkout` — three-step demo checkout
