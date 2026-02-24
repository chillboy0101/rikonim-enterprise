# Rikonim Enterprise Website

Production marketing site + Sanity CMS page builder.

- **Website**: Next.js (App Router)
- **CMS**: Sanity
- **Studio**: separated standalone app under `./studio` (deployed to `studio.rikonim.com`)
- **Preview / Presentation**: Sanity Presentation tool + Next.js Draft Mode + Visual Editing overlay

## Repositories & Apps

This repository contains two deployable apps:

1. **Website (Next.js)**
   - Root: `/`
   - Deploy target: `https://rikonim.com`
   - Key folders:
     - `src/app`: pages/routes (App Router)
     - `src/components`: UI components
     - `src/lib`: data and Sanity query helpers

2. **Sanity Studio (standalone)**
   - Root: `/studio`
   - Deploy target: `https://studio.rikonim.com`
   - Reuses schemas and desk structure from `/sanity`

## Local Development

### Prerequisites

- Node.js (recommended: latest LTS)
- npm

### 1) Install dependencies

From the repo root:

```bash
npm install
```

From the Studio folder:

```bash
cd studio
npm install
```

### 2) Run the website

From the repo root:

```bash
npm run dev
```

Open:

- `http://localhost:3000`

### 3) Run the Studio

From the `studio/` folder:

```bash
npm run dev
```

Open:

- `http://localhost:3333`

## Environment Variables

### Website (Next.js)

Set these in `.env.local` for local development and in Vercel for production.

**Sanity (public)**

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

**Sanity tokens (server-only)**

- `SANITY_API_READ_TOKEN`
- `SANITY_API_WRITE_TOKEN` (only required for import/seeding scripts)

**URLs**

- `NEXT_PUBLIC_SANITY_PREVIEW_URL`
  - Local: `http://localhost:3000`
  - Production: `https://rikonim.com`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`
  - Production: `https://studio.rikonim.com`

### Studio (Sanity)

Set in Vercel Studio project env vars:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_PREVIEW_URL` (usually `https://rikonim.com`)

> Note: The Studio config contains safe non-secret defaults for `projectId` and `dataset` so it won’t hard-crash if env vars are missing, but production should always set env vars correctly.

## CMS Data Model (High-level)

Sanity is used as a **page builder** with “one document per page” and structured sections.

### Document types

- `page`
  - One document per site route (e.g. `/`, `/about`, `/projects`, `/privacy-policy`)
  - Fields include:
    - `route` (string)
    - `enabled` (boolean)
    - `seo.metaTitle`, `seo.metaDescription`
    - `sections[]` (array of typed section blocks)

- `project`
  - Portfolio projects displayed on `/projects` and `/projects/[slug]`

- `service`
  - Services listing/details displayed on `/services`

- `siteSettings`
  - Global site settings (name, overview, contact info, etc.) used for layout + SEO

### Section types (examples)

The `page.sections[]` array supports multiple section types such as:

- `heroSection`
- `projectsIntroSection`
- `aboutSection`
- `contactSection`
- `richTextSection`
- plus home-page specific sections (e.g. `homeHeroSection`, `homeWorkSection`, etc.)

Schemas live in:

- `sanity/schemaTypes/*`

Desk structure:

- `sanity/deskStructure.ts`

## How rendering works

### Pages

- Many marketing routes fetch a `page` document using `getSanityPageByRoute(route)`.
- If a page is not enabled or missing, the site falls back to local config/content.

### Global layout + SEO

- `src/app/layout.tsx` fetches `siteSettings` from Sanity and merges it with local defaults.
- SEO metadata is generated dynamically with `generateMetadata()` using Sanity settings.

### Caching & performance

- Published-mode reads use Next.js server caching (`unstable_cache`) with `revalidate = 60`.
- Preview-mode reads bypass caching and use preview drafts.

## Sanity Presentation / Preview / Visual Editing

### Draft Mode

Next.js Draft Mode is used for previewing drafts and enabling overlays.

- Enable Draft Mode: `/api/draft-mode/enable`
- Disable Draft Mode: `/api/draft-mode/disable`

### Visual Editing overlay

The project uses the `next-sanity/visual-editing` overlay.

Key points:

- The overlay is rendered when Draft Mode is enabled (see `src/components/VisualEditingOverlay.tsx`).
- For click-to-edit to work, the website must fetch data using `next-sanity` with **stega enabled**.
- This repo enables stega only in Draft Mode for:
  - `src/lib/sanityPages.ts`
  - `src/lib/sanityQueries.ts`

### Presentation tool configuration

Presentation resolvers live in:

- `sanity/presentationResolve.ts`

The Studio config is in:

- `studio/sanity.config.ts`

## Deployment (Vercel)

### Website

- Vercel project: `rikonim-enterprise`
- Domains:
  - `rikonim.com` (production)
  - `www.rikonim.com` redirects to `rikonim.com`

### Studio

- Vercel project: `rikonim-enterprise-studiocms`
- Root directory: `studio`
- Build command: `npm run build`
- Output directory: `dist`
- Domain:
  - `studio.rikonim.com`

### Website `/studio` route

The website no longer hosts Studio.

- `https://rikonim.com/studio` redirects to `https://studio.rikonim.com`

## Sanity project settings (CORS / Origins)

In Sanity Manage:

- **API → CORS origins** should include:
  - `https://studio.rikonim.com`
  - `https://rikonim.com`
  - Local dev:
    - `http://localhost:3333`
    - `http://localhost:3000`

- **Studios** should include:
  - `https://studio.rikonim.com`

## Scripts

From the repo root:

- `npm run dev` – start Next.js dev server
- `npm run build` – production build
- `npm run start` – start Next.js prod server

Content seeding/import:

- `scripts/import-sanity.js`
  - Uses `SANITY_API_WRITE_TOKEN`
  - Includes retry/backoff to handle transient network errors

## Troubleshooting

### Studio shows: “Configuration must contain projectId”

- Ensure Vercel Studio project has env var `NEXT_PUBLIC_SANITY_PROJECT_ID` set (Production + Preview + Development).
- Redeploy with cache cleared.

### Visual Editing overlay shows but click-to-edit doesn’t work

Common causes:

- Draft Mode is not enabled.
- The page data is not fetched with stega enabled.
- `SANITY_API_READ_TOKEN` is missing in the website deployment (required for `perspective: previewDrafts`).

### Presentation shows “Missing a main document for /some-route”

- Verify mapping rules in `sanity/presentationResolve.ts`.

## Contributing / Code style

- Prefer server-side data fetching for published pages.
- Use Draft Mode + stega only for preview.
- Keep schemas in `/sanity/schemaTypes` so both Studio and site share the same data model.

---

If you’re a new developer onboarding:

1. Start the website (`npm run dev`) and studio (`studio/npm run dev`).
2. Confirm you can log into Studio and view/edit `page` documents.
3. Test Presentation preview and click-to-edit.
4. Deploy website and studio separately.
