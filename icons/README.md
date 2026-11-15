# Icons

All UI icons in Vanilla Forge live in this folder. There is one source of
truth: [`sprite.svg`](./sprite.svg), an SVG sprite made of `<symbol>` elements.

## Why a sprite?

This is the standard approach for an app without a UI framework:

- **One request / one source of truth** — every icon is defined once.
- **`currentColor` support** — icons inherit text colour and theme variables.
- **Tiny markup** — usages are a single `<svg><use …></svg>`.
- **Accessible** — decorative vs. meaningful icons are explicit.
- **No dependency** — the sprite is inlined by `mountIconSprite()` at boot, so
  there is no extra HTTP request and no build plugin to maintain.

## Usage

Boot the sprite once, as early as possible:

```js
import { mountIconSprite } from './icons/index.js';

mountIconSprite();
```

### In JavaScript templates

```js
import { icon } from './icons/index.js';

// Decorative icon (hidden from screen readers)
icon('search', { className: 'search-icon' });

// Meaningful icon (announced by screen readers)
icon('check', { label: 'Valid' });
```

### In HTML

```html
<svg class="search-icon" aria-hidden="true"><use href="#icon-search"></use></svg>
```

### Sizing and colour

The `.icon` class defaults to `1em` so an icon follows the surrounding
font-size. Override width/height in CSS or pass `size` to `icon()`:

```js
icon('package', { size: 20 });
```

Colour is controlled with normal CSS, because icon artwork uses
`currentColor`:

```css
.stat-icon { color: #6366f1; }
```

## Adding an icon

1. Add a `<symbol id="icon-<name>" viewBox="0 0 24 24">` to `sprite.svg`.
2. Use `fill="none" stroke="currentColor"` for outline icons, or
   `fill="currentColor"` for filled/brand icons.
3. Reference it with `icon('<name>')` or `<use href="#icon-<name>">`.
4. Prefer an existing set instead of drawing one-off icons:
   [Lucide](https://lucide.dev/) (ISC) for UI icons,
   [Simple Icons](https://simpleicons.org/) (CC0) for brand marks.

## Current inventory

| Name | Used for | Source |
| --- | --- | --- |
| `logo` | Header brand mark | In-house |
| `search` | Search input, mobile search | Lucide |
| `menu` | Mobile project menu toggle | Lucide |
| `close` | Close search, toast dismiss | Lucide |
| `check` | Feature bullets, form success | Lucide |
| `chevron-up` | Back-to-top button | Lucide |
| `arrow-left` | Back to categories | Lucide |
| `mouse-pointer-click` | Interactive demos service card | Lucide |
| `code` | TypeScript concepts service card | Lucide |
| `database` | Reusable libraries service card | Lucide |
| `library` | Libraries category card | Lucide |
| `archive` | Empty project placeholder | Lucide |
| `package` | Projects delivered stat | Lucide |
| `book-open` | Concepts covered stat | Lucide |
| `settings` | Concepts in progress stat | Lucide |
| `rocket` | Upcoming concepts stat | Lucide |
| `mail` | Footer Gmail link | Lucide |
| `linkedin` | Footer LinkedIn link | Simple Icons |
| `javascript` | JavaScript category / subject | Simple Icons |
| `typescript` | TypeScript category / subject | Simple Icons |
| `calculator` | Calculator project card | Lucide |
| `qr-code` | QR Code Generator project card | Lucide |
| `gallery-horizontal` | Image Carousel project card | Lucide |
| `bell` | Toast Notifications project card | Lucide |
| `arrow-left-right` | Two-Way Data Binding project card | Lucide |
| `timer` | Stopwatch project card | Lucide |
| `alarm-clock` | Countdown Timer project card | Lucide |
| `spell-check` | Word Guessing Game project card | Lucide |
| `hand` | Rock Paper Scissors project card | Lucide |
| `network` | HTTP Client project card | Lucide |
| `workflow` | State Manager project card | Lucide |
| `cloud-sun` | Weather Dashboard project card | Lucide |
| `braces` | JSON Schema Validator project card | Lucide |
| `clipboard-check` | Form Validator project card | Lucide |

## Not icon-sheet content

Some glyphs in the app are **content**, not UI chrome, and intentionally stay
with their data:

- Weather condition glyphs (`typescript-projects/src/weather/index.ts`) come
  from the weather API.
- Rock/paper/scissors hand glyphs are game content.
- `✓` / `✅` / `❌` inside console or `<pre>` output are text, not icons.

Keeping those out of the sprite prevents a UI icon set from turning into a
grab-bag of domain content.
