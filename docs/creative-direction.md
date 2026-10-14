# Creative direction: Pigment

Status: **prototype for review** (homepage only, on branch `prototype/editorial-home`).

## 1. Why the current design feels generic

Measured against the live site after PR #21:

- **The hero is the default split.** Copy on the left, a photo on the right, two buttons: the
  layout of most store themes. Nothing in it could only belong to Veloura.
- **Every section has the same shape.** Eyebrow, serif title, a link on the right, then a grid.
  Bestsellers, categories and the routine all repeat it, so the page has no rhythm.
- **Cards everywhere.** Categories, products and the look are all boxes with a label on top, at the
  same size and spacing.
- **Type does not lead.** The serif sits at a safe 52 px; nothing on the page is set with
  conviction, so the photography has to do all the work, and it is photography from many sources.
- **Motion is either absent or generic.** The only page transition was a fade on every navigation,
  rendered at `opacity: 0` on the server, which hid each page until JavaScript loaded. Hovers are a
  1.03 zoom.
- **Colour has no idea behind it.** Bordeaux, blush and ivory were inherited from the house-brand
  era and are no longer about anything.
- **The best data is hidden.** The catalogue holds real shade colours for 15 shades; the site shows
  them as 18 px dots.
- **Engineering smells.** The whole homepage was a client component; `body { overflow-x: hidden }`
  silently broke `position: sticky` site-wide.

## 2. The direction

**Pigment: colour is the content.** A multi-brand store cannot own a packaging style, but it can own
how it presents colour. Veloura's neutral world (powder, kohl) is deliberately quiet so that the
only saturated colour on a page is a product or a shade, taken from the catalogue data.

| Element      | Decision                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Palette      | Powder `#ECE8EA` ground, Kohl `#17131A` type and dark chapters, Graphite `#5C5560` secondary, one accent Rouge `#7D1A2C`. Shades come from data. |
| Display type | Instrument Serif, set very large and tight (up to 172 px, −3.5% tracking), roman for statements, italic for the turn of phrase.                  |
| Text type    | Hanken Grotesk, with wide-tracked capitals for labels.                                                                                           |
| Grid         | 12 columns with deliberate overlaps: type crosses into image columns, insets break frame edges.                                                  |
| Photography  | Tall frames, few per view, each with a job (portrait, product, chapter). Never a wall of thumbnails on the homepage.                             |
| Signature    | Shade data as colour: the hero ribbon, the shade studio that repaints its stage, swatches as tall chips.                                         |
| Motion       | One cinematic opening, scroll-staged chapters on wide screens, instant-feeling commerce feedback. See `motion.md`.                               |

## 3. Page by page

- **Home**: opening sequence (counts from the catalogue, portrait, product inset, shade ribbon); the
  fragrance room (a scroll-staged chapter); the shade studio (one product, every shade); then
  new-in, brands and the newsletter in the same language.
- **Shop and brand pages**: no hero; a large category title, a filter bar that stays put, product
  cards with a 4:5 mat, brand in capitals, name in serif, shade chips, quick add on hover and focus.
  Two columns on phones. No scroll effects inside the grid.
- **Product page**: the photo stage takes the shade colour of the selected variant (the studio
  pattern), a sticky purchase panel, details in a quiet list, recommendations by brand and concern.
- **Bag and checkout**: no decoration. Kohl on powder, clear steps, the count pulse as the only motion.
- **Account**: profile, wishlist and orders saved on this device, labelled as such.
- **Shade match and routine builder**: the studio language: one question per screen, the answer
  repaints the stage.

## 4. Roadmap

1. **Prototype review** (this branch): hero, one editorial chapter, one product interaction.
2. Foundations: tokens and type site-wide, logo and favicon, icon set replacing MUI icons,
   primitives (button, link, field, chip), removal of framer-motion in favour of GSAP and CSS.
3. Header, navigation and search.
4. Homepage, complete.
5. Shop, category and brand pages.
6. Product page and quick view.
7. Bag, checkout, account, shade match, routine builder, content pages, error and empty states.

Each step is one pull request with screenshots at 1440 px and 390 px, with and without reduced
motion, and passing checks.
