# Component-Level Rules

Design intent: each family below is a complete, copy-ready contract — anatomy, variants, all seven states, input behavior, responsive and edge-case handling. Section numbers are stable for cross-referencing; review priority follows known page density (buttons 38, links 24, cards 12, lists 3, navigation 1).

## Shared state definitions

Every interactive component **must** implement all seven states. Shared semantics:

| State | Requirement |
|---|---|
| default | Composed from semantic tokens only; meets contrast in both themes |
| hover | Visible change within `duration-instant` (150ms); never the only affordance |
| focus-visible | **Must** show `--ring` (global `:focus-visible` outline or component ring) with ≥3:1 contrast against adjacent colors; never suppressed |
| active | Distinct pressed treatment (`*:active` token or `shadow-glow`) |
| disabled | `disabled`/`aria-disabled` + `opacity-50` + `pointer-events-none`; **must** remain readable (≥4.5:1 is waived only for `disabled:` per WCAG 1.4.3 exception) |
| loading | `aria-busy="true"`, input blocked, spinner present, layout reserved (see per-family rules) |
| error | `aria-invalid="true"` + `--error` border/text + message linked with `aria-describedby` (inputs/forms); action errors **must** render in a live region |

Keyboard baseline (all families): Tab/Shift+Tab move focus; Enter/Space activate buttons and links (Space on links is not expected); Escape closes overlays; arrow keys move within roving-tabindex groups (menus, tabs, lists with `role="listbox"`). Pointer and touch behavior is specified per family.

---

## 1. Buttons

Density rank: 1 (38 per page). Implementation: `components/ui/button.tsx`.

### Anatomy

`[start icon?] [label] [end icon?]` inside a `rounded-md` (10px) hit area; label `text-sm font-medium`; gap `space.5` (8px, `gap-2`).

### Variants

| Variant | Tokens | Use |
|---|---|---|
| `default` | `bg-primary text-primary-foreground shadow-sm`, hover `bg-primary-hover`, active `bg-primary-active` | Primary CTA, one per view |
| `strong` | `bg-surface-strong text-surface-strong-foreground`, hover `bg-strong-hover`, active `bg-strong-active` | Positive/secondary CTA (teal, always dark label) |
| `destructive` | `bg-destructive text-destructive-foreground`, hover/active darker ramp | Delete/irreversible actions — **must** pair with a descriptive label or confirm dialog |
| `outline` | `border-input bg-transparent text-foreground`, hover `bg-accent` | Secondary emphasis |
| `secondary` | `bg-secondary text-secondary-foreground`, hover `bg-secondary-hover` | Neutral fills (toolbars, tables) |
| `ghost` | transparent, hover `bg-accent` | Low-emphasis actions (icon buttons, rows) |
| `link` | `text-primary underline-offset-4`, hover underline | Inline action inside text |

Sizes: `default` h-9 (36px), `sm` h-8, `lg` h-10, `icon` size-9. Touch-critical primary actions **should** add the `.touch-target` utility (44px min) on coarse pointers; all targets **must** be ≥24×24 (WCAG 2.5.8).

### States (all variants)

| State | Behavior |
|---|---|
| default | Token composition above |
| hover | Ramp token (`*-hover`); transition `colors`/`shadow` at `duration-instant` |
| focus-visible | `ring-[3px] ring-ring` (plus global outline where not overridden) — visible in both themes |
| active | `*-active` token; on dark surfaces `shadow-glow` **should** accent primary/strong |
| disabled | `disabled:opacity-50 disabled:pointer-events-none`; label must stay legible |
| loading | `loading` prop: spinner (`Loader2`, `animate-spin`, `aria-hidden`) rendered before label, `aria-busy="true"`, control disabled. Label **must not** be removed (accessible name preserved). Container **must** reserve width (`min-w-*` or `w-full`) so siblings do not jump |
| error | Buttons do not enter an error state visually; failed actions **must** surface the message in an `aria-live="polite"` region adjacent to the button group, and the button **must** return to default (not disabled) after failure |

### Interactions

- **Keyboard:** Tab focuses; Enter/Space activates; focus ring never hidden behind sticky headers (offset via container padding).
- **Pointer:** single click activates; hover preview only — no hover-dependent functionality.
- **Touch:** `onPointerDown` must not be required for activation; `touch-target` on mobile primaries; 300ms double-tap zoom must not be blocked (`touch-action: manipulation` via `transition` classes is acceptable).

### Responsive and edge cases

- Full-width (`w-full`) **must** be used for primary actions on screens <640px when stacked with other actions.
- Long labels: `whitespace-nowrap` + `truncate` on the label span; if truncation would occur, the label **should** be shortened (see content guide) — a button **must never** wrap to two lines.
- Icon-only buttons **must** carry `aria-label` (see §4/§5) and **should** use `variant="ghost|outline"` + `size="icon"`.
- Loading inside async forms: disable the whole form, **should** focus the first invalid field on error.

### Accessibility acceptance criteria

- PASS: every button shows a focus indicator with ≥3:1 contrast against page background in both themes (test: Tab to it, screenshot, measure ring vs background).
- PASS: `loading` button announces busy (`aria-busy="true"` in DOM) and accessible name equals the non-loading name.
- PASS: no button label below 4.5:1 against its fill (test: computed color pair from §3 tables).
- FAIL: any button using `focus:` instead of `focus-visible:` styles, or `outline-none` without a ring.

---

## 2. Links

Density rank: 2 (24 per page). Implementation: `components/ui/link.tsx` (`AppLink`, `linkVariants`).

### Anatomy

Anchor (`next/link` wrapper) + optional trailing external indicator. No layout box unless used as a nav/CTA pill.

### Variants

| Variant | Tokens | Use |
|---|---|---|
| `default` | `text-foreground`, hover `text-primary` + underline | In-content navigation |
| `muted` | `text-muted-foreground`, hover `text-foreground` | Footer, secondary lists |
| `primary` | `text-primary`, always `underline-offset-4`, underline on hover | Prominent inline links |
| `inverse` | `text-inverse` | Accent links on dark panels only (never on white/red/teal) |
| `nav` | pill container classes (`h-9 rounded-full px-4 text-sm font-medium text-muted-foreground`, hover `text-primary`) | Header navigation; active page gets `aria-current="page"` + `bg-primary/10 text-primary font-semibold` |
| `bare` | no color/underline of its own — caller styles | Logo, icon links, button children (`Button asChild`) |

### States

| State | Behavior |
|---|---|
| default | Variant tokens; underline appears on hover for `default`/`primary` (never removed for `primary` in printed/forced-colors mode) |
| hover | Color shift + underline within `duration-instant` |
| focus-visible | Global 2px `--ring` outline, offset 2px — **must** be visible (links are high-density; this is the most-tested rule) |
| active | `text-primary-active` while pressed (`active:text-primary-active`) for `primary`/`default` |
| disabled | Rendered links **must not** exist — remove or render as `text-muted-foreground` non-interactive `<span>` with `aria-disabled="true"` |
| loading | Client-side navigations **should** rely on Next.js Router; if a custom loading affordance is used it **must** set `aria-busy` on the destination container, not the link |
| error | Dead/404 destinations **must not** ship; error handling belongs to the page (see empty/error states in §3) |

### Interactions

- **Keyboard:** Tab enters; Enter activates; focus must scroll the link into view (`scroll-margin` handled by sticky header offset `scroll-mt-16` on targets).
- **Pointer:** hover changes color only; no underline on hover-leave animation delays >150ms.
- **Touch:** link rows in lists **must** have ≥24px effective target (padding counts); icon-only links **must** use `.touch-target` or `p-2` wrappers.
- **External links:** absolute `http(s)://` hrefs **must** open with `target="_blank" rel="noopener noreferrer"` (handled by `AppLink`) and append visually-hidden `(opens in new tab)`.

### Responsive and edge cases

- Long URLs/text: parent gets `break-words`; link text **must** remain distinguishable without color alone in underlined form (color + underline for `primary`).
- Same-page anchors: focus target **should** have `tabindex="-1"` + `scroll-mt-*` so keyboard focus lands correctly.
- Empty state: if a list of links would be empty, render the page empty-state (§3), never a bare heading over whitespace.

### Accessibility acceptance criteria

- PASS: every link shows the global focus outline on Tab (automated: axe `focus-order-semantics` + manual Tab pass).
- PASS: 100% of external links have `rel="noopener"` (grep gate: `target="_blank"` without `rel` fails).
- PASS: link text is descriptive out of context (test: read-aloud of "Read more" links fails §4 rules).
- FAIL: any raw `<a href>` for internal routes (must use `AppLink`/`next/link`).

---

## 3. Lists

Density rank: 4 (3 per page). No dedicated component — patterns below are the contract for story lists, hiring-partner lists, course lists, and dashboard rows.

### Anatomy

`ul/ol > li`. Row item: `[avatar/logo 40px] [content column: title text-md + meta text-sm text-muted-foreground] [trailing action?]`. Group spacing: `space.7` (12px) between rows; row internal gap `space.5` (8px).

### Variants

| Variant | Tokens | Use |
|---|---|---|
| static | plain rows, `border-b border-border last:border-0` | Read-only lists (stats, partners) |
| interactive | each row is a `AppLink`/button: `rounded-lg px-3 py-3 hover:bg-accent` | Navigable rows (stories, courses) |
| selection | `role="listbox"`/`option` or checkbox rows; selected = `bg-accent` + `aria-selected="true"` | Multi-select (filters) |
| ordered | `<ol>` with `list-decimal` + `text-muted-foreground` markers | Process steps ("How we get you hired") |

### States (interactive rows)

| State | Behavior |
|---|---|
| default | Tokens above; title `text-md`, meta `text-sm text-muted-foreground` |
| hover | `hover:bg-accent` across the whole row; trailing affordance (chevron) shifts ≤2px |
| focus-visible | Row outline via global ring — the **entire row** must be the focus target (row is the anchor) |
| active | `active:bg-accent` / pressed |
| disabled | Row `aria-disabled="true"`, opacity-50, no pointer events |
| loading | Skeleton rows (`bg-muted animate-pulse rounded-lg`, same height as final row) — **must** preserve list height to avoid layout shift |
| error | Failed list fetch **must** render an inline error row: `text-error text-sm` + Retry button (§1) in the same list container, `role="alert"` |

### Interactions

- **Keyboard:** Tab through rows when each row is a link/button; when rows form a toolbar of controls, use arrow keys with roving tabindex. Enter activates a row.
- **Pointer:** whole row clickable; text selection inside interactive rows **should** remain possible (don't block `selectstart`).
- **Touch:** row height ≥44px on coarse pointers (`py-3` gives ≥44 with content); pressed state visible.

### Responsive and edge cases

- Long content: title `line-clamp-2`, meta `line-clamp-1`; trailing action wraps below 480px (`flex-col sm:flex-row` pattern) — never truncate the trailing action label.
- Overflow: horizontal logo/partner strips **must** use `overflow-x-auto` + `snap-x` with visible scrollbar focus styles, and `aria-label` on the scroll region.
- Empty state: `text-sm text-muted-foreground` + one primary action (`Button` §1) — example: "No placement stories yet. Download the placement report." **must not** be a bare zero-count screen.
- Very long lists (100+ rows): **should** paginate or virtualize; pagination **must** expose `aria-current="page"`.

### Accessibility acceptance criteria

- PASS: every interactive list exposes correct roles (`ul > li`; listbox pattern if selectable) — test: axe `list` rules.
- PASS: skeleton loading state has same computed height as loaded state (test: screenshot diff before/after).
- PASS: empty state contains a focusable action (Tab reaches it).

---

## 4. Navigation

Density rank: 5 (1 per page): the primary navigation landmark — header nav (`components/layout/navbar.tsx`) and section navigation (filter tabs / in-page nav; admin rail `components/admin/sidebar.tsx`).

### Anatomy

Landmark: `<header>` + `<nav aria-label="Primary">`; items are `AppLink variant="nav"` pills or sidebar rows. Mobile: `Sheet` drawer with full-width rows.

### Variants

| Variant | Tokens | Use |
|---|---|---|
| header pill | `h-9 rounded-full px-4 text-sm font-medium text-muted-foreground`, active `bg-primary/10 text-primary font-semibold` + `aria-current="page"` | Desktop header |
| drawer row | `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent`, active same as pill | Mobile sheet |
| sidebar row | `SidebarMenuButton` with `isActive`, `--sidebar-accent` hover, `--primary` active + `aria-current="page"` | Admin rail |
| filter tabs | `role="tablist"` buttons: `rounded-xl px-4 h-9 text-sm`, active `bg-primary text-primary-foreground` | Placements filters (By Experience/Domain/Background) |

### States (per item)

| State | Behavior |
|---|---|
| default | `text-muted-foreground` (inactive), active item per variant |
| hover | `text-primary` + `bg-primary/5` (header) / `bg-accent` (drawer/sidebar) |
| focus-visible | Global `--ring` outline — **must** be visible over the sticky header's `backdrop-blur` |
| active/pressed | Item-specific pressed token |
| disabled | Current page is `aria-current="page"` — **not** disabled; genuinely unavailable items **must** be omitted, not rendered disabled |
| loading | Route change **should** show the app-level progress affordance; nav items themselves do not enter loading spinners |
| error | Auth-gated destinations: unauthenticated user **must** see the item respecting session state (role-aware rendering), never a dead link |

### Interactions

- **Keyboard:** Tab moves between items in DOM order; filter tabs follow the tabs pattern (←/→ move, Enter/Space activate, `aria-selected`); Escape closes the mobile Sheet and returns focus to the trigger; focus **must** return to the trigger on close.
- **Pointer:** hover preview; click navigates; sticky header must not obscure the focused item (`scroll-padding-top: 64px` on `html`).
- **Touch:** hamburger/avatar targets use `.touch-target`; drawer rows ≥44px; no hover-only affordances (active state must be persistently visible — `aria-current` styling).

### Responsive and edge cases

- Breakpoints: pills visible ≥1024px (`lg`); Sheet below; logo/tagline collapse (`hidden sm:flex`).
- Long nav labels: max 3 words (§4); overflow **must** wrap in the drawer, never shrink below `text-sm`.
- Resize while open: closing the Sheet on `lg`+ resize **should** restore body scroll lock.
- Empty nav (no session): show Sign In entry — nav **must never** render zero actions on desktop.

### Accessibility acceptance criteria

- PASS: exactly one `aria-current="page"` per nav landmark (test: DOM query returns 1 on each route).
- PASS: mobile Sheet traps focus, closes on Escape, restores focus to trigger (manual keyboard test).
- PASS: `<nav>` landmarks are labelled (`aria-label="Primary"` etc.) — axe `landmark-unique`.
- FAIL: navigation driven by `focus:` styles without `focus-visible:` (pre-migration anti-pattern).

---

## 5. Inputs (secondary)

Implementation: `components/ui/input.tsx`, `textarea.tsx`, plus select/checkbox/switch primitives.

### Anatomy

Label (`Label`, `text-sm font-medium`) + control (`h-9 rounded-md border-input px-3 text-base`) + optional hint/error (`text-xs`, id-linked).

### States

| State | Behavior |
|---|---|
| default | `border-input` (≥3:1), `text-base`, placeholder `text-muted-foreground` |
| hover | `hover:border-foreground/40` (subtle) |
| focus-visible | `ring-[3px] ring-ring` + `border-ring` |
| active/caret | caret `caret-primary` |
| disabled | `disabled:opacity-50 disabled:cursor-not-allowed`, keeps label |
| readonly | No visual difference from default except `cursor-default` + `bg-muted` |
| loading | `aria-busy` on the field wrapper + trailing spinner slot; value not editable |
| error | `aria-invalid="true"` → `border-error` + `ring ring-error/40`; message below with `id` referenced by `aria-describedby`; icon optional (`text-error`) |

### Interactions

- **Keyboard:** standard text editing; Tab/Shift+Tab; Escape does not clear (native). Custom controls (select, switch) must implement their primitives' patterns.
- **Pointer:** click focuses + selects; double-click selects word.
- **Touch:** ≥44px height on coarse pointers (`min-h-11 max-md:` or `.touch-target` on wrappers); inputs **must not** zoom the page on focus: controls render at `text-base` (16px, meets the iOS no-zoom threshold), the viewport **must** keep `maximum-scale` unset, and `user-scalable=no` is prohibited.

### Responsive and edge cases

- Long content: `Textarea` grows (`field-sizing-content`, `min-h-16`); inputs scroll natively.
- Overflow: `min-w-0` in flex rows to prevent blowout.
- Empty/optional: optional fields **must** be marked (`Optional` suffix), not implied.
- Autofill: `autocomplete` attributes **must** be correct (`email`, `name`, `one-time-code` for OTP).

### Accessibility acceptance criteria

- PASS: every invalid field has `aria-invalid="true"` and `aria-describedby` pointing to visible error text (automated: form submit with empty required field).
- PASS: label programmatically associated (`for`/`id` or wrapping) — axe `label`.
- PASS: error text contrast ≥4.5:1 (`--error` vs background, both themes).

---

## 6. Cards

Density rank: 3 (12 per page). Implementation: `components/ui/card.tsx`.

### Anatomy

`Card` (`bg-card rounded-lg border py-6 shadow-card`, gap `2×space.7`) → `CardHeader` (gap `space.4`) → `CardTitle` (`text-xl font-semibold`) → `CardDescription` (`text-sm text-muted-foreground`) → `CardContent` (`px-6`) → `CardFooter`.

### States

| State | Behavior |
|---|---|
| default | `bg-card border-border shadow-card rounded-lg` |
| hover | Only interactive cards: `.card-hover` (lift 2px + `shadow-md` gray glow, `shadow.4`), `duration-fast` |
| focus-visible | Interactive cards are wrapped/contain a link or button — focus lands on the action, with ring visible against card surface (ring vs `#ffffff`/`#1f1f1f` ≥3:1 in both themes) |
| active | Pressed: no lift, `shadow-card` retained |
| disabled | Non-interactive cards are not disabled; interactive cards **must** use an inner button/link for actions rather than a disabled card |
| loading | `Card`-shaped skeleton (`bg-muted rounded-lg` blocks) matching final heights |
| error | Card-level error content: `text-error text-sm` + Retry (§1) inside `CardContent`, `role="alert"` |

### Responsive and edge cases

- Long content: title `line-clamp-2`; description `line-clamp-3`; content scrolls only if the card is in a fixed-height grid cell.
- Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[2×space.7]` — cards **must** stretch equally (`items-stretch`), internal footers pin with `mt-auto`.
- Empty state: cards **must** not render header-only shells; use the empty-state pattern from §3.
- Nested cards prohibited (a Card inside a Card).

### Accessibility acceptance criteria

- PASS: card titles use heading levels semantically (`h3` etc.), not just `CardTitle` styling — test: heading outline per page.
- PASS: interactive card hover state also reachable/visible on focus-visible.
- FAIL: card without `rounded-lg` (e.g. `rounded-2xl`/bare `rounded`/pill `rounded-xl` on a surface) or missing `shadow-card`.
