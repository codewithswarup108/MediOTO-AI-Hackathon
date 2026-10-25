# MediOTO AI — Clarity Before Complexity

**Hackathon project:** ORCA CODER Hackathon · Track 02: Healthcare & MedTech  
**Team:** Alshi Coders  
**Tagline:** Clarity Before Complexity

MediOTO AI is an explainable, educational lab-report analysis prototype. It analyzes fictional or manually entered values against configurable illustrative demo intervals, explains numerical flags, and demonstrates one explicit combination-review rule. It does not diagnose or prescribe.

## Run locally

Requires Node.js 20 or newer; there are no runtime dependencies or API keys.

```sh
npm run dev
```

Open the URL printed in the terminal, normally `http://localhost:4173/demo?sample=mixed`. If that port is occupied, the development server automatically tries the next available port. Use `sample=normal`, `sample=mixed`, or `sample=combined` to select a sample. `npm test` runs the deterministic analyzer unit tests. `npm run build` creates a static production site in `dist/`; `npm run preview` serves that build locally.

## Deployment

The project is a client-side static application. No environment variables are required.

### Render

Create a **Static Site** connected to this repository, then use build command `npm run build` and publish directory `dist`. Set a rewrite from `/*` to `/index.html` for `/demo` and sample deep links. Render can redeploy the static site when you push to the connected branch. See [Render static site docs](https://render.com/docs/static-sites).

### Vercel

Import this repository. `vercel.json` configures the build command, `dist` output directory, and SPA rewrite. See [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json).

### Netlify

Connect this repository or upload `dist/` after running `npm run build`. `netlify.toml` sets the build command, publish directory, and SPA fallback.

After deployment, verify `/demo`, `/demo?sample=normal`, `/demo?sample=mixed`, and `/demo?sample=combined` directly in a fresh browser tab. Confirm the demo loads without signing in. To clear the current demo, use **Reset demo**; values are held in memory and clearing browser site data also clears any browser-held static asset cache.

## Analysis and criteria

The independent analyzer lives in `src/analyzer.js`; criteria and fictional reports live in `src/criteria.js`. Interval boundaries are inclusive. Unit mismatches and unsupported identifiers produce explicit issues without comparison. A single illustrative combination-review rule connects fasting glucose and HbA1c only when both satisfy their separate configured thresholds. SignalMap derives its nodes and links from the current analysis output. Printing uses the browser print dialog and a print stylesheet.

All criteria are illustrative demonstration values, not medically authoritative reference ranges. They are included to demonstrate configurable comparisons. Real laboratory ranges vary by laboratory and patient context. The glucose combination rule is not a diagnostic criterion. The application does not collect clinical context, diagnose, prescribe, transmit report data, persist user values, perform OCR, or use an AI service. The optional What-If Lab demonstrates software behavior; it does not predict health outcomes. The interface uses system font stacks and has no external font or analysis runtime dependency.

## Two-minute judge walkthrough

1. Open `/demo?sample=mixed` and run Analyze report; inspect the computed below, above, and within-range counts.
2. Open a result's explanation to see its value, interval, comparison, and missing interpretation context.
3. Choose the combined-indicator sample; open SignalMap's related-glucose rule to review its exact conditions and limitation.
4. Move the HbA1c slider in What-If Lab across the configured threshold and inspect the recomputed map and status.
5. Choose Print summary to preview the computed report and disclaimer.
6. Close by emphasizing that this is an educational prototype for preparing questions, not a diagnostic tool.

## Guided demo

The first visit to `/demo` offers an eight-step guided tour. It walks through sample selection, SignalScan, the computed report and interval graphs, explanations, SignalMap, What-If Lab, and printing. Visitors can skip the tour or restart it with **Guided tour** in the top navigation. **Analyze report** opens an interactive report with a computed status distribution, clickable filters, measurement explanations, and value-versus-interval graphs. Closing controls work with the close button, backdrop click, or Escape.
