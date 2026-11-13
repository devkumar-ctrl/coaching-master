# QA Checklist

Run before every UI pull request. Every box is pass/fail.

## 1. Tokens (foundations)

- [ ] No raw hex/rgb/oklch colors in `.tsx` files (grep gate: only the 2 whitelisted files in `03-accessibility.md` §Automated gate — `daily-meeting.tsx` SDK config, `chart.tsx` Recharts selectors).
- [ ] No off-scale radius: `rounded` (bare), `rounded-2xl`, `rounded-3xl` absent.
- [ ] No off-scale font sizes in components (`text-[Npx]` absent; dashboards ≤ `text-4xl`).
- [ ] No arbitrary spacing outside `var(--space-*)` scale logic.
- [ ] No `transition-all`; transitions use `duration-instant`/`fast`/`normal` per `01-foundations.md` §7.
- [ ] Fonts resolve through `--font-sans` (gellix stack); no hardcoded `font-family` in components.

## 2. Component states

- [ ] Every interactive element touched in the PR defines: default, hover, focus-visible, active, disabled, loading, error (or documents why N/A per `02-components.md`).
- [ ] Buttons: variant/token mapping correct; `loading` keeps label + `aria-busy`.
- [ ] Links: `AppLink` used for internal/external navigation; external links carry `rel="noopener"` + sr-only note.
- [ ] Lists: skeleton matches final height; empty and error states present where data-driven.
- [ ] Navigation: one `aria-current="page"` per landmark; Sheet focus trap + restore verified.
- [ ] Inputs: label association, `aria-invalid`, `aria-describedby` error wiring verified.

## 3. Accessibility (from `03-accessibility.md`)

- [ ] A1–A6 contrast rules pass for every color pair introduced.
- [ ] B1–B5 focus rules: full Tab pass on changed screens; no clipped rings; overlay focus restore works.
- [ ] C1–C5 keyboard operability confirmed for changed interactions.
- [ ] D1–D6 names/roles/relationships: axe scan of changed routes = 0 serious/critical.
- [ ] E1–E2 targets ≥24px (≥44px on coarse pointer for primaries).
- [ ] F1 reduced-motion emulation checked if new animation added.
- [ ] G1 one `h1`, no skipped heading levels on changed pages.

## 4. Content (from `04-content-and-tone.md`)

- [ ] No banned labels ("Submit", "Click here", "Learn more", "OK").
- [ ] Buttons start with verb + object; destructive actions repeat label in confirm dialog.
- [ ] Empty/error states follow `[what] + [why] + [action]`.
- [ ] Sentence case; brand string is **Grow** (parent company AlmaBetter only where a legal name is required).

## 5. Responsive and edge cases

- [ ] Changed screens checked at 360px / 768px / 1280px / 1920px.
- [ ] Long-content stress: longest translated/real label does not overflow or wrap buttons.
- [ ] Loading and empty states do not shift layout (screenshot diff).
- [ ] Sticky header does not obscure focused elements (`scroll-mt`/scroll-padding OK).

## 6. Automated gates

- [ ] `npm run lint` passes.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.
- [ ] Grep gates from `03-accessibility.md` §Automated gate return 0 hits (PCRE focus, img alt, hex whitelist).
- [ ] Both themes (light/dark) visually spot-checked on changed screens.
