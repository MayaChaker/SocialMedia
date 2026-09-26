# Current Architecture

This document records the repository as it exists on the `refactor/production-v2` branch after Phase 0.1. It is a baseline, not a description of the intended architecture.

## Stack

- React 18.3.1 and React DOM 18.3.1.
- Create React App through `react-scripts` 5.0.1 for development, Jest integration, and production builds.
- React Router DOM 6.26.2 with a client-side `BrowserRouter`.
- JavaScript and JSX; there is no TypeScript configuration or typed domain model.
- React Context plus custom hooks for shared application state.
- Browser `localStorage` for persistence.
- Framer Motion 10.18.0 for route, drawer, modal, card, and guided-flow transitions.
- Material UI 6.5.0 and Material UI Icons 6.5.0. The application primarily uses MUI icons rather than MUI layout/form components.
- Emotion packages are installed as MUI peer dependencies.
- Testing Library packages are installed for component tests.
- Static product and merchandising modules provide the current catalogue.

The build is a client-rendered single-page application. `npm start`/`npm run dev` starts the CRA development server, `npm test` starts CRA's Jest runner, and `npm run build` creates the static `build/` output.

## Application Entry

### `src/index.js`

`src/index.js` is the browser entry point. It imports the global stylesheet and `App`, creates a React 18 root on `#root`, and renders the application inside `React.StrictMode`.

### `src/App.js`

`src/App.js` is the composition root. It:

- declares all page-level lazy imports;
- owns the transient `cartOpen` state;
- wraps the application in `StoreProvider` and then `BrowserRouter`;
- provides a single `Suspense` fallback for lazy route chunks;
- declares every route;
- mounts `CartDrawer` globally inside the router but outside the route tree.

### `StoreProvider`

`StoreProvider` is implemented in `src/hooks/useStore.js`. It creates the application-wide commerce/profile context, initializes its persistent state, canonicalizes persisted cart items against current product data, and exposes state plus mutation functions.

### `BrowserRouter`

`BrowserRouter` supplies client-side navigation and history. Routes depend on the hosting platform returning `public/index.html` for unknown application paths; there is no repository-level rewrite configuration.

### `Layout`

`src/components/Layout.jsx` is the shared shell for all routes except checkout. It renders the announcement region, sticky header, desktop/mobile navigation, global search, routed `<Outlet>`, route transition, and footer. It also scrolls to the top on navigation and updates the document title and description based on the current top-level path.

## Routing

All route declarations currently live in `src/App.js`.

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `HomePage` | Homepage with hero, trust points, bestsellers, category links, and a bundled routine action. |
| `/our-story` | `AboutPage` | Alias for the current brand/story page. |
| `/about` | `AboutPage` | Primary brand/story page. |
| `/shop` | `ShopPage` | Full product catalogue with search, filters, sorting, and collection query parameters. |
| `/shop/:category` | `ShopPage` | Category-filtered catalogue, currently used for skincare, makeup, and sets. |
| `/product/:slug` | `ProductPage` | Product detail, variant selection, cart/wishlist actions, related items, and recently viewed items. |
| `/wishlist` | `WishlistPage` | Products whose numeric IDs are saved in the wishlist state. |
| `/rituals` | `RitualsPage` | Guided routine builder and saved routine result. |
| `/shade-match` | `ShadeMatchPage` | Guided shade suggestion flow for Petal Skin Tint. |
| `/profile` | `BeautyProfilePage` | Browser-saved preferences, shade, and routine summary. |
| `/care/:policy` | `PolicyPage` | Parameterized customer-care content for FAQ, shipping, refund, tracking, privacy, terms, and accessibility. Unknown policy values silently fall back to shipping content. |
| `/checkout` | `CheckoutPage` | Standalone three-step demo/hosted-checkout handoff flow outside the shared `Layout`. |

There is no wildcard route, dedicated 404 page, route error element, or route-level error boundary. `/about` and `/our-story` intentionally or historically duplicate the same component.

## Feature Structure

### Products

`src/features/products/` contains the catalogue and product presentation:

- `ShopPage.jsx` reads static catalogue data, manages URL-derived category/search/collection state, owns local filters, and renders the filter dialog and product grid.
- `ProductPage.jsx` resolves a product by slug, selects variants, records recently viewed IDs, and renders recommendations.
- `ProductCard.jsx` combines product presentation, variant selection, quick preview, wishlist access, and add-to-cart behavior.
- `ProductVisual.jsx` selects static imagery and provides a CSS-rendered or textual fallback.
- `shopLogic.js` contains searchable-text, availability, filter, and sort logic separated from the page component.

### Cart

`src/features/cart/CartDrawer.jsx` renders the global cart dialog. It resolves persisted cart lines against catalogue data, updates quantities, removes lines, calculates subtotal and free-shipping progress, recommends one additional product, and implements a hardcoded `VELOURA10` demonstration promotion. It passes promotion state to checkout through React Router location state.

### Checkout

`src/features/checkout/CheckoutPage.jsx` implements contact, shipping, and review steps with local component state. It calculates discount, delivery, and total values in the browser, redirects an empty cart to `/shop`, calls `orderService`, saves a returned order in Context/local storage, and clears the cart after a non-redirect response.

### Routine

`src/features/routine/` contains a three-question routine builder. `RitualsPage.jsx` owns the guided flow and UI states; `routineRecommendations.js` maps answers to static product IDs, reasons, titles, and alternatives. Results can be added to cart or persisted to the browser profile area.

### Shade Match

`src/features/shade-match/` contains a three-step, image-free shade suggestion flow. `shadeMatchLogic.js` maps depth and undertone answers to static Petal Skin Tint variants. `ShadeMatchPage.jsx` presents the flow and can persist the suggested shade and answers into the profile state.

### Wishlist

`src/features/wishlist/` contains `WishlistButton.jsx` and `WishlistPage.jsx`. Wishlist persistence is an array of product IDs. The page resolves those IDs by importing the static catalogue directly.

### Beauty Profile

`src/features/beauty-profile/BeautyProfilePage.jsx` edits browser-saved skin type, concerns, and preferences. It also resolves saved shade and routine data against the static catalogue for display. It is not an authenticated customer account.

### Shared Components and Pages

`src/components/Layout.jsx` is the only component under the general shared-components folder. `ProductCard` and `ProductVisual` are feature-owned but reused by several pages/features. `src/pages/` contains the homepage, story page, and parameterized policy page. There is no current `components/ui` primitive layer.

## State Management

The application uses one React Context created by `StoreProvider`. `useStore()` reads that context and throws when called outside the provider. Each global state value uses `usePersistentState`; there is no reducer, action type system, server cache, or external state library.

The context currently exposes:

| State | Current shape/use |
| --- | --- |
| `cart` | Array of canonicalized cart lines with product/variant data and quantity. |
| `wishlist` | Array of numeric product IDs. |
| `orders` | Array of demo or checkout-endpoint responses stored on this browser. |
| `profile` | Skin goals, skin type, preferences, and optional saved shade details. |
| `routineResults` | Initially an array; current saves use `{ productIds, answers }`, with compatibility logic for older array data. |
| `theme` | Persisted string defaulting to `light`; exposed with `setTheme` but not consumed by the UI. |
| `recentlyViewed` | Up to six product IDs; written and read by `ProductPage`. |
| `searchHistory` | Up to eight search strings; global search writes it, but no current UI reads it. |

The provider also exposes `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `toggleWishlist`, `addRecentlyViewed`, and `addSearch`, plus selected setters. Cart operations depend directly on helpers from `src/data/products.js`, so state/domain/data-source boundaries are currently coupled.

The cart drawer's open/closed state is not in Context; it is transient state owned by `App`. Page filters, checkout fields/steps, quizzes, and feedback states are also local component state.

## Persistence

`src/hooks/usePersistentState.js` initializes state synchronously by calling `storageRepository.read`. An effect serializes every subsequent value through `storageRepository.write`. It does not synchronize changes across tabs.

`src/repositories/storageRepository.js` is a thin defensive wrapper around `window.localStorage`. Reads return the supplied fallback on missing/invalid data; reads, writes, and removals silently swallow storage or JSON errors. There is no schema validation, migration framework, expiry, encryption, or server synchronization.

All keys are prefixed with `velouraBeauty.`:

| State | Full localStorage key |
| --- | --- |
| Cart | `velouraBeauty.cart.v2` |
| Wishlist | `velouraBeauty.wishlist.v1` |
| Orders | `velouraBeauty.orders.v1` |
| Profile | `velouraBeauty.beautyProfile.v1` |
| Routine | `velouraBeauty.routineResults.v1` |
| Theme | `velouraBeauty.theme.v1` |
| Recently viewed | `velouraBeauty.recentlyViewed.v1` |
| Search history | `velouraBeauty.searchHistory.v1` |

Cart, wishlist, orders, profile, saved routine, theme, recently viewed products, and search history are all browser-only. Clearing site storage or using another browser/device loses them. The default checkout also records orders only on the current device.

## Data Layer

`src/data/products.js` is the catalogue source of truth. It contains 18 static product objects, variant definitions, image paths, prices, inventory values, merchandising flags, descriptive content, and helpers for money formatting and canonical product/cart resolution.

`src/data/merchandising.js` contains homepage IDs/categories, product-option metadata, an out-of-stock ID list, concerns, review copy, and social tiles. Only `BESTSELLER_IDS`, `HOME_CATEGORIES`, and `OUT_OF_STOCK_IDS` are currently imported outside the module.

Static product data is imported directly by `Layout`, `HomePage`, product pages/components and logic, cart, wishlist, beauty profile, routine recommendation logic, and shade-match logic. `useStore` also imports product resolution helpers directly. There is no product repository or query service insulating UI/domain code from the data source.

Current limitations include:

- catalogue, price, stock, copy, and variant data ship in the client bundle;
- no remote freshness, pagination, locale, currency, or inventory authority;
- direct imports make a future API/CMS replacement cross-cutting;
- cart and saved IDs are coupled to static catalogue identifiers;
- money formatting is fixed to a dollar string rather than locale-aware formatting;
- merchandising and domain data overlap and include confirmed unused exports.

## Services

`src/services/orderService.js` is the only service module. `orderService.create` has two behaviors:

1. When `REACT_APP_CHECKOUT_URL` exists, it posts cart, contact, shipping, and gift JSON to that endpoint. A JSON response may provide `redirectUrl` for hosted payment or may be treated as a returned order.
2. Without the environment variable, it constructs a timestamp-based `VB-` reference and returns a confirmed-looking object labeled `Demo payment`.

The default flow is explicitly a demo: it does not authorize or capture payment, verify prices/inventory on a server, calculate trusted tax/shipping, create a durable customer/order record, or send confirmation. Even with an endpoint configured, the current client defines only a loose response convention and has no typed or validated contract. Contact and shipping data are stored in local storage when a returned order is added to `orders`.

## Forms and Checkout Flow

Current user inputs include global search, shop filters/sorts, promo code, checkout details, beauty profile controls, routine choices, and shade-match choices.

The global search and promo code use form submission. Checkout uses controlled inputs and buttons rather than a semantic form submission flow. Required checkout fields are checked through simple truthiness; email format, phone/address rules, field-level errors, touched state, and server validation mapping are not implemented. Profile and guided tools use controlled selects/buttons and local feedback messages.

Checkout flow:

1. The cart drawer optionally applies the hardcoded `VELOURA10` 10% demo discount.
2. It navigates to `/checkout`, passing discount/promo information in router state.
3. Checkout collects contact details, then shipping details, then shows a review.
4. Totals and free-shipping eligibility are calculated in the browser.
5. `orderService.create` either starts configured hosted checkout behavior or returns a local demo order.
6. A local order is prepended to persisted orders and the cart is cleared.

Refresh/navigation can lose router-state discount details, and client-provided totals must not be trusted by a production backend.

## Styling

Nearly all styling is in `src/index.css`. At audit time it is 139,865 bytes (about 136.6 KiB) and 666 physical lines. Many rules are densely packed onto single lines, so physical line count understates its size and complexity.

The strategy is global class-based CSS with:

- root custom properties for core colors and font stacks;
- a later second `:root` block for page sizing/gutters;
- global element resets and shared utility-like classes such as `.button`, `.textLink`, `.kicker`, and `.srOnly`;
- page- and feature-specific selectors in the same file;
- 62 `@media` occurrences with several repeated breakpoints;
- multiple generations of story/home/shop styling retained together;
- CSS-rendered product-object fallbacks that use gradients, even though primary product imagery is static media.

Risks include global selector collisions, unclear ownership, difficult dead-code removal, repeated breakpoints, source-order overrides, high review cost, and accidental regressions when changing shared class names. No CSS refactor is part of this phase.

## Motion

Framer Motion is used for:

- route fades in `Layout`;
- search entrance/exit;
- cart overlay/drawer;
- product-card hover and quick-preview dialogs;
- homepage hero entrance;
- shade-match samples and question transitions;
- routine question transitions.

`src/theme/tokens.js` contains only two shared motion definitions: `MOTION.page` and `MOTION.drawer`. Many other durations and transforms are inline in components, so the motion system is only partially centralized.

Global CSS includes `prefers-reduced-motion: reduce` rules that shorten/disable animation and smooth scrolling. `RitualsPage` additionally uses Framer Motion's `useReducedMotion`, but other Framer Motion components generally still schedule their animations and rely on CSS overrides. Reduced-motion behavior is therefore present but inconsistent.

## Accessibility

Accessibility work already present includes:

- a keyboard-focusable skip link to `#mainContent`;
- descriptive `aria-label` values on icon-only navigation, cart, wishlist, filter, and close controls;
- `aria-expanded`, `aria-controls`, and pressed/selected states where relevant;
- focus trapping, Escape handling, body scroll locking, and trigger-focus restoration for the mobile navigation, shop filter dialog, cart drawer, and product quick preview;
- `role="dialog"` and `aria-modal="true"` on cart, filters, and quick preview;
- `aria-live`/status/alert messaging for loading, product counts, add-to-cart feedback, quiz choices, saved state, promo feedback, and checkout errors;
- radio-group semantics and custom arrow-key navigation in the routine builder;
- a progressbar for shade matching and labelled progress for the routine builder;
- fieldsets/legends for several grouped controls;
- product image alternative text and decorative `aria-hidden` usage;
- global reduced-motion CSS and component-aware reduced motion in the routine flow.

Current inconsistencies to review later:

- reduced-motion awareness is not applied consistently to all Framer Motion components;
- the shade-match custom radio group does not implement the routine builder's roving-tabindex/arrow-key pattern;
- global search opens as an animated region with autofocus but does not use the same Escape/focus-restoration treatment as dialogs;
- checkout validation provides disabled progression but no field-specific error association or validation summary;
- focus and announcement behavior is implemented independently in several components rather than through shared primitives;
- policy fallback and missing-route behavior can present valid-looking content for invalid URLs.

## SEO / Metadata

`public/index.html` defines the default title, description, theme color, Open Graph title/description/image/type/site name, and Twitter card/title/description. The Open Graph image is `/veloura-hero.png`.

`Layout` updates `document.title` for recognized top-level sections and changes the standard meta description only for the shop versus other routes. `/our-story` receives a second title effect. Product slugs, categories, policies, and query states do not receive specific descriptions or social metadata.

As a client-rendered SPA, every route initially serves the same HTML metadata. There are no server-rendered route tags, canonical URLs, per-product Open Graph data, structured product data, sitemap/robots configuration in the repository, or framework-native metadata/error handling. Crawlers and link unfurlers that do not execute the client receive only the default metadata.

## Assets

Assets are served directly from `public/` and referenced by root-relative strings. Organization is:

- `public/products/catalog/`: product and variant WebP files;
- `public/products/`: reusable product imagery and fallback imagery;
- `public/lifestyle/`: campaign/editorial WebP and PNG imagery;
- root `public/`: hero PNG/WebP files plus `index.html`.

Notable audit findings:

- `public/lifestyle/veloura-hero-campaign-burgundy.png` is about 2.4 MB and is the homepage hero.
- `public/veloura-hero.png` is about 1.5 MB and is used for Open Graph metadata and the favicon.
- `public/veloura-hero.png` and `public/veloura-hero.webp` share a basename and appear to be alternate-format hero assets; they are not byte-identical and have different current references.
- No byte-identical image duplicates were found by SHA-256 hashing.
- `public/lifestyle/veloura-evening-edit-v2.webp` and `public/products/veloura-serum-bestseller-v2.webp` use version-style production filenames.
- Product variants generally have individual catalogue images. Several general product files also remain as display/fallback or merchandising images.
- Images are served without a responsive image pipeline, generated size variants, CDN transformation, or framework image optimization.

Asset renaming, compression, and reference cleanup are intentionally deferred.

## Testing

The project uses CRA's Jest configuration with Testing Library for the component test. Current test files:

| Test file | Coverage |
| --- | --- |
| `src/data/products.test.js` | Unique product IDs/slugs, canonical images, variant cart identities, and rehydration of persisted cart lines from current product data. |
| `src/features/products/ProductCard.test.jsx` | Variant selection/image/cart persistence and wishlist interaction through `StoreProvider`. |
| `src/features/products/shopLogic.test.js` | Searchable shade/benefit text, combined filtering, and price sorting. |
| `src/features/routine/routineRecommendations.test.js` | Routine length by pace, variation by answers, and valid catalogue references. |
| `src/features/shade-match/shadeMatchLogic.test.js` | Variant/profile integrity, answer differentiation, and the medium-neutral result URL. |

There are 14 declared test cases. There are no current tests for routing, layout/navigation, cart quantity/promo behavior, checkout/order service, storage failure behavior, profile persistence, full guided-flow accessibility, or 404/error states. Phase 0.2 execution results are recorded in the task report rather than asserted in this architecture description.

## Environment Variables

`.env.example` declares public configuration names only; no secret values are documented here.

| Variable | Purpose |
| --- | --- |
| `PORT` | Development server port; example value is `4173`. It is a local tooling setting rather than browser application data. |
| `REACT_APP_CHECKOUT_URL` | Optional server endpoint that starts hosted checkout or returns a confirmed order object. Because CRA embeds `REACT_APP_*` values in the client bundle, this must be a public endpoint/config value, never a secret. |
| `REACT_APP_CONTACT_EMAIL` | Public customer-care address used by the footer and policy pages, with an in-code fallback. |
| `REACT_APP_NEWSLETTER_URL` | Intended optional JSON subscription endpoint. It is not referenced by current source code. |

## Known Technical Debt

### Critical

- No critical defect was confirmed during this documentation audit. The project is a demo and should not be represented as a production commerce system without completing the high-priority items below.

### High

- Create React App/react-scripts is unmaintained and already emits a Babel dependency warning.
- The default checkout is a browser-only demo. Client-calculated prices, discounts, shipping, and order data are not authoritative or durable.
- Cart, wishlist, profile, routine, search history, recently viewed items, and demo orders exist only in local storage, with no schema validation or cross-device/server ownership.
- There is no route-level error boundary or catch-all 404 experience.

### Medium

- The codebase is JavaScript/JSX without explicit product, variant, cart, order, profile, or service-contract types.
- UI, state, and feature logic import static catalogue modules directly; product repository/service boundaries do not exist.
- `src/index.css` is a large global stylesheet with historical selectors, repeated breakpoints, and source-order coupling.
- The order-service endpoint contract and responses are untyped and unvalidated.
- Checkout and profile validation are minimal and largely based on required/truthy values.
- Route metadata is mostly generic and client-mutated; SPA rendering limits SEO and social previews.
- Large unoptimized PNGs and the absence of responsive image generation increase transfer and rendering cost.
- Accessibility implementations are useful but duplicated and inconsistent, particularly for reduced motion, custom radio keyboard behavior, and validation feedback.
- Test coverage emphasizes product/recommendation logic and one component but does not cover critical cart, checkout, persistence, routing, or error paths.
- `storageRepository` silently swallows all failures, preventing the UI or telemetry from distinguishing unavailable/corrupt persistence.

### Low

- Theme state is persisted and exposed but unused.
- Search history is persisted but never displayed or otherwise read.
- `/about` and `/our-story` duplicate the same page component and metadata handling.
- Confirmed unused exports and legacy CSS increase maintenance noise.
- Version-style asset names (`v2`) make long-term asset ownership less clear.
- `REACT_APP_NEWSLETTER_URL` is documented but unused.
- Policy URLs with unknown values fall back to shipping content instead of reporting a missing page.

## Cleanup Candidates

These items are candidates only. Nothing in this table was removed in Phase 0.2.

| File | Symbol or area | Why it appears unused/dead | Confidence | Recommended later action |
| --- | --- | --- | --- | --- |
| `src/hooks/useStore.js` | `theme`, `setTheme` | Persisted and exposed by Context, but no component reads or changes them. | High | Remove the state/key if dark-theme work is not planned; otherwise implement it only in its approved phase. |
| `src/repositories/storageRepository.js` | `STORAGE_KEYS.theme` / `theme.v1` | Exists solely for the unused theme state. | High | Remove with the theme state after checking whether stored-value migration matters. |
| `src/hooks/useStore.js` | `searchHistory` value | `addSearch` writes terms, but no current component reads `searchHistory`. | High | Either remove persistence or introduce its use only as part of an explicitly scoped search task. |
| `src/repositories/storageRepository.js` | `STORAGE_KEYS.search` / `searchHistory.v1` | Supports the write-only search-history state. | High | Remove together with search-history state if the feature is not retained. |
| `src/hooks/useStore.js`, `src/features/products/ProductPage.jsx` | `recentlyViewed` | This state is active: product pages write IDs and render a recent-product shelf. It is not dead. | High | Retain; later move behind a clearer recently-viewed domain/persistence boundary. |
| `src/App.js` | `/about` and `/our-story` | Both routes render `AboutPage`; navigation primarily uses `/about`, while title code has a special `/our-story` effect. | High | Choose a canonical URL and use a deliberate redirect/alias strategy during routing work. |
| `src/data/merchandising.js` | `PRODUCT_OPTIONS` | Exported but has no import outside its declaration. Current variants live in product data. | High | Remove after confirming no planned consumer; avoid maintaining two option sources. |
| `src/data/merchandising.js` | `CONCERNS`, `CUSTOMER_REVIEWS`, `SOCIAL_TILES` | Exported but not imported by current source. They appear to belong to earlier homepage sections. | High | Remove in a scoped dead-data cleanup after verifying visual requirements. |
| `src/data/products.js` | `productById` | Exported but no current source/test imports it. | High | Remove or adopt only if a repository API needs it later. |
| `src/index.css` | `.aboutEditorial*`, `.aboutCompact*`, `.storyV2*` families | No current JSX uses these historical story-page class families; current `AboutPage` uses `.storyFinal*`, `.storyEdit*`, `.storyCriteria*`, and `.storyShelf*`. | High | Delete only after selector-by-selector visual verification in a dedicated CSS cleanup. |
| `src/index.css` | `.cursorSpotlight`, `.valuesStrip`, `.heroNote`, `.ritualBanner`, `.newsletter`, `.formulaSection`, `.reviewGrid`, `.socialGrid` families | Searches found stylesheet definitions but no current JSX class usage for these named areas. Some are remnants of earlier homepage iterations. | High | Validate dynamic usage and remove in a scoped stylesheet cleanup with visual regression checks. |
| `.env.example` | `REACT_APP_NEWSLETTER_URL` | Declared but never referenced by current source. | High | Remove until a real subscription feature exists, or document/implement it only in an approved feature task. |
| `public/veloura-hero.png` and `public/veloura-hero.webp` | Hero format pair | Same basename and likely related creative, but both have distinct current references through metadata/legacy merchandising data. | Medium | Confirm intended canonical asset and metadata requirements before consolidating. |
| `public/lifestyle/veloura-evening-edit-v2.webp`, `public/products/veloura-serum-bestseller-v2.webp` | Versioned asset names | The files are actively referenced, but `v2` naming is unsuitable as a durable production convention. | High | Rename and update references in a dedicated asset task, not during architecture work. |

