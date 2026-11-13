# Design Tokens and Foundations

Design intent: one black-based, red-accented, teal-highlighted token system with a 16px-base Gellix type ramp that renders correctly in both light (default) and dark (brand) themes at WCAG 2.2 AA across the Grow Polaris content site.

## 1. Theme model

| Theme | Where | Role |
|---|---|---|
| Light (default) | `:root` in `frontend/app/globals.css` | Default site theme; white base, near-black text |
| Dark (brand) | `.dark` class | Brand theme per spec: `surface.base=#000000`, `text.primary=#ffffff` |

- The app switches themes with `next-themes` (`attribute="class"`). Components **must** reference semantic tokens only (`bg-background`, `text-foreground`, `bg-primary`…), never theme-specific hex values, so both themes work with zero component changes.
- Raw brand hex values appear only in this document and in the token definitions of `app/globals.css`.

## 2. Typography

### 2.1 Font family

| Token | Value |
|---|---|
| `font.family.primary` | `gellix` |
| `font.family.stack` | `gellix, "gellix Fallback", sans-serif` |

- CSS implementation: `--font-family-primary` (exposed as `--font-sans` in `@theme inline`).
- `@font-face` slot is defined in `app/globals.css` for weights 400/500/600/700 loading from `/public/fonts/gellix-{weight}.woff2` (plus `gellix Fallback` with `local("Arial")`, `size-adjust: 104.3%`, ascent 97.42%, descent 17.65%). Until the woff2 files are dropped in, the stack renders the metric-compatible Arial fallback — this **must** not be bypassed by hardcoding another font in components.
- Weight ramp: 400 regular, 500 medium, 600 semibold, 700 bold. `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`.

### 2.2 Type scale

| Token | Size | Line height | Tailwind utility | Typical use |
|---|---|---|---|---|
| `font.size.xs` | 12px | 16px | `text-xs` | Badges, meta, captions |
| `font.size.sm` | 14px | 20px | `text-sm` | Secondary text, list meta |
| `font.size.base` | 16px | 24px | `text-base` | Body, default control text |
| `font.size.md` | 15px | 20px | `text-md` | Emphasized UI text, nav labels |
| `font.size.lg` | 16px | 24px | `text-lg` | Section subheads |
| `font.size.xl` | 18px | 28px | `text-xl` | Card titles |
| `font.size.2xl` | 20px | 28px | `text-2xl` | Page section titles |
| `font.size.3xl` | 24px | 32px | `text-3xl` | Page titles, hero stats |
| `font.size.4xl` | 28px | 36px | `text-4xl` | Hero titles (max in-scale size) |

- Display extensions (documented, marketing only — dashboard screens **must** stay ≤ `4xl`): `text-5xl` = 48/56, `text-6xl` = 60/68.
- Controls (buttons, inputs, selects) **must** use `text-sm` or `text-base`. Headings **must** use the scale — one-off `text-[13px]`-style sizes are prohibited.
- `font.weight.base=400` for body; emphasis **should** use 500/600 — never fake bold via `font-black` outside badges.

## 3. Color

### 3.1 Brand primitives (spec names → values)

| Spec token | Value | Role |
|---|---|---|
| `color.surface.base` | `#000000` | Page base (dark theme) |
| `color.text.primary` | `#ffffff` | Primary text on dark / on strong fills |
| `color.text.secondary` | `#1f1f1f` | Primary text on light / on red & teal fills |
| `color.text.inverse` | `#cccccc` | Low-emphasis text on dark brand surfaces |
| `color.surface.raised` | `#f00037` | Brand red surface (large-text or non-text use) |
| `color.surface.strong` | `#00e8bb` | Teal emphasis surface (always with `text.secondary`) |

### 3.2 Derived AA-safe tokens (required — spec red fails small-text contrast)

Measured contrast (WCAG 2.2 AA requires 4.5:1 normal text, 3:1 large text and UI boundaries):

| Pairing | Ratio | Verdict |
|---|---|---|
| `#ffffff` on `surface.raised #f00037` | 4.41 | **Fails** normal text; OK ≥18.66px bold / ≥24px |
| `#1f1f1f` on `#f00037` | 3.74 | Fails normal text |
| `#ffffff` on `surface.strong #00e8bb` | 1.58 | **Prohibited** |
| `#1f1f1f` on `#00e8bb` | 10.41 | Required pairing |
| `#cccccc` on `surface.base #000000` | 13.08 | AA ✓ |
| `#cccccc` on white | 1.61 | **Prohibited** (light theme: inverse only on dark panels) |
| `#cccccc` on `#f00037` / `#00e8bb` | 2.75 / 1.01 | **Prohibited** |
| `#1f1f1f` on `#000000` | 1.27 | **Prohibited** |

Therefore the system defines:

| Derived token | Light | Dark | Purpose |
|---|---|---|---|
| `--primary` (text-bearing red) | `#e60035` (white label = 4.76 ✓) | `#e60035` | Buttons, links, active indicators carrying text |
| `--primary-hover` | `#c70031` (6.05 ✓) | same | Red hover |
| `--primary-active` | `#b20610` (7.18 ✓) | same | Red pressed |
| `--inverse` | `#cccccc` (13.08 on `#000`, 10.27 on `#1f1f1f` ✓) | same | Low-emphasis text on dark panels only |
| `--error` | `#b20610` (7.18 ✓) | `#ff85a1` (9.12 on black ✓) | Error text, error borders, error icons |
| `--strong-hover` | `#00d4aa` | same | Teal hover (`#1f1f1f` label ≈ 9.5 ✓) |
| `--strong-active` | `#00b894` | same | Teal pressed |

**Hard pairing rules (must):**

1. Text smaller than 18.66px bold / 24px on a red surface **must** sit on `--primary` (`#e60035`), not on `surface.raised` (`#f00037`). Exact `#f00037` is reserved for non-text fills and large display text.
2. Text on `surface.strong` (`#00e8bb`) **must** be `text.secondary` (`#1f1f1f`). White on teal is prohibited.
3. `text.inverse` (`#cccccc`) **must** only be used on dark panels (`surface.base #000000` or `#1f1f1f`: 13.08 / 10.27 ✓) in either theme. On white (1.61), on `#f00037` (2.75), and on `#00e8bb` (1.01) it is prohibited; light-theme low-emphasis text **must** use `--muted-foreground` instead.
4. On `surface.base` (`#000000`), text **must** be `text.primary` (`#ffffff`) or `text.inverse` (`#cccccc`) — `text.secondary` (`#1f1f1f`) on black is prohibited.

### 3.3 Semantic layer → Tailwind utilities

Components consume these only (all defined per theme in `app/globals.css`):

| Semantic token | Light | Dark | Utility |
|---|---|---|---|
| `--background` | `#ffffff` | `#000000` | `bg-background` |
| `--foreground` | `#1f1f1f` | `#ffffff` | `text-foreground` |
| `--card` / `--card-foreground` | `#ffffff` / `#1f1f1f` | `#1f1f1f` / `#ffffff` | `bg-card text-card-foreground` |
| `--popover` / `--popover-foreground` | `#ffffff` / `#1f1f1f` | `#1f1f1f` / `#ffffff` | `bg-popover` |
| `--primary` (+ hover/active/foreground) | `#e60035` (+`#c70031`/`#b20610`/`#fff`) | same | `bg-primary hover:bg-primary-hover active:bg-primary-active` |
| `--secondary` (+ hover/active) | `#f5f5f5` (+`#e9e9e9`/`#e0e0e0`) | `#1f1f1f` (+`#2e2e2e`/`#3a3a3a`) | `bg-secondary` |
| `--muted` / `--muted-foreground` | `#f5f5f5` / `#626262` (6.10 ✓) | `#1f1f1f` / `#cccccc` (10.26 ✓) | `text-muted-foreground` |
| `--accent` / `--accent-foreground` | `#fbe2e8` / `#1f1f1f` (13.46 ✓) | `#451923` / `#ffffff` (14.83 ✓) | `bg-accent` (hover fills) |
| `--destructive` (+ hover/active/foreground) | `#b20610` (+`#9a0510`/`#590004`/`#fff`) | same | `bg-destructive` |
| `--error` | `#b20610` | `#ff85a1` | `text-error border-error` |
| `--surface-raised` | `#f00037` | `#f00037` | `bg-surface-raised` (large/non-text) |
| `--surface-strong` / `-foreground` | `#00e8bb` / `#1f1f1f` | same | `bg-surface-strong text-surface-strong-foreground` |
| `--inverse` | `#cccccc` | `#cccccc` | `text-inverse` (dark panels only) |
| `--border` (decorative) | `#e9e9e9` | `rgb(255 255 255 / 10%)` | `border-border` |
| `--input` (interactive boundaries) | `#808080` (3.95 ✓) | `#6b6b6b` (3.94/3.09 ✓) | `border-input` |
| `--ring` (focus) | `#e60035` (4.76 ✓) | `#00e8bb` (13.26 ✓) | `focus-visible:ring-ring` / global outline |

- `--border` is for **decorative** dividers only. Interactive boundaries (inputs, outline buttons, toggles) **must** use `border-input` so the 3:1 non-text contrast requirement passes.
- Chart palette (both themes, all ≥3:1 vs page): light `#e60035, #00786a, #9a6b00, #d63d6a, #6b6b6b`; dark `#f00037, #00e8bb, #f3aa0f, #ff85a1, #cccccc`.
- Sidebar tokens (`--sidebar*`) follow the same logic: light `#f5f5f5` rail on white, dark `#1f1f1f` rail on black, both with `--accent` hover fills.

## 4. Spacing

| Token | `space.1` | `space.2` | `space.3` | `space.4` | `space.5` | `space.6` | `space.7` | `space.8` |
|---|---|---|---|---|---|---|---|---|
| px | 2 | 4 | 5 | 6 | 8 | 10 | 12 | 13 |
| CSS var | `--space-1` | `--space-2` | `--space-3` | `--space-4` | `--space-5` | `--space-6` | `--space-7` | `--space-8` |
| Nearest Tailwind step | `p-0.5` | `p-1` | — | `p-1.5` | `p-2` | `p-2.5` | `p-3` | — |

Rules:

1. Component-internal spacing (icon↔label gaps, inline padding, badge internals) **must** come from this scale — exact value via `var(--space-N)` when no Tailwind step matches, or the matching Tailwind step when it does.
2. Structural/compound spacing **must** be a repeated single scale step: 16 = 2×`space.5`, 24 = 2×`space.7`, 36 = 3×`space.7`, 48 = 4×`space.7`. Card padding of 24px therefore maps to `px-6 py-6` legally.
3. One-off values (`p-[13.5px]`, `gap-[7px]`) are prohibited. The base spacing multiplier must not be redefined (it would restyle the whole app).

## 5. Radius

| Token | `radius.xs` | `radius.sm` | `radius.md` | `radius.lg` | `radius.xl` |
|---|---|---|---|---|---|
| px | 6 | 8 | 10 | 12 | 9999 (pill) |
| Utility | `rounded-xs` | `rounded-sm` | `rounded-md` | `rounded-lg` | `rounded-xl` |

- Cards, panels, menus, dialogs **must** use `rounded-lg` (12px). Inputs and buttons **must** use `rounded-md` (10px). Chips/badges/pills **must** use `rounded-xl` (pill). Small chips/tags **should** use `rounded-sm`.
- Bare `rounded` (4px) and off-scale values (`rounded-2xl`, `rounded-3xl`) are outside the scale and **must** be migrated to the nearest token.

## 6. Shadow

Only four shadows exist (spec `shadow.1` / `shadow.2` / `shadow.3` / `shadow.4`):

| Spec token | Value | Utility | Use |
|---|---|---|---|
| `shadow.1` | `rgba(0,0,0,0.06) 0px 2px 24px 0px` | `shadow-lg` / `shadow-xl` / `shadow-2xl` | Raised surfaces: elevated cards, popovers, dialogs, sheets |
| `shadow.2` | `rgba(0,0,0,0.05) 0px 1px 2px 0px` | `shadow-card` (= `shadow-sm`/`shadow-xs`) | Hairline: cards at rest, inputs |
| `shadow.3` | `rgba(0,232,187,0.3) 0px 4px 6px -1px, rgba(0,232,187,0.3) 0px 2px 4px -2px` | `shadow-glow` | Teal glow: focus accent, active CTA, highlight |
| `shadow.4` | `rgba(135,135,135,0.35) 0px 4px 8px 0px` | `shadow-md` | Interactive elevation: hover lift (`.card-hover`), hovered controls |

- Cards at rest **must** use `shadow-card` (`shadow.2`). Interactive hover lift **should** use `shadow-md` (`shadow.4`, applied by `.card-hover`). Floating layers **must** use `shadow-lg` or heavier (resolves to `shadow.1`). `shadow-glow` **should** only be used on dark surfaces or as focus/highlight accent.
- New box-shadow values outside these four are prohibited.

## 7. Motion

| Token | Value | Utility | Use |
|---|---|---|---|
| `motion.duration.instant` | 150ms | `duration-instant` | Hovers, focus rings, color changes |
| `motion.duration.fast` | 200ms | `duration-fast` | Toggles, small expansions, transitions |
| `motion.duration.normal` | 300ms | `duration-normal` | Panels, drawers, sheets |
| `motion.duration.slow` | 1400ms | `duration-slow` | Ambient motion: skeleton/pulse emphasis, decorative loops (never interactive feedback) |

Rules:

1. Interactive feedback (hover/focus/active) **must** use `duration-instant` or `duration-fast` — never `duration-normal`.
2. `duration-normal` (300ms) **should** only be used for large surface transitions (drawer, sheet, scroll-into-view emphasis).
3. `duration-slow` (1400ms) **should** only drive ambient/pulse motion and **must** be wrapped in `motion-safe:`.
4. Motion **must** honor `prefers-reduced-motion` — the global reduced-motion rule in `globals.css` kills non-essential animation; new keyframe animations **must** be wrapped in `motion-safe:`.
5. `transition-all` is prohibited on components — **must** transition only the properties that change (typically `transition-colors duration-instant`).
