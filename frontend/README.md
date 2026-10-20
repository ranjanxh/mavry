# Mavry frontend

Documentation that keeps up with your code. This is the frontend for Mavry, a docs platform where examples
are verified against your OpenAPI spec and commits.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into dist/
npm run build:preview  # one self-contained dist/index.html (hash routing)
```

Node 18+ is required. Fonts load from Google Fonts, so the first load needs internet.

## Milestone 1 (this drop)

**Done**
- Vite + React 18 + TypeScript (strict) project, React Router with a central route table (`src/routes.ts`).
- Complete public landing page with the centered "paper on a desk" hero: draggable sheets, handwritten notes,
  a pressed stamp, and a walkthrough where a schema change breaks an example, gets a reviewed fix, and is re-verified.
- Tabbed app preview (Editor, API reference, Verification, Change impact) that really works on sample data.
- Domain types for every entity in the spec, one status vocabulary, and a sample-data module the UI reads from.

**Not built yet** (these routes render an honest "planned" page, see `PLANNED_ROUTES`)
login/signup, onboarding, workspace dashboard, projects, project overview, editor, API reference, verification
center and run details, GitHub integration, change impact, revision history, search and command palette, settings.

## Structure

```
src/
  routes.ts            central paths + planned-route list
  domain/              types, status vocabulary, derived summaries (no UI)
  data/sample.ts       simulated demo data (single source of truth)
  utils/               formatting, curl builder, clipboard
  hooks/               useDrag, usePrefersReducedMotion
  components/ui/       Glyph, StatusChip, Toast, AnchorLink
  components/landing/  one file per landing section; preview/ holds the app tabs
  pages/               route-level components
  styles/              global.css (tokens, buttons, status chips), landing.css
```

## Design rules baked in

- One saturated blue (`--blue`), near-black ink, cool paper. Status colors are reserved for meaning.
- Every status has its own shape *and* label: verified (circle), failed (square), warning (triangle),
  pending (dashed circle), not verified (hollow circle). Color is never the only signal.
- Detected issue, AI suggestion, verified result, and human-approved change look different on purpose.
- No confidence scores anywhere. Counts and pass rate are computed from the checks (`domain/verification.ts`).
- Motion respects `prefers-reduced-motion`.

## Honesty about simulation

Everything is sample data and demo behavior. Nothing connects to GitHub, runs code, or calls a backend.
Controls whose destination does not exist yet show a toast saying so. The planned API (`/api/v1/...`) is a
design contract, not an implemented service.

## Next milestones

1. App shell (sidebar, top bar, breadcrumbs, command palette) + service layer + workspace dashboard.
2. Editor and Verification Center, the two flagship screens.
3. API reference, GitHub, change impact, revisions.
4. Auth, onboarding, settings, search.
