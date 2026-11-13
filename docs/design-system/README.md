# Grow Design System — Context and Goals

## Design intent

Grow's Polaris fellowship content site must be a token-driven, WCAG 2.2 AA system where every component is specified with explicit states so that any engineer can ship consistent, accessible screens without local design decisions.

## Brand context

- Product/brand: **Grow**
- Reference surface: https://grow.almabetter.com/fellowship-data-science/polaris (Polaris Data Science fellowship page used to verify brand context: course hero, program highlights, learning track, industry projects, hiring partners, fees, educators, FAQs)
- Audience: readers and knowledge seekers
- Product surface: content site
- Extraction diagnostics: audience and product-surface inference confidence was low; brand context has been verified against the live Polaris fellowship page (outcome-led hero, program facts, partner logos, placement proof — consistent with a reader/learner audience on a content surface).

## Goals

1. One semantic token layer for color, type, spacing, radius, shadow, and motion — no raw values in components.
2. Every component ships a complete state matrix: default, hover, focus-visible, active, disabled, loading, error.
3. Every accessibility rule is testable in implementation (pass/fail checks in [03-accessibility.md](03-accessibility.md)).
4. Fast delivery: engineers copy spec, not taste.

## Component density and priority

Known page component density guides documentation order and review effort:

| Priority | Component family | Density | Guide |
|---|---|---|---|
| 1 | Buttons | 38 | [02-components.md § Buttons](02-components.md#1-buttons) |
| 2 | Links | 24 | [02-components.md § Links](02-components.md#2-links) |
| 3 | Cards | 12 | [02-components.md § Cards](02-components.md#6-cards) |
| 4 | Lists | 3 | [02-components.md § Lists](02-components.md#3-lists) |
| 5 | Navigation | 1 | [02-components.md § Navigation](02-components.md#4-navigation) |
| Secondary | Inputs | 7 (app-wide) | [02-components.md § Inputs](02-components.md#5-inputs) |

## Document map

| File | Contents | Required output section |
|---|---|---|
| `README.md` | Context, goals, priority, quality gates | Context and goals |
| `01-foundations.md` | Design tokens and foundations | Design tokens and foundations |
| `02-components.md` | Anatomy, variants, states, responsive behavior | Component-level rules |
| `03-accessibility.md` | Requirements with testable acceptance criteria | Accessibility requirements |
| `04-content-and-tone.md` | Label, action, and tone standards with examples | Content and tone standards |
| `05-anti-patterns-and-migration.md` | Prohibited implementations and migration notes | Anti-patterns |
| `06-qa-checklist.md` | Pre-ship QA checklist | QA checklist |

## How to apply

1. Read [01-foundations.md](01-foundations.md) once; implement tokens exactly as specified (already wired in `frontend/app/globals.css`).
2. For each screen, pull component specs from [02-components.md](02-components.md) — do not re-derive states locally.
3. Gate every pull request with [06-qa-checklist.md](06-qa-checklist.md).

## Quality gates

- Every non-negotiable rule in these documents uses **must**.
- Every recommendation uses **should**.
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
