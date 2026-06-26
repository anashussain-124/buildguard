# Noor's Design Spec — BuildGuard AI

## Design Rationale

BuildGuard AI serves construction professionals who need to quickly understand contract risk without legal training. Every design decision prioritizes:

1. **Speed to insight** — Risk level must be scannable in under 2 seconds. Users are often on job sites, on mobile, under time pressure.
2. **Trust through clarity** — Legal documents are intimidating. The UI must feel calm, authoritative, and transparent. No dark patterns, no ambiguity.
3. **Accessibility as foundation** — Color is never the sole indicator of meaning (icons + text always accompany risk colors). All interactive targets are ≥44px. Contrast ratios meet WCAG AA minimums (4.5:1 for body text).
4. **Edge case empathy** — Empty states, loading states, error states, and partial data are designed with as much care as happy paths.
5. **Minimal cognitive load** — Progressive disclosure. Show the risk score first, details on demand. No walls of text. Tables over paragraphs.

### Theme

**Dark mode exclusively.** Background: `#020617` (slate-950). Surfaces: `#0F172A` (slate-900). Elevated: `#1E293B` (slate-800). This reduces eye strain for users who spend long hours reviewing contracts, gives the UI a premium/"security" feel, and makes risk colors (especially red/orange) pop with high visual impact.

---

## Color Palette

### Brand — Indigo

| Token    | Hex     | Tailwind           | Usage                |
|----------|---------|--------------------|----------------------|
| brand-50 | #EEF2FF | bg-indigo-50       | Light accent bg      |
| brand-100| #E0E7FF | bg-indigo-100      | Hover accent bg      |
| brand-200| #C7D2FE | bg-indigo-200      |                      |
| brand-300| #A5B4FC | bg-indigo-300      |                      |
| brand-400| #818CF8 | text-indigo-400    | Links, icons, nav    |
| brand-500| #6366F1 | bg-indigo-500      | Focus rings          |
| brand-600| #4F46E5 | bg-indigo-600      | **Primary buttons**  |
| brand-700| #4338CA | bg-indigo-700      | Button hover         |
| brand-800| #3730A3 | bg-indigo-800      | Button active        |
| brand-900| #312E81 | bg-indigo-900      |                      |

### Neutral — Slate (Dark Mode)

| Token      | Hex     | Tailwind           | Usage                        |
|------------|---------|--------------------|------------------------------|
| neutral-50 | #F8FAFC | text-slate-50      | High-emphasis headings       |
| neutral-100| #F1F5F9 | text-slate-100     | Primary body text            |
| neutral-200| #E2E8F0 | text-slate-200     | Card titles                  |
| neutral-300| #CBD5E1 | text-slate-300     | Body text                    |
| neutral-400| #94A3B8 | text-slate-400     | **Secondary text, meta**     |
| neutral-500| #64748B | text-slate-500     | Muted text, placeholders     |
| neutral-600| #475569 |                    |                              |
| neutral-700| #334155 | border-slate-700   | **Borders, dividers**        |
| neutral-800| #1E293B | bg-slate-800       | **Elevated surfaces**        |
| neutral-900| #0F172A | bg-slate-900       | **Card/section surfaces**    |
| neutral-950| #020617 | bg-slate-950       | **Page background**          |

### Risk-Level Colors (always paired with text label + icon)

| Level    | Background | Text       | Border     | Badge class      |
|----------|------------|------------|------------|------------------|
| Low      | #052E16    | #6EE7B7    | #065F46    | `.badge-low`     |
| Medium   | #451A03    | #FCD34D    | #92400E    | `.badge-medium`  |
| High     | #431407    | #FDBA74    | #9A3412    | `.badge-high`    |
| Critical | #4C0519    | #FDA4AF    | #9F1239    | `.badge-critical`|

Risk thresholds: **Low** 0-29, **Medium** 30-59, **High** 60-79, **Critical** 80-100

### Semantic

| Role    | Background | Text     | Border | Usage                    |
|---------|------------|----------|--------|--------------------------|
| Success | #064E3B    | #6EE7B7  | #065F46| Confirmation, completion |
| Warning | #78350F    | #FCD34D  | #92400E| Warnings, attention      |
| Error   | #4C0519    | #FDA4AF  | #9F1239| Destructive actions      |
| Info    | #1E3A5F    | #93C5FD  | #1E40AF| Informational            |

---

## Typography

- **Primary Font:** Inter (loaded via `next/font/google`)
- **Monospace:** JetBrains Mono (contract IDs, file references)
- **Fallback:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Scale

| Token     | Size  | Weight | Line-h | Letter-spacing | Usage               |
|-----------|-------|--------|--------|----------------|---------------------|
| Display   | 30px  | 800    | 1.2    | -0.02em        | Hero headings       |
| H1        | 24px  | 700    | 1.25   | -0.01em        | Page titles         |
| H2        | 20px  | 600    | 1.3    | -0.01em        | Section headings    |
| H3        | 16px  | 600    | 1.4    | normal         | Card titles         |
| Body-lg   | 18px  | 400    | 1.6    | normal         | Hero body           |
| Body      | 16px  | 400    | 1.5    | normal         | Paragraph text      |
| Body-sm   | 14px  | 400    | 1.5    | normal         | Labels, captions    |
| Caption   | 12px  | 500    | 1.4    | normal         | Badges, timestamps  |
| Mono      | 13px  | 400    | 1.4    | normal         | IDs, code           |

---

## Spacing System

4px base unit.

| Token     | Value |
|-----------|-------|
| space-1   | 4px   |
| space-2   | 8px   |
| space-3   | 12px  |
| space-4   | 16px  |
| space-6   | 24px  |
| space-8   | 32px  |
| space-10  | 40px  |
| space-12  | 48px  |
| space-16  | 64px  |

---

## Border Radius

| Token     | Value | Usage                        |
|-----------|-------|------------------------------|
| radius-sm | 4px   | Badges, small elements       |
| radius-md | 6px   | Small buttons                |
| radius-lg | 8px   | Buttons, inputs, table       |
| radius-xl | 12px  | Cards, modals, sections      |
| radius-full | 9999px | Pills, avatars             |

---

## Shadows (Elevated Dark Mode)

| Token     | Value                                                          |
|-----------|----------------------------------------------------------------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.3)                                    |
| shadow-md | 0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3) |
| shadow-lg | 0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.4) |
| shadow-xl | 0 20px 25px -5px rgba(0,0,0,0.6), 0 8px 10px -6px rgba(0,0,0,0.4) |

---

## Component Library

### Button

| Prop/Variant | States                                      | Spec                         |
|-------------|---------------------------------------------|------------------------------|
| Primary     | default, hover, active, disabled, loading   | bg brand-600 → hover brand-700, text white, border 2px transparent |
| Secondary   | default, hover, active, disabled            | bg transparent, border neutral-700, text neutral-200, hover border brand-500 + text brand-400 |
| Destructive | default, hover, active                      | bg transparent, border error, text error-text, hover bg error-bg |
| Ghost       | default, hover                              | bg transparent, text neutral-400, hover bg elevated + text neutral-100 |
| Sizes       | sm (36px), md (40px), lg (48px)            | Radius: lg (8px), transition: 150ms ease-out |

### Input

| State    | Spec                                                        |
|----------|-------------------------------------------------------------|
| Default  | height 40px, bg elevated, border neutral-700, text neutral-100, radius lg, 1px |
| Hover    | border neutral-600                                          |
| Focus    | border brand-500 + box-shadow 0 0 0 3px rgba(99,102,241,0.15) |
| Error    | border error + focus same with error color                  |
| Disabled | opacity 0.5, cursor not-allowed                             |

### Badge

| Variant   | Spec                                              |
|-----------|---------------------------------------------------|
| All       | inline-flex, padding 3px 10px, radius-full, font 12px/600, border 1px |
| Low       | bg risk-low-bg, text risk-low-text, border risk-low-border |
| Medium    | bg risk-medium-bg, text risk-medium-text, border risk-medium-border |
| High      | bg risk-high-bg, text risk-high-text, border risk-high-border |
| Critical  | bg risk-critical-bg, text risk-critical-text, border risk-critical-border |
| Neutral   | bg elevated, text neutral-400, border neutral-700  |
| Success/Info/Warning/Error | match semantic colors             |
| Sizes     | sm (11px) or default (12px)                        |

### Card

| Property     | Default | Hover              |
|-------------|---------|--------------------|
| Background  | bg-surface (#0F172A) | same         |
| Border      | 1px neutral-800 | neutral-700  |
| Radius      | 12px (radius-xl) | same           |
| Padding     | 24px   | same               |
| Shadow      | none   | shadow-md + translateY(-2px), 200ms |

### Table

| Element  | Spec                                                  |
|----------|-------------------------------------------------------|
| Wrapper  | border neutral-800, radius-xl, overflow-x auto        |
| Header   | bg surface, text 11px/600 uppercase, color neutral-500, padding 12px 24px |
| Row      | height 52px, border-b neutral-800, hover rgba(99,102,241,0.02) |
| Cell     | padding 12px 24px (desktop), 16px 24px (mobile as card) |

### Modal

| Element  | Spec                                                 |
|----------|------------------------------------------------------|
| Overlay  | fixed inset, bg rgba(0,0,0,0.6), z-index 200         |
| Dialog   | max-width 480px, radius-xl, bg surface, border 1px neutral-700, shadow-xl |
| Header   | padding 24px, border-b neutral-800                   |
| Body     | padding 24px, text neutral-400                       |
| Footer   | padding 16px 24px, border-t neutral-800, flex end    |
| Animation| opacity + scale(0.95→1), 300ms ease-out              |

### Toast

| Variant | Spec                                               |
|---------|----------------------------------------------------|
| All     | display flex, padding 12px 16px, radius-lg, shadow-lg, max-width 400px |
| Success | bg success-bg, border #065F46, text success-text   |
| Error   | bg error-bg, border #9F1239, text error-text       |
| Warning | bg warning-bg, border #92400E, text warning-text   |
| Info    | bg info-bg, border #1E40AF, text info-text         |
| Position| top-right, auto-dismiss 5s, role="alert"           |

### Tabs

| Element    | Spec                                                     |
|-----------|----------------------------------------------------------|
| Bar       | display flex, bg surface, border-b neutral-800           |
| Tab (active) | padding 12px 16px, color brand-400, border-bottom 2px brand-500 |
| Tab (default)| padding 12px 16px, color neutral-400, hover color neutral-200 + bg rgba(99,102,241,0.04) |
| Tab (disabled) | opacity 0.4, cursor not-allowed                    |

### Skeleton

| Property  | Spec                                                            |
|-----------|-----------------------------------------------------------------|
| Animation | shimmer: bg gradient slide, 1.5s ease-in-out infinite           |
| Gradient  | linear-gradient(90deg, bg-elevated 25%, bg-hover 50%, bg-elevated 75%) |
| Radius    | matches the component being skeletonized                        |

### File Upload Zone

| State    | Spec                                                       |
|----------|------------------------------------------------------------|
| Default  | border 2px dashed neutral-700, radius-xl, padding 48px 24px, text center, bg surface |
| Hover    | dashed → solid, border brand-500, bg rgba(99,102,241,0.04) |
| Drag-over| same as hover + transform scale(1.01)                      |
| Input    | `sr-only` (hidden), triggered by label or button           |

### Risk Gauge

| Property    | Spec                                                         |
|-------------|--------------------------------------------------------------|
| Type        | 180° semi-circular arc                                       |
| Size        | max-width 280px, SVG viewBox "0 0 200 120"                   |
| Needle      | animated on load, 1s ease-out                                |
| Background  | stroke neutral-800, width 18px                               |
| Score arc   | stroke risk-color (green → amber → rose → red)               |
| Center dot  | 6px risk-color circle + 3px bg-page circle                   |

---

## Micro-Interactions

| Purpose    | Duration | Easing                         |
|-----------|----------|--------------------------------|
| Color/opacity | 150ms | cubic-bezier(0, 0, 0.2, 1) |
| Transforms | 200ms   | cubic-bezier(0, 0, 0.2, 1)    |
| Modal/overlay | 300ms | cubic-bezier(0, 0, 0.2, 1)  |
| Skeleton  | 1.5s infinite | ease-in-out               |

---

## Responsive Behavior

| Breakpoint | Columns | Layout changes                          |
|-----------|---------|-----------------------------------------|
| < 640px   | 1 col   | Tables → stacked cards, stepper compact, full-width buttons |
| 640-1024  | 2-3 col | Two-column stats, side-by-side content  |
| > 1024px  | 3+ col  | Full grid, desktop table layout         |

---

## Accessibility Notes

1. **Color is never the sole indicator** — all risk levels have text labels and icons alongside color.
2. **Contrast ratios**: body text (#94A3B8 on #0F172A = 6.1:1, exceeds AA 4.5:1). Small text (#64748B on #0F172A = 4.7:1, meets AA).
3. **Focus indicators**: all interactive elements have 2px brand-500 focus ring with 2px page-bg offset.
4. **Interactive targets**: buttons, inputs, and links are minimum 40px height (some 44px) for touch targets.
5. **ARIA**: toasts have `role="alert"`, modals trap focus, progress bars have `role="progressbar"`.
6. **Keyboard**: all accordions, tabs, and modals are keyboard-navigable.

---

## Page Architecture

| Route         | Purpose                    | Key Components                          |
|---------------|----------------------------|-----------------------------------------|
| `/`           | Landing page               | Hero, features grid, how-it-works steps, pricing cards, CTA |
| `/dashboard`  | Contract list              | Stats cards, search bar, contract table with risk badges |
| `/upload`     | File upload                | 3-step stepper, drag-and-drop zone, submit with progress |
| `/analysis/[id]` | Risk report             | Risk gauge, red flags, clause accordion, recommendations, missing protections |
| `/auth/login` | Authentication             | Input fields, validation, submit        |
| `/auth/register` | Sign up                 | Form with validation                    |
| `/pricing`    | Plans                      | Pricing cards with feature lists        |

---

## Edge Case States (all pages)

| State    | Visual treatment                                           |
|----------|------------------------------------------------------------|
| Loading  | Skeleton shimmer cards or centered spinner with label      |
| Empty    | Dashed border card with icon, title, description, and CTA  |
| Error    | Red-tinted card (bg error-bg, border #9F1239) with retry button |
| Partial  | Some sections available, others show "Processing" badge     |

---

## File Inventory

Reference design artifacts generated alongside this spec:

| File | Purpose |
|------|---------|
| `BuildGuard Design System.html` | Complete interactive design system board with all components and tokens |
| `BuildGuard Landing Page.html` | Hero, features, how-it-works, pricing, CTA |
| `BuildGuard Dashboard.html` | Stats cards, search, contract table with risk badges, empty/loading/error states |
| `BuildGuard Analysis Report.html` | Full report: risk gauge, red flags, clause accordion, recommendations, missing protections |
| `BuildGuard Upload Page.html` | 3-step stepper, drag-drop zone, file selected state, processing animation |
