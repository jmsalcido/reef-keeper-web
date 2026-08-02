# Reef Keeper — Aquarium Tracker (marketing site)

Marketing site for **Reef Keeper: Aquarium Tracker** (iOS). Landing page, blog
index, and SEO articles. Built with **React + Vite + TanStack Router** in
TypeScript, styled with the Aqua Track design system tokens.

## Stack

- **Vite 8** — dev server + build
- **React 19**
- **TanStack Router 1** — type-safe client routing (code-based route tree in `src/router.tsx`)
- **TypeScript**
- **Cloudflare Workers** — static hosting, SPA routing, newsletter API, and support email API
- No CSS framework — design tokens live in `src/styles/tokens.css`; everything
  else is inline styles + a small `global.css` (resets, `.prose`, responsive rules).

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run dev:cloudflare` | Build and run the full Cloudflare Worker locally |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run typecheck` | Run `tsc --noEmit` |

> `npm run build` uses Vite/esbuild and does not block on type errors. Run
> `npm run typecheck` in CI if you want type checking to gate the build.

## Routes

| Path | Page | File |
| --- | --- | --- |
| `/` | Landing page | `src/pages/Landing.tsx` |
| `/blog` | Blog index | `src/pages/BlogIndex.tsx` |
| `/blog/$slug` | Article | `src/pages/Article.tsx` |

Articles are data-driven — add an entry to `src/data/posts.tsx` (with a
`content` render function) and it appears in the blog index, the landing-page
teaser, and gets its own route automatically.

## Project structure

```
src/
  main.tsx              # app entry, mounts RouterProvider
  router.tsx            # TanStack Router route tree
  config.ts             # APP_STORE_URL constant
  styles/
    tokens.css          # design-system color/type/radius/shadow tokens + fonts
    global.css          # resets, keyframes, .prose, responsive overrides
  components/
    Nav.tsx             # sticky header
    Footer.tsx          # Footer + MiniFooter
    AppStoreButton.tsx  # App Store CTA + Apple glyph
    Phones.tsx          # iPhone mockups (My Tanks / Log / Analytics / Tasks)
  data/
    posts.tsx           # blog posts (metadata + JSX content)
  pages/
    Landing.tsx
    BlogIndex.tsx
    Article.tsx
public/
  logo-wordmark.svg, logo-mark.svg, app-icon-ios.png
worker/
  index.mjs             # Cloudflare Worker API routes
wrangler.jsonc          # Cloudflare deployment and SPA routing config
```

## Configuration

- **App Store link** — single source of truth in `src/config.ts` (`APP_STORE_URL`).
- **Newsletter signup** — configure `MAILERLITE_API_KEY` as a Cloudflare Worker
  secret. Do not prefix it with `VITE_`; the key must stay out of the browser
  bundle.
- **Support email** — configure `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` as
  Cloudflare Worker secrets. `MAILGUN_FROM_EMAIL` is optional; when omitted,
  the Worker uses `Reef Keeper Support <mailgun@MAILGUN_DOMAIN>`. The contact
  form posts to `/api/contact`, which sends support requests to
  `reefkeeper-support@otfusion.org` through Mailgun. Optional screenshots can
  be attached as JPG or PNG files, up to 5 files at 512 KB each.
  `MAILGUN_API_BASE_URL` is optional and defaults to `https://api.mailgun.net`;
  set it to `https://api.eu.mailgun.net` for an EU Mailgun domain.
- **Brand assets** — in `public/`. Replace with final art as needed.

## Deploying

The app deploys to **Cloudflare Workers with Static Assets**. Wrangler uploads
`dist/`, serves matching assets directly, falls back to `index.html` for client
routes, and invokes `worker/index.mjs` for `/api/*`.

Authenticate once, deploy the Worker, and then add the production secret:

```bash
npx wrangler login
npm run deploy
npx wrangler secret put MAILERLITE_API_KEY
npx wrangler secret put MAILGUN_API_KEY
npx wrangler secret put MAILGUN_DOMAIN
# Optional custom sender:
# npx wrangler secret put MAILGUN_FROM_EMAIL
```

For local Cloudflare development, add the Mailgun values from `.env.example` to
your `.env`, then run `npm run dev:cloudflare`. Do not commit `.env`.

After initial setup, deploy new versions with `npm run deploy` (or `make deploy`).
For a Cloudflare Git integration, use `npm run build` as the build command and
`npx wrangler deploy` as the deploy command.

## Notes / handoff

- The phone mockups in `Phones.tsx` are pure CSS/SVG recreations of the app
  screens (no screenshots). Swap in real screenshots when available.
- The font (Plus Jakarta Sans) and Lucide-style icons are design-system
  substitutions — see the Aqua Track design system if you have official assets.
- Pricing copy ($4.99 / $44.99 / $99 lifetime) lives in `Landing.tsx`.
