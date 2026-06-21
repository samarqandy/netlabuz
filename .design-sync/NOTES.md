# NETLAB UI — design-sync notes

## What this repo is
A **Next.js application** (netlab.uz), not a packaged component library — no `dist/`, no
`main`/`exports`, no Storybook. The sync runs the **package shape in synth-entry mode**:

- Bundle entry is a hand-written barrel: `.design-sync/entry.tsx` — re-exports only the
  scoped UI primitives. Pass it with `--entry ./.design-sync/entry.tsx` (there is NO build
  command; `cfg.buildCmd` intentionally unset).
- `componentSrcMap` (in config) scopes the 11 components and pins their src paths, so the
  full `src/` tree is NOT scanned/over-included.
- Synced scope: Button, Badge, Card, GlowCard, Input, Textarea, Label, Select, Skeleton,
  Reveal, SectionHeading. Excluded on purpose: page sections, navbar/footer, the WebGL
  `scene`, `count-up`, `dropdown-menu` (radix/state-heavy).

## CSS — compiled manually (the #1 re-sync gotcha)
Components are Tailwind utility classes + HSL CSS-variable tokens. There is no shipped
stylesheet, so Tailwind is compiled by hand and `cfg.cssEntry` points at the output:

```sh
npx tailwindcss -c .design-sync/tailwind.ds.ts -i .design-sync/ds-globals.css \
  -o .design-sync/compiled.css --minify
```

- `.design-sync/ds-globals.css` (committed) promotes the **dark** token values onto `:root`
  so previews render dark/brand-correct with no ThemeProvider.
- `.design-sync/tailwind.ds.ts` (committed) inherits the repo's `tailwind.config.ts` theme,
  only overriding `content` to scan `src/components` + `.design-sync/previews` + the entry.
- `.design-sync/compiled.css` is **gitignored (generated)** — ALWAYS recompile it before
  `package-build`/`resync`, or new component classes ship unstyled.

## Commands
Build (first sync / manual): recompile CSS (above), then
`node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/entry.tsx --out ./ds-bundle`
then `node .ds-sync/package-validate.mjs ./ds-bundle`.
Re-sync driver: recompile CSS, re-copy staged scripts, fetch the project's `_ds_sync.json`
to `.design-sync/.cache/remote-sync.json`, then
`node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/entry.tsx --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json`.

## Known render warns
- None outstanding. (Render check: 11/11 clean, 0 bad/thin.)
- Grading-sheet artifact (not a defect): the per-story review sheet has a WHITE chrome
  background, so white text (Label text, SectionHeading title) looks faint there. In the
  shipped product the body is dark (`styles.css`), so they render correctly. The raw
  (dark) screenshots and `.review.html` show the true look.

## Re-sync risks (what can silently go stale)
- **compiled.css staleness** — if you add/change component classes and forget to recompile,
  previews/designs render unstyled. Recompile is step 1 of every sync.
- **Barrel + componentSrcMap drift** — adding/removing a UI primitive needs BOTH
  `.design-sync/entry.tsx` and `componentSrcMap` updated, else it won't appear or won't bundle.
- **Fonts** — the DS ships no `@font-face`; `ds-globals.css` sets a system `ui-sans-serif`
  stack. The real app uses Inter via `next/font` (not shippable as a static file here). If a
  brand font is required in designs, add it via `cfg.extraFonts`.
- **Preview animation wrappers** — `Reveal`/`StaggerGroup` previews pass `initial="animate"`
  so the static capture shows the resolved (visible) state; their normal runtime behavior is
  `whileInView`, which does not fire in a static screenshot.
- **2 undefined tokens** — validate reports 2 referenced-but-undefined CSS vars (below
  threshold, non-blocking) — likely radix/animation vars from excluded components.
