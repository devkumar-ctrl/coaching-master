# Accessibility Requirements and Testable Acceptance Criteria

Target: **WCAG 2.2 AA**. Every rule below is phrased as a pass/fail check that can be run against the implementation.

## 1. Color and contrast

| # | Rule (must) | Test (pass/fail) |
|---|---|---|
| A1 | Normal text **must** be ≥4.5:1 against its background; large text (≥24px or ≥18.66px bold) ≥3:1 | Compute pair from `01-foundations.md` §3 tables; FAIL if pair missing from approved table |
| A2 | Text on `surface.raised` (`#f00037`) **must** be ≥18.66px bold or ≥24px, otherwise use `--primary` (`#e60035`) as the surface | Inspect computed font-size/weight + background; FAIL on 14px white text over `#f00037` |
| A3 | Text on `surface.strong` (`#00e8bb`) **must** be `#1f1f1f`; white on teal is prohibited | Grep/DOM: any `text-primary-foreground`/white on `bg-surface-strong` fails |
| A4 | `text-inverse` (`#cccccc`) **must** appear only on dark panels (`#000000`/`#1f1f1f`); never on white, red (`#f00037`), or teal (`#00e8bb`); light-theme low-emphasis text uses `--muted-foreground` | Contrast check vs actual background; FAIL if <4.5 |
| A5 | Interactive boundaries (inputs, outline buttons, toggles) **must** use `border-input` (≥3:1) | Grep: `border-border` on interactive controls fails |
| A6 | Charts **must** use the approved chart palette (all ≥3:1 vs page) | Contrast check of each series color vs `--background` |

## 2. Focus visibility

| # | Rule (must) | Test |
|---|---|---|
| B1 | Every interactive element **must** show a visible focus indicator (global `:focus-visible` outline 2px `--ring` offset 2px, or component ring ≥3px) | Tab through page; screenshot each focus stop; FAIL if indicator invisible or <3:1 vs adjacent colors |
| B2 | No component **may** use `outline-none`/`outline-hidden` without a replacement ring | Grep gate: `outline-none` without `focus-visible:ring` on same element fails |
| B3 | No component **may** style focus with `focus:` only (mouse-focus styles) for keyboard affordances | Grep gate: PCRE `(?<![-a-z])focus:` in `frontend/app`, `frontend/components` fails (see §Automated gate) |
| B4 | Focus indicators **must not** be clipped by sticky headers/overflow containers | Tab to first/last item under `header.sticky`; FAIL if ring cut off |
| B5 | Focus **must** be restored to the trigger when an overlay (Sheet, Dialog, Dropdown) closes | Keyboard test: Escape → focus lands on trigger |

## 3. Keyboard operation

| # | Rule (must) | Test |
|---|---|---|
| C1 | All actions operable by keyboard alone | Unplug pointer; complete primary task (navigate, submit form, open menu) |
| C2 | Buttons activate on Enter and Space; links on Enter | DOM/keyboard test per control |
| C3 | Menus/tabs/lists implement roving arrow-key patterns with correct `aria-*` | Manual + axe `aria-*` rules |
| C4 | No keyboard traps | Tab cycles through the whole page; modal focus stays inside while open but exits on close |
| C5 | Mobile Sheet/Dialog traps focus while open (`aria-modal`, focus wrap) | Tab ×N inside open Sheet; focus must not leave it |

## 4. Names, roles, relationships

| # | Rule (must) | Test |
|---|---|---|
| D1 | Icon-only controls **must** have accessible names (`aria-label` or sr-only text) | axe `button-name`, `link-name` — 0 violations |
| D2 | Form controls **must** have programmatic labels; errors `aria-invalid` + `aria-describedby` | axe `label`; submit-empty test shows linked error |
| D3 | Nav landmarks **must** be labelled; one `aria-current="page"` per landmark | axe `landmark-unique`; DOM count = 1 |
| D4 | Images **must** have `alt` (empty `alt=""` only when decorative) | Grep gate: `<img` without `alt=` fails |
| D5 | External links **must** have `rel="noopener"` and sr-only "(opens in new tab)" | Grep + DOM check |
| D6 | Loading states **must** expose `aria-busy="true"`; async errors **must** announce via `role="alert"`/`aria-live` | DOM check during fetch |

## 5. Target size and spacing

| # | Rule (must) | Test |
|---|---|---|
| E1 | Pointer targets **must** be ≥24×24 CSS px (WCAG 2.5.8) | Computed size of every button/link hit area |
| E2 | Touch-critical primaries (header CTA, drawer rows, icon links) **should** be ≥44×44 on coarse pointers | Emulate `pointer: coarse`; measure |
| E3 | Layout **must not** rely on spacing values outside the scale (`01-foundations.md` §4) | Grep for arbitrary `p-[…]`/`gap-[…]` not referencing `var(--space-*)` |

## 6. Motion

| # | Rule (must) | Test |
|---|---|---|
| F1 | All animation **must** respect `prefers-reduced-motion` | Emulate reduced motion; FAIL if transforms/parallax continue |
| F2 | Interactive transitions **must** be ≤200ms (`duration-instant`/`fast`) | Computed `transition-duration` on hover states |
| F3 | Ambient/autoplaying motion **must** run at `duration-slow` (1400ms) or slower and stop under reduced motion or expose a pause; looping decoration >5s without pause FAILs | Page audit + reduced-motion emulation |

## 7. Page-level

| # | Rule (must) | Test |
|---|---|---|
| G1 | One `<h1>` per page; heading levels never skip | axe `heading-order`, `page-has-heading-one` |
| G2 | Landmark structure: `banner`/`navigation`/`main`/`contentinfo` | axe `landmark-one-main`, `region` |
| G3 | Page language set (`lang="en"`) and titles unique per route | axe `html-has-lang`, `document-title` |
| G4 | axe-core scan of each key route (`/`, `/auth/signin`, `/admin`, `/dashboard/*`) **must** report 0 serious/critical issues | Run axe in CI or DevTools; attach report |

## Automated gate (must pass in CI)

```
grep -rnP '(?<![-a-z])focus:' frontend/app frontend/components --include='*.tsx'   → 0 hits (PCRE lookbehind excludes focus-visible/focus-within/has-focus)

# <img> tags missing alt= (multiline-safe: scans whole tags, not single lines)
perl -0777 -ne 'while (/<img\b[^>]*>/gs) { print "$ARGV\n" unless $& =~ /\balt=/ }' \
  $(find frontend/app frontend/components -name '*.tsx')   → 0 hits

# Raw hex in tsx — only these whitelisted files are allowed:
#   components/meetings/daily-meeting.tsx  (Daily.co SDK theme requires hex values)
#   components/ui/chart.tsx                (Recharts default-markup CSS selectors, not brand UI)
grep -rnE '#[0-9a-fA-F]{3,8}' frontend/app frontend/components --include='*.tsx'   → only the 2 whitelisted files
```
