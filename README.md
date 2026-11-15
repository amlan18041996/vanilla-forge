# Vanilla Forge

A curated collection of **15 vanilla JavaScript and TypeScript projects** — interactive demos, reusable libraries, and a polished single-page showcase. No UI frameworks, no component libraries: just semantic HTML, modern CSS, JavaScript, and TypeScript.

Every project ships with a live, runnable demo you can open directly from the site.

## What's inside

| Category | Projects | Focus |
|----------|----------|-------|
| **JavaScript** | 8 | Browser APIs, DOM, games, networking, state |
| **Libraries** | 3 | Reusable UI utilities built from scratch |
| **TypeScript** | 4 | Type-system driven libraries and typed API clients |
| **Total** | **15** | **48 unique concepts** |

## Features

- **Single Page Application** — History API routing (`/`, `/about`, `/projects`, `/projects/{project-id}`) with no router dependency
- **Project explorer** — all projects grouped by category on `/projects`, with a one-row filter group (All / JavaScript / TypeScript / Libraries) and live count badges
- **Focused project pages** — `/projects/{project-id}` opens a single detail card with a project hero, **Overview** and **Live Demo** tabs, key-concept chips, and usage instructions
- **Related projects** — every project page ends with "Try other popular projects from …" showing up to four peers from the same category
- **Interactive demos** — each project has a real, self-contained demo (no mock screenshots)
- **Search** — project quick-search in the header jumps straight to a project page
- **Responsive design** — adapts from wide desktop layouts down to a single column on mobile
- **Accessible** — keyboard navigation, ARIA tabs, visible focus states, sequential headings, and WCAG AA contrast for text
- **Centralized icons** — one SVG sprite (`icons/sprite.svg`) plus a tiny `icon()` helper; no icon dependency
- **Light, calm theme** — a soft slate/indigo palette with subtle transitions

## Routes

| Route | View |
|-------|------|
| `/` | Home — intro, stats, services, features |
| `/about` | Concepts guide for JavaScript & TypeScript |
| `/projects` | Filterable overview of all 15 projects |
| `/projects/{project-id}` | Project detail, live demo, and related projects |

## Projects

### JavaScript

| Project | Route | Concepts |
|---------|-------|----------|
| **Calculator** | `/projects/calculator` | DOM Manipulation, Event Handling, Array Methods, CSS Grid, Keyboard Events |
| **QR Code Generator** | `/projects/qr-code-generator` | Form Handling, Async/Await, Canvas, ES Modules |
| **Stopwatch** | `/projects/stopwatch` | Timers, requestAnimationFrame, State Management, Event Handling |
| **Countdown Timer** | `/projects/timer` | Timers, Form Handling, DOM Manipulation, SVG Animation, Web Audio API |
| **Guess the Word** | `/projects/guess-word` | Game Logic, DOM Manipulation, Fetch API, Dynamic Hints, Toast Integration |
| **Rock Paper Scissors** | `/projects/rock-paper-scissors` | Game Logic, Randomization, DOM Manipulation, Event Handling, Timers, Toast Integration |
| **HTTP Client with Interceptors** | `/projects/http-client` | Fetch API, Interceptors, Retry Logic, AbortController, Error Handling |
| **Reactive State Manager** | `/projects/state-manager` | Proxy, Reflect, State Management, Middleware, Observer Pattern, Derived State |

### Libraries

| Project | Route | Concepts |
|---------|-------|----------|
| **Image Carousel** | `/projects/carousel` | DOM Manipulation, Event Handling, Timers, Debounce, Infinite Scroll |
| **Toast Notification** | `/projects/toast` | DOM Manipulation, CSS Animations, Event Handling, requestAnimationFrame, Promises |
| **Two-Way Data Binding** | `/projects/two-way-data-bind` | Proxies, Data Binding, Custom Events, Observer Pattern |

### TypeScript

| Project | Route | Concepts |
|---------|-------|----------|
| **Weather Dashboard** | `/projects/weather` | TypeScript Interfaces, Runtime Validation, Async/Await, Fetch API, AbortController |
| **JSON Schema Validator** | `/projects/json-schema-validator` | Conditional Types, Recursive Types, Branded Types, Runtime Validation, Discriminated Unions |
| **Form Validator** | `/projects/form-validator` | Discriminated Unions, Runtime Validation, Declarative API, Error Handling, Form Processing |
| **Type-Safe ORM (Mini-Prisma)** | `/projects/mini-prisma` | Conditional Return Types, Fluent Interfaces with `this` Typing, Generic Constraints, Template Literal Types, Type-safe SQL |

## Project highlights

### QR Code Generator (`qr-code-generator.js`)
Turns text or links into a QR code entirely in the browser using the `qrcode` package, with a live preview and PNG download.

### HTTP Client (`http-client.js`)
A fetch-based HTTP client featuring:
- **Request/response interceptors** — chainable middleware for modifying requests and responses
- **Automatic retry** — exponential backoff with random jitter for transient failures
- **Cancellation** — built-in AbortController support
- **Timeout** — configurable request timeout

### Reactive State Manager (`state-manager.js`)
A mini state management library inspired by Zustand/Redux:
- **Deep reactive proxy** — nested mutations intercepted with ES6 Proxy and Reflect
- **Subscriptions** — subscribe/unsubscribe to state changes
- **Derived selectors** — auto-recomputing values that only update when dependencies change
- **Middleware chain** — Redux-style middleware for logging, analytics, or side effects

### JSON Schema Validator (`typescript-projects/src`)
A runtime validator driven by TypeScript's type system:
- **Conditional types** — `InferSchemaType` derives the validated shape from a schema
- **Recursive types** — supports nested object and array schemas
- **Branded types** — `Validated<T>` provides nominal typing for validated data

### Form Validator (`typescript-projects/src/form-validator`)
A declarative form-validation library built on discriminated unions. Fields (text, email, password, number, select, checkbox) carry their own rules and produce human-readable error messages.

### Type-Safe ORM / Mini-Prisma (`typescript-projects/src/mini-prisma`)
A tiny SQLite query builder with fluent `this` typing, conditional return types based on selected fields, and template-literal types for SQL. Uses `sql.js` in the browser demo.

### Weather Dashboard (`typescript-projects/src/weather`)
Typed Open-Meteo geocoding and forecast clients with runtime validation, abortable requests, and a five-day forecast — no API key required.

## Getting Started

### Prerequisites

- Node.js 20.19+ (or 22.12+)
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### TypeScript package

The TypeScript sources in `typescript-projects/` are consumed directly by Vite. To compile declarations and run the examples independently:

```bash
cd typescript-projects
npm install
npm run build   # tsc → dist/
npm run dev     # run src/examples.ts
```

## Project Structure

```
vanilla-forge/
├── index.html                     # SPA shell with all page sections
├── index.js                       # Routing, project views, search, demo orchestration
├── styles/
│   ├── main.css                   # Layout, components, responsive rules
│   └── tailwind.css               # Pre-compiled Tailwind utilities
├── icons/                         # Central icon system
│   ├── sprite.svg                 # Single source of truth (SVG <symbol> sprite)
│   ├── index.js                   # Sprite mount + icon() markup helper
│   └── README.md                  # Icon conventions and inventory
├── javascript-projects/
│   ├── projects-data.js           # Project metadata, concepts, colors, icons
│   ├── project-demos.js           # Demo HTML templates and initializers
│   ├── calculator.js
│   ├── carousel.js
│   ├── guess-word.js
│   ├── http-client.js
│   ├── mini-prisma-demo.js
│   ├── qr-code-generator.js
│   ├── rock-paper-scissors.js
│   ├── state-manager.js
│   ├── stopwatch.js
│   ├── timer.js
│   ├── toast.js
│   └── two-way-data-bind.js
├── typescript-projects/
│   ├── projects-data.js           # TypeScript project metadata
│   └── src/
│       ├── weather/               # Typed Open-Meteo client
│       ├── form-validator/        # Declarative form validation
│       ├── mini-prisma/           # Type-safe SQL query builder
│       ├── index.ts               # JSON schema validator entry
│       ├── types.ts
│       └── validators.ts
├── utilities/
│   ├── dom-builder.js             # Programmatic DOM element creation
│   ├── helpers.js                 # Debounce, scroll-to-top, template decorator
│   ├── images/                    # Static images
│   └── mock-data/                 # JSON data for carousel, accordion, calculator
├── public/
│   ├── favicon.svg
│   └── sql-wasm.wasm              # SQLite WASM used by the Mini-Prisma demo
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Tech Stack

- **Vanilla JavaScript (ES6+)** — classes, modules, Proxies, async/await, Fetch API, custom events
- **TypeScript 5** — conditional, recursive, branded, and template-literal types
- **HTML5** — semantic, accessible markup
- **CSS3** — Flexbox, Grid, custom properties, `color-mix()`, transitions, backdrop-filter
- **Tailwind CSS** — utility layer (pre-compiled to `styles/tailwind.css`)
- **Vite 8** — dev server, module bundling, and production build
- **Runtime dependencies** — `qrcode` (QR generation) and `sql.js` (in-browser SQLite)

## Adding a Project

1. Add an entry (with `id`, `category`, `title`, `description`, `concepts`, `color`, `icon`, `file`) to `javascript-projects/projects-data.js` or `typescript-projects/projects-data.js`.
2. Implement the demo module and register it in `javascript-projects/project-demos.js` under the same `id`.
3. Add any new icon to `icons/sprite.svg` and document it in `icons/README.md`.

The overview, filters, counts, detail route, and related-projects row update automatically from the metadata.

## License

ISC
