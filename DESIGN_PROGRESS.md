# Design progress

The redesign of Veloura as a multi-brand beauty store. Every page uses the one design
system in `src/styles/tokens.css`, `src/styles/system.css` and `src/components/ui`. A page
is marked done only after its file was changed and it was checked at 375, 768 and 1440px.

Status: ✅ done · 🟡 in progress · ⬜ not started

## Step 2: design system

| Part                                                                      | Status | Where                                                   |
| ------------------------------------------------------------------------- | ------ | ------------------------------------------------------- |
| Tokens: colour, type scale, space, container, radius, motion              | ✅     | `src/styles/tokens.css`                                 |
| Element defaults, `.text-*` type classes, `.container`                    | ✅     | `src/styles/system.css`                                 |
| Fonts: Cormorant Garamond + Inter (next/font)                             | ✅     | `src/app/layout.tsx`                                    |
| Button (primary, secondary, text)                                         | ✅     | `src/components/ui/Button.tsx`                          |
| Badge (New, Bestseller, Exclusive)                                        | ✅     | `src/components/ui/Badge.tsx`                           |
| Input, Select, Check                                                      | ✅     | `src/components/ui/Field.tsx`                           |
| Breadcrumb, Price, Accordion, Pagination, SectionHeader                   | ✅     | `src/components/ui/`                                    |
| Rating, Reviews (render nothing without real reviews)                     | ✅     | `src/components/ui/`, `src/data/reviews.ts`             |
| Drawer (bag, phone filters, mobile menu)                                  | ✅     | `src/components/ui/Drawer.tsx`                          |
| ProductGrid (2 / 3 / 4 columns), ProductCard, ProductShelf, ShadeSwatches | ✅     | `src/components/ui/`, `src/features/products/`          |
| BrandCard, brands data                                                    | ✅     | `src/components/ui/BrandCard.tsx`, `src/data/brands.ts` |
| FiltersSidebar                                                            | ✅     | `src/components/ui/FiltersSidebar.tsx`                  |
| Header: promo bar, search, icons, MegaMenu, mobile menu                   | ✅     | `src/components/layout/`, `src/data/navigation.ts`      |
| Footer: newsletter (demo), columns, legal                                 | ✅     | `src/components/layout/Footer.tsx`, `src/data/site.ts`  |
| Styleguide page (not indexed)                                             | ✅     | `/styleguide`                                           |

## Step 3: pages

| Page                       | Status | Notes                                       |
| -------------------------- | ------ | ------------------------------------------- |
| Home                       | ⬜     |                                             |
| Shop / category listing    | ⬜     | sidebar, sort, pagination                   |
| Product page               | ⬜     | gallery, accordions                         |
| Brands A–Z                 | ⬜     | new                                         |
| Brand page                 | ⬜     | new                                         |
| Search results             | ⬜     | new; header search goes to /shop until then |
| Bag drawer                 | ⬜     | still framer-motion                         |
| Bag page                   | ⬜     | new                                         |
| Checkout, confirmation     | ⬜     |                                             |
| Login / register (demo)    | ⬜     | new                                         |
| Account (profile)          | ⬜     |                                             |
| Wishlist                   | ⬜     |                                             |
| Routine builder (/rituals) | ⬜     | replace framer-motion with steps            |
| Shade match                | ⬜     | replace framer-motion with steps            |
| About                      | ⬜     |                                             |
| Policies (/care/…)         | ⬜     |                                             |
| 404                        | ⬜     |                                             |

## Clean-up when every page is done

- Delete the legacy token block in `tokens.css` and the legacy stylesheets in `src/styles`.
- Remove framer-motion and `src/theme/tokens.ts`.
- Final pass: every page uses the same components, colours, fonts and spacing.
