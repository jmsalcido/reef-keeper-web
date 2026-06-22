# Reef Keeper — Aquarium Tracker (marketing site)

Marketing site for **Reef Keeper: Aquarium Tracker** (iOS). Landing page, blog
index, and SEO articles. Built with **React + Vite + TanStack Router** in
TypeScript, styled with the Aqua Track design system tokens.

## Stack

- **Vite 5** — dev server + build
- **React 18**
- **TanStack Router 1** — type-safe client routing (code-based route tree in `src/router.tsx`)
- **TypeScript**
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
  _redirects            # Netlify SPA fallback
```

## Configuration

- **App Store link** — single source of truth in `src/config.ts` (`APP_STORE_URL`).
- **Brand assets** — in `public/`. Replace with final art as needed.

## Deploying

The site is a static SPA. `npm run build` outputs to `dist/`. Both config files
for SPA history fallback are included:

- **Vercel** — `vercel.json` (rewrite all routes to `/index.html`). Just import the repo.
- **Netlify** — `netlify.toml` + `public/_redirects`. Build `npm run build`, publish `dist`.
- **Other static hosts** — serve `dist/` and add a catch-all rewrite to `/index.html`
  so client-side routes (e.g. `/blog/...`) resolve on refresh.

## Notes / handoff

- The phone mockups in `Phones.tsx` are pure CSS/SVG recreations of the app
  screens (no screenshots). Swap in real screenshots when available.
- The font (Plus Jakarta Sans) and Lucide-style icons are design-system
  substitutions — see the Aqua Track design system if you have official assets.
- Pricing copy ($4.99 / $44.99 / $99 lifetime) lives in `Landing.tsx`.
