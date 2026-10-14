# Motion system

Motion in Veloura has one job: to make the store feel considered, in the way a well-lit counter does. It
never decorates, never delays a purchase, and always has a still alternative.

## Principles

1. **One orchestrated moment per page.** The homepage opening sequence is that moment; everything
   else is quieter.
2. **Motion explains a change.** A shade swap repaints the stage because the colour changed; a
   curtain opens because a photograph arrived. Nothing moves just because it entered the viewport.
3. **Only transform, opacity and clip-path.** No animated width, height, top or margin, so nothing
   triggers layout.
4. **Reduced motion is a first-class variant**, not an afterthought: the same content, at rest,
   with state changes applied instantly.
5. **Commerce controls never wait.** Buttons, swatches and links respond within one frame; their
   feedback (a label change, a count pulse) is the animated part.

## Tokens

Defined once in two places that mirror each other: `src/motion/tokens.ts` (GSAP, seconds) and
`src/styles/tokens.css` (CSS, milliseconds).

| Token       | Value  | Used for                                |
| ----------- | ------ | --------------------------------------- |
| `instant`   | 120 ms | Pressed states, counter ticks           |
| `quick`     | 240 ms | Hovers, swatch lift                     |
| `base`      | 480 ms | Shade changes, cross-fades, drawers     |
| `slow`      | 900 ms | Headline reveals, chapter image changes |
| `cinematic` | 1.3 s  | Hero curtains only                      |

| Easing     | Curve                            | Used for                                |
| ---------- | -------------------------------- | --------------------------------------- |
| `expo.out` | `cubic-bezier(0.16, 1, 0.3, 1)`  | Entrances: fast start, long soft finish |
| `curtain`  | `cubic-bezier(0.76, 0, 0.24, 1)` | Masks and wipes that open and close     |
| `standard` | `cubic-bezier(0.2, 0, 0, 1)`     | Small UI changes, colour transitions    |
| `none`     | linear                           | Anything scrubbed by scroll             |

Stagger: 90 ms between headline lines, 60 ms between list items, 18 ms between shade bars.
Parallax never moves an element more than 8% of its own height.

## Patterns

| Pattern                         | Where it lives                      | Use it for                                     | Do not use it for                                    |
| ------------------------------- | ----------------------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `revealLines`                   | `motion/timelines.ts`               | Display headlines with authored line breaks    | Body copy, labels, anything a user must read at once |
| `RevealHeading`                 | `motion/RevealHeading.tsx`          | Section titles that reveal once on scroll      | Headings inside dialogs, the bag or checkout         |
| `curtainReveal`                 | `motion/timelines.ts`               | One or two key photographs per view            | Product grids and thumbnails                         |
| `imageReady`                    | `motion/imageReady.ts`              | Holding a reveal until its image is decoded    | Images that are not revealed                         |
| `drawRibbon`                    | `motion/timelines.ts`               | Shade data shown as colour bars                | Decorative stripes without data                      |
| `fadeUp`                        | `motion/timelines.ts`               | Supporting copy and actions after a headline   | Primary content on its own                           |
| `parallax`                      | `motion/timelines.ts`               | Layered editorial images, at most two per view | Text, product cards, anything on phones in a list    |
| Scroll-staged chapter           | `views/home/FragranceRoomScene.tsx` | One story per page, wide screens only          | Shopping grids, filters, any page with a form        |
| Text roll (CSS `.textRoll`)     | `styles/motion.css`                 | A value that swaps in place (shade name)       | Prices (they must be readable mid-change)            |
| Count pulse (CSS `.countPulse`) | `styles/motion.css`                 | The bag count after an add                     | Anything that changes often                          |
| Button wipe (CSS `.pgButton`)   | `styles/home.css`                   | Primary actions                                | Text links (they redraw their underline instead)     |

## How it is wired

- `src/motion/gsap.ts` registers ScrollTrigger and `useGSAP` once, in the browser only. Components
  import GSAP from there, never from `gsap` directly.
- Every animated component uses `useGSAP` with a `scope`, so selectors stay inside the component and
  all tweens and ScrollTriggers are reverted on unmount.
- Variants are chosen with `gsap.matchMedia` and the queries in `MOTION_QUERIES`: `full` (motion
  allowed), `wide` (motion allowed and at least 1024 px, for scroll staging). Under reduced motion
  no tween is created at all.
- Markup is server-rendered. Animated sections wrap server-rendered children in a small client
  component (`HeroScene`, `FragranceRoomScene`) that only finds `data-*` hooks and animates them.
- **No flash before hydration.** A tiny inline script in the root layout sets
  `<html data-motion="on">` before first paint (unless reduced motion is requested), and CSS keeps
  `[data-reveal]` elements `visibility: hidden` until `MotionReady` marks the document hydrated.
  Components set their start states in layout effects, which run first. If scripts fail, the
  gate switches itself off after three seconds and shows everything.

## Performance safeguards

- Animated properties are compositor-friendly; `will-change` is only set on headline lines.
- Scroll staging uses CSS `position: sticky` and toggles one class per step; CSS transitions do the
  cross-fade, so scrolling never runs per-frame JavaScript beyond ScrollTrigger's update.
- `html` and `body` use `overflow-x: clip` (not `hidden`), so sticky positioning works.
- The hero's photographs load with `priority`; curtains wait for decode, capped at 2.5 s.
- GSAP and ScrollTrigger load only with the client components that animate; framer-motion is to be
  removed in the foundations phase so the store ships one animation library.
