# Content and Tone Standards

Voice: concise, confident, implementation-focused. The UI speaks like a senior engineer handing over a spec — short strings, concrete nouns, zero filler.

## 1. General rules

1. Labels **must** be specific and descriptive; banned: "Click here", "Submit", "Learn more", "OK", "Manage", "Item", "TBD".
2. Actions **must** start with a verb and name their object: "Download placement report", not "Download".
3. One primary action label per view — two buttons **must not** share the same text with different outcomes.
4. Sentence case for all labels, buttons, headings ("Placement report", not "Placement Report" or "PLACEMENT REPORT"). Product nouns keep brand casing ("Grow"; parent company "AlmaBetter" where a legal/company name is required).
5. Numbers **should** use tabular presentation consistent with the placements style: `6,000+`, `8 LPA`, `4.6/5`.
6. Errors **must** say what happened and what to do next; never expose stack traces or raw codes.

## 2. Buttons (density 1)

| Context | Use | Don't |
|---|---|---|
| Primary CTA | "Explore courses", "Download placement report" | "Submit", "Continue" |
| Destructive | "Delete course", "Remove student" | "Yes", "OK", "Confirm" |
| Loading | Same label as default (spinner added) | Changing label to "Please wait…" (breaks width + name stability) |
| Retry | "Retry", "Reload data" | "Try again later" |

Destructive buttons **must** be paired with a confirm dialog whose title repeats the action ("Delete this course?") and whose confirm button uses the destructive variant with the same verb.

## 3. Links (density 2)

- Link text **must** make sense out of context (screen-reader link lists are scanned alphabetically): "View Priya's placement story", not "Read more".
- Same destination repeated on a page: use the full descriptive label every time — ambiguous "here"/"this" anchors are prohibited.
- Footer/legal links **must** use exact page names: "Privacy policy", "Terms of service", "Cookie policy".

## 4. Lists and navigation (density 4 / 5)

- Nav items **must** be ≤3 words: "Training programs", "Faculty", "Dashboard".
- Filter tabs **must** be parallel noun phrases: "By experience", "By domain", "By background".
- Empty states **must** follow: `[what's empty] + [why/next step] + [action]`.
  - Good: "No placement stories match these filters. Clear filters to see all 6,000+ stories." [+ `Clear filters` button]
  - Bad: "No data."
- Loading copy **should** be absent (skeletons preferred); if needed: "Loading placement stories…".
- Error copy pattern: "We couldn't load placement stories. Check your connection and retry." [+ `Retry`]

## 5. Forms and inputs (secondary density)

- Labels are nouns ("Work email"), hints are short sentences ("Used for your placement report"), errors name the fix:
  - "Enter a valid email address."
  - "Password must be at least 8 characters."
- Optional fields **must** be marked `Optional` rather than assuming omission is understood.
- Placeholders **must not** replace labels (they disappear on input and fail contrast rules often).

## 6. Tone examples

| Bad | Good |
|---|---|
| "Oops! Something went wrong 😅" | "We couldn't save your changes. Retry?" |
| "Are you sure?" (dialog title) | "Delete 'Data Science 101'?" |
| "Submit" | "Send application" |
| "You are not authorized to perform this action" | "You need admin access to view this page. Ask an admin to invite you." |
| "0 results found!" | "No hiring partners match this search." |

## 7. Formatting

- Punctuation: sentence-style periods in helper/error text; no periods on button labels or single-word nav items.
- Emoji **must not** be used as the only indicator of state or meaning (decorative use only, sparingly).
- Dates: `12 Oct 2026`; ranges: `9AM–6PM`.
