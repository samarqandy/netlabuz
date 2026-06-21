# NETLAB UI — usage conventions

NETLAB UI is a dark-first, tech/cyber design system (Samarqand IT training center: Cisco, Linux, IoT, CCTV, networking). Components are real React parts exported on `window.NetlabUI.*`.

## Setup & theming — no provider needed
Components are styled by **Tailwind utility classes compiled into `_ds_bundle.css`** plus **CSS-variable tokens defined on `:root`** (the dark theme is baked into `:root`). There is **no ThemeProvider/wrapper** — render any component directly and it is styled. The stylesheet ships via `styles.css` (which `@import`s `_ds_bundle.css`); make sure that closure is loaded. Surfaces are dark by default: `--background` is near-black (#0A0A0A), text is near-white.

## Styling idiom — semantic CSS-variable tokens
Style your own layout glue with the SAME tokens the components use, as `hsl(var(--token))`. Real token names (all defined in `_ds_bundle.css`):
- Surfaces/text: `--background`, `--foreground`, `--card`, `--card-foreground`, `--muted`, `--muted-foreground`, `--secondary`
- Brand: `--primary` (tech blue #0066CC), `--primary-glow` (#0088FF), `--accent` (cyber green #00FF88)
- Form/feedback: `--border`, `--input`, `--ring`, `--destructive`
- Shape: `--radius` (0.75rem)

Brand accent utility classes also exist: `text-accent`/`bg-accent` (green), `bg-primary` (blue), `text-gradient-tech` (blue→green gradient text), `shadow-glow-blue` (glow). Prefer composing existing components over hand-writing markup.

## Component API highlights (style via props, not classes)
- **Button** — `variant`: `default` (blue) · `accent` (green) · `outline` · `ghost` · `link`; `size`: `sm` · `default` · `lg` · `icon`; `asChild` to render as a child element. Icons: pass a lucide `<svg>` as a child (auto-sized).
- **Badge** — `variant`: `default` · `accent` · `cyan` · `outline`, plus course-level semantics `beginner` · `intermediate` · `advanced`.
- **Card** — compound: `Card` + `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`.
- **GlowCard** — interactive cyber card; `glow`: `blue` · `green` · `cyan`; hover-lifts.
- **Input / Textarea / Select / Label** — form primitives; pass `aria-invalid` for the destructive (error) state. `Select` is a native `<select>`.
- **Skeleton** — loading placeholder (size via `style`/`className`).
- **Reveal / StaggerGroup + StaggerItem** — scroll-reveal motion wrappers (animate on enter view).
- **SectionHeading** — `eyebrow` + `title` + `subtitle`; `align`: `center` · `left`.

## Where the truth lives
Read `styles.css` and its `@import` (`_ds_bundle.css`) for the full token/utility vocabulary, and each component's `<Name>.d.ts` (props contract) + `<Name>.prompt.md` before composing.

## Idiomatic snippet
```tsx
<Card style={{ maxWidth: 380 }}>
  <CardHeader>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <CardTitle>Cisco / MikroTik tarmoqlar</CardTitle>
      <Badge variant="intermediate">O'rta</Badge>
    </div>
    <CardDescription>Routing, switching, VLAN, VPN va tarmoq xavfsizligi.</CardDescription>
  </CardHeader>
  <CardContent>
    <p style={{ margin: 0, fontSize: 14, color: 'hsl(var(--muted-foreground))' }}>
      3 oy · amaliy laboratoriya
    </p>
  </CardContent>
  <CardFooter>
    <Button variant="accent">Ro'yxatdan o'tish</Button>
  </CardFooter>
</Card>
```
