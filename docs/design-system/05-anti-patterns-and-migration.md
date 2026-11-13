# Anti-Patterns and Migration Notes

## 1. Prohibited implementations

| # | Anti-pattern | Why | Correct approach |
|---|---|---|---|
| P1 | Raw hex/oklch colors in `.tsx` | Breaks theming, escapes contrast gates | Semantic utilities (`bg-primary`, `text-muted-foreground`) |
| P2 | `focus:`-only styling, or `outline-none` without a ring | Mouse-focus styling hides keyboard affordance; hidden focus violates WCAG | `focus-visible:` + global outline / `ring-ring` |
| P3 | Off-scale radius (`rounded`, `rounded-2xl`, `rounded-3xl`) | Off-scale values create one-off exceptions | `rounded-xs/sm/md/lg/xl` only |
| P4 | Off-scale type (`text-[13px]`, `text-5xl` in dashboards) | Unmaintainable ramp | Scale utilities; display sizes only in marketing |
| P5 | One-off spacing (`p-[13.5px]`, arbitrary gaps not in `var(--space-N)`) | Violates spacing scale | `--space-*` values or derivable Tailwind steps |
| P6 | `transition-all` | Animates unintended properties, perf cost | `transition-colors duration-instant` (or the specific list) |
| P7 | White text on teal (`bg-surface-strong` + white) | 1.58:1 — catastrophic fail | `text-surface-strong-foreground` (`#1f1f1f`) |
| P8 | 14px white text directly on `#f00037` | 4.41:1 — fails AA | Text-bearing red surfaces use `--primary` (`#e60035`), or size up to ≥18.66px bold |
| P9 | `text-inverse` (`#cccccc`) outside dark panels (white, red, teal) | 1.61 / 2.75 / 1.01 — fails AA | Inverse only on `#000000`/`#1f1f1f`; light low-emphasis = `text-muted-foreground` |
| P10 | Link-as-button without `Button asChild`, or button without label | Ambiguous semantics | `Button asChild` > `AppLink`, or real `<button>` |
| P11 | Icon-only control without `aria-label` | Unnamed control | `aria-label="Search stories"` |
| P12 | Disabled nav item for "current page" | Removes focusable context | `aria-current="page"` styling |
| P13 | New box-shadow or font family | Off-token visual drift | `shadow-card` (hairline `shadow.2`) / `shadow-glow` (teal `shadow.3`) / `shadow-md` (gray glow `shadow.4`) / `shadow-lg+` (raised `shadow.1`); gellix stack only |
| P14 | Changing button label while loading | Width/name instability | Keep label, add spinner, `aria-busy` |
| P15 | Card nested in card; card with pill radius | Structural/radius violations | Flat card grids, `rounded-lg` |

## 2. Migration notes (current codebase → system)

Applied in this pass; use these patterns when touching remaining files:

### Tokens (`frontend/app/globals.css`)
- Brand semantic layer added for light (`:root`) and dark (`.dark`) themes; `@theme inline` now overrides type scale (`--text-*`), radius (`--radius-*`), shadows (`--shadow-*`), motion (`--duration-*`), and `--font-sans` (gellix stack + `@font-face` slot).
- Base spacing multiplier intentionally unchanged (redesigning it would restyle all 56 routes); scale access is via `--space-1…8` vars + standard steps.
- Global `:focus-visible` outline added; `prefers-reduced-motion` kill-switch added; legacy `hsl(var(--primary))` gradient utilities rewritten to raw `var(--primary)` (they broke when `--primary` became hex).

### Components migrated
- `components/ui/button.tsx` — full 7-state matrix, `loading` prop (`aria-busy` + spinner), new `strong` (teal) variant, AA-safe red ramp, `border-input` on outline.
- `components/ui/input.tsx`, `textarea.tsx` — `--error` invalid states (`border-error` + ring), full-opacity focus ring, `duration-fast`.
- `components/ui/card.tsx` — `rounded-lg` + `shadow-card` (was `rounded-xl` + `shadow-sm`).
- `components/ui/link.tsx` (new) — `AppLink` + `linkVariants` (default/muted/primary/inverse/nav/bare), external-link handling with `rel="noopener"` + sr-only announcement.
- `components/layout/navbar.tsx`, `footer.tsx`, `admin/sidebar.tsx` — AppLink adoption, `aria-current="page"`, `focus:` → `focus-visible:`, brand strings → **Grow** (product) / AlmaBetter (company, where required), tokenized CTA fills (gradients with opacity stops that fail white-label contrast were replaced by `bg-primary hover:bg-primary-hover`).

### In-flight hygiene (this pass)
- `focus:` → `focus-visible:` across `app/` and `components/`.
- Missing `alt` on raw `<img>` added (grep gate P: 0 hits).
- Raw hex in pages/charts replaced with token utilities/var() references.
- Off-scale radii audited: `rounded-xl` → `rounded-lg` on surfaces (pill intent kept `rounded-full`), bare `rounded` → `rounded-xs`, `rounded-2xl` → nearest token.

### Remaining debt (should be done next, not blocking)
1. **Font files:** drop `gellix-regular/medium/semibold/bold` `.woff2` into `frontend/public/fonts/` — stack already points there.
2. **Logo/asset rebrand:** `public/yuva/yuva-logo.webp` and favicon still show the previous mark; text strings now read Grow (product) / AlmaBetter (company).
3. **Untouched routes:** ~50 page files still carry pre-migration markup (marketing pages, dashboards); they inherit tokens automatically but need per-family review against `02-components.md` — start with highest-density screens (placements, dashboards).
4. **Unused primitives:** 39 of 56 `components/ui/*` files are unimported; delete or adopt deliberately.
5. **`onKeyPress` legacy handlers** (4 sites) → `onKeyDown`.
6. Legacy `next-themes` `system` default retained; product may pin `dark` as default for the dashboard later (one-line change in `app/layout.tsx`).

## 3. Edge-case handling summary

- Long content: truncate with `line-clamp-*` + `min-w-0`; never wrap buttons; links `break-words`.
- Empty: sentence + action (see content guide §4).
- Loading: skeletons at final size; `aria-busy` where fetch is scoped.
- Error: inline `role="alert"` + Retry; button returns to default state after failure.
- Offline/session expiry: handled at layout level with a toast (`sonner`), not per-component.
