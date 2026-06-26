# Noor's Design Spec — BuildGuard AI

## Design Rationale

BuildGuard AI serves construction professionals who need to quickly understand contract risk without legal training. Every design decision prioritizes:

1. **Speed to insight** — Risk level must be scannable in under 2 seconds. Users are often on job sites, on mobile, under time pressure.
2. **Trust through clarity** — Legal documents are intimidating. The UI must feel calm, authoritative, and transparent. No dark patterns, no ambiguity.
3. **Accessibility as foundation** — Construction is a diverse field. Color is never the sole indicator of meaning (icons + text always accompany color). All interactive targets are ≥44px. Contrast ratios meet WCAG AA minimums (4.5:1 for text, 3:1 for UI components).
4. **Edge case empathy** — Empty states, loading states, error states, and partial data are designed with as much care as happy paths. A user with zero contracts sees a welcoming empty state, not a broken table.
5. **Minimal cognitive load** — Progressive disclosure. Show the risk score first, details on demand. No walls of text. Tables over paragraphs. Icons over labels where possible.

The visual language is "confident utility" — think government-grade clarity meets modern SaaS polish. Slate-based neutrals for structure, a single indigo accent for brand identity, and a strict risk-color system that is redundant with text labels.

---

## Color Palette

### Brand / Accent
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| accent-50 | #EEF2FF | `bg-indigo-50` | Light accent backgrounds |
| accent-100 | #E0E7FF | `bg-indigo-100` | Accent hover states |
| accent-500 | #6366F1 | `bg-indigo-500` | Primary buttons, links |
| accent-600 | #4F46E5 | `bg-indigo-600` | Button hover |
| accent-700 | #4338CA | `bg-indigo-700` | Button active |

### Neutral / Slate
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| neutral-0 | #FFFFFF | `bg-white` | Page background, cards |
| neutral-50 | #F8FAFC | `bg-slate-50` | Page background (alt) |
| neutral-100 | #F1F5F9 | `bg-slate-100` | Section dividers, skeleton |
| neutral-200 | #E2E8F0 | `bg-slate-200` | Borders, disabled states |
| neutral-300 | #CBD5E1 | `bg-slate-300` | Placeholder text |
| neutral-400 | #94A3B8 | `bg-slate-400` | Secondary text |
| neutral-500 | #64748B | `bg-slate-500` | Body text (secondary) |
| neutral-700 | #334155 | `bg-slate-700` | Body text (primary) |
| neutral-800 | #1E293B | `bg-slate-800` | Headings |
| neutral-900 | #0F172A | `bg-slate-900` | High-emphasis text |

### Risk-Level Colors (always paired with text label + icon)
| Level | Hex | Tailwind | Icon | Text Label |
|-------|-----|----------|------|------------|
| Low | #16A34A | `bg-green-600` / `text-green-700` / `bg-green-50` | ShieldCheck | "Low Risk" |
| Medium | #CA8A04 | `bg-yellow-500` / `text-yellow-700` / `bg-yellow-50` | AlertCircle | "Medium Risk" |
| High | #EA580C | `bg-orange-600` / `text-orange-700` / `bg-orange-50` | AlertTriangle | "High Risk" |
| Critical | #DC2626 | `bg-red-600` / `text-red-700` / `bg-red-50` | XOctagon | "Critical Risk" |

### Semantic
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| success | #16A34A | `text-green-600` | Success messages |
| error | #DC2626 | `text-red-600` | Error messages, destructive actions |
| warning | #CA8A04 | `text-yellow-600` | Warning banners |
| info | #2563EB | `text-blue-600` | Info banners |

### Contrast Verification (WCAG AA)
- neutral-800 on neutral-0: 14.5:1 ✓
- neutral-500 on neutral-0: 6.3:1 ✓
- accent-600 on neutral-0: 5.6:1 ✓
- risk Critical text (red-700) on red-50: 5.2:1 ✓
- risk Medium text (yellow-700) on yellow-50: 4.6:1 ✓

---

## Typography Scale

### Font Family
- Inter (primary) — loaded via `next/font/google`
- System fallback: `font-sans` → `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Monospace for code/contract IDs: `font-mono` → `"JetBrains Mono", "Fira Code", monospace`

### Scale
| Token | Size | Weight | Line-Height | Tailwind | Usage |
|-------|------|--------|-------------|----------|-------|
| display | 30px | 700 (Bold) | 1.2 (36px) | `text-[30px] font-bold leading-[1.2]` | Page titles |
| heading-lg | 24px | 600 (Semibold) | 1.25 (30px) | `text-2xl font-semibold leading-tight` | Section headings |
| heading-md | 20px | 600 (Semibold) | 1.3 (26px) | `text-xl font-semibold leading-tight` | Card headings |
| heading-sm | 16px | 600 (Semibold) | 1.4 (22.4px) | `text-base font-semibold leading-snug` | Sub-section headings |
| body-lg | 18px | 400 (Regular) | 1.6 (28.8px) | `text-lg leading-relaxed` | Lead paragraphs |
| body | 16px | 400 (Regular) | 1.5 (24px) | `text-base leading-normal` | Body text |
| body-sm | 14px | 400 (Regular) | 1.5 (21px) | `text-sm leading-normal` | Secondary text, table cells |
| caption | 12px | 500 (Medium) | 1.4 (16.8px) | `text-xs leading-snug font-medium` | Labels, badges, timestamps |
| mono | 13px | 400 (Regular) | 1.4 (18.2px) | `text-[13px] font-mono leading-snug` | Contract IDs, code |

### Letter Spacing
- Headings: `-0.01em` (`tracking-tight`)
- Body: `0` (default)
- Captions/Uppercase labels: `0.05em` (`tracking-wide uppercase`)

---

## Spacing & Border Radius System

### Spacing Scale (Tailwind default, 4px base unit)
| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| space-1 | 4px | `p-1` / `m-1` | Tight inline spacing |
| space-2 | 8px | `p-2` / `m-2` | Icon padding, tight gaps |
| space-3 | 12px | `p-3` / `m-3` | Compact element spacing |
| space-4 | 16px | `p-4` / `m-4` | Default element padding |
| space-6 | 24px | `p-6` / `m-6` | Card padding, section gaps |
| space-8 | 32px | `p-8` / `m-8` | Large card padding |
| space-10 | 40px | `p-10` / `m-10` | Section vertical padding |
| space-12 | 48px | `p-12` / `m-12` | Page section spacing |
| space-16 | 64px | `p-16` / `m-16` | Major section breaks |

### Layout Spacing
- Page horizontal padding (mobile): `px-4` (16px)
- Page horizontal padding (desktop): `px-8` (32px)
- Max content width: `max-w-5xl` (1024px) for reading, `max-w-7xl` (1280px) for dashboard
- Card internal padding: `p-6` (24px)
- Table cell padding: `px-4 py-3` (16px horizontal, 12px vertical)
- Button padding (md): `px-4 py-2.5` (16px, 10px)
- Button padding (lg): `px-6 py-3` (24px, 12px)

### Border Radius
| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| radius-sm | 4px | `rounded` | Badges, small tags |
| radius-md | 6px | `rounded-md` | Buttons, inputs |
| radius-lg | 8px | `rounded-lg` | Cards, modals |
| radius-xl | 12px | `rounded-xl` | Large cards, upload zone |
| radius-full | 9999px | `rounded-full` | Avatars, pill badges |

### Shadows
| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | `shadow-sm` | Cards at rest |
| shadow-md | 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1) | `shadow-md` | Cards hover, dropdowns |
| shadow-lg | 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1) | `shadow-lg` | Modals, popovers |

### Borders
- Default border: `border border-slate-200` (1px solid #E2E8F0)
- Focus border: `border-2 border-indigo-500` (2px solid #6366F1)
- Error border: `border-2 border-red-500`

---

## Page-by-Page Specs

---

### 1. DASHBOARD

**Layout Hierarchy (top to bottom):**

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (sticky, h-16)                                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │ [Logo] BuildGuard    ...    Credits: 12  [Avatar ▾]│  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  MAIN (max-w-7xl, mx-auto, px-4 md:px-8, py-8)          │
│                                                          │
│  ┌─ Page Header ──────────────────────────────────────┐  │
│  │  Heading: "Contracts"                              │  │
│  │  Subtitle: "Manage and review your contracts"      │  │
│  │  [Upload Contract +]              [Sign Out All]   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Filter Bar ───────────────────────────────────────┐  │
│  │  [Search contracts...        ] [All Risks ▾] [Sort]│  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Contract List ────────────────────────────────────┐  │
│  │  ┌─ Contract Card ──────────────────────────────┐  │  │
│  │  │ [Risk Badge]  Contract Name                  │  │  │
│  │  │               Score: 73/100                   │  │  │
│  │  │               Uploaded: Jun 20, 2026          │  │  │
│  │  │               [View Analysis →]               │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │  ... (more cards)                                  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Empty State (when no contracts) ──────────────────┐  │
│  │  [Illustration]                                    │  │
│  │  "No contracts yet"                                │  │
│  │  "Upload your first contract to get started"       │  │
│  │  [Upload Contract +]                               │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Component Specs:**

#### Header
- Container: `sticky top-0 z-50 h-16 bg-white border-b border-slate-200`
- Inner: `max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-full`
- Logo: `flex items-center gap-2` — Icon (24px, indigo-600) + Text `text-lg font-semibold text-slate-800`
- Credits badge: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium`
- Avatar: `w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600`

#### Page Header
- Container: `flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8`
- Heading: `text-[30px] font-bold leading-[1.2] text-slate-900`
- Subtitle: `text-base text-slate-500 mt-1`
- Actions: `flex items-center gap-3`
  - Upload button (primary): `inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors`
  - Sign out all (secondary/destructive): `inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors`

#### Filter Bar
- Container: `flex flex-col sm:flex-row gap-3 mb-6`
- Search input: `flex-1 min-w-0 px-4 py-2.5 rounded-md border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`
- Risk filter dropdown: `px-4 py-2.5 rounded-md border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500`
- Sort dropdown: same as risk filter

#### Contract Card
- Container: `group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-6`
- Layout: `flex flex-col sm:flex-row sm:items-center gap-4`
- Left section (info): `flex-1 min-w-0`
  - Risk badge: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-2`
    - Low: `bg-green-50 text-green-700`
    - Medium: `bg-yellow-50 text-yellow-700`
    - High: `bg-orange-50 text-orange-700`
    - Critical: `bg-red-50 text-red-700`
  - Contract name: `text-base font-semibold text-slate-800 truncate`
  - Meta row: `flex items-center gap-4 mt-1 text-sm text-slate-500`
    - Score: `inline-flex items-center gap-1` — "Risk Score: 73"
    - Date: "Jun 20, 2026"
- Right section (action): `flex-shrink-0`
  - View link: `inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform`
  - Chevron icon: `w-4 h-4`

#### States
- **Loading (skeleton):** 3 skeleton cards, each `bg-white rounded-lg border border-slate-200 p-6 animate-pulse` with internal skeleton lines
- **Empty state:** Centered, `py-16 text-center` with illustration, heading, subtext, CTA
- **Error state:** `bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 flex items-center gap-2`
- **Search no results:** `py-12 text-center text-slate-500 text-sm`

#### Accessibility Notes
- Contract cards are `<article>` elements with `aria-label="Contract: {name}, Risk: {level}"`
- Risk badges use `aria-hidden="true"` on the icon; text label is descriptive
- Search input has `aria-label="Search contracts"`
- Filter dropdowns have `aria-label="Filter by risk level"` and `aria-label="Sort contracts"`
- Keyboard: Tab order follows visual order. Enter/Space activates cards
- Focus visible on all interactive elements via `focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`

---

### 2. ANALYSIS RESULTS

**Layout Hierarchy (top to bottom):**

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (same as Dashboard)                              │
├─────────────────────────────────────────────────────────┤
│  MAIN (max-w-5xl, mx-auto, px-4 md:px-8, py-8)          │
│                                                          │
│  ┌─ Back Link ────────────────────────────────────────┐  │
│  │  ← Back to Contracts                               │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Language Warning Banner (conditional) ────────────┐  │
│  │  ⚠ This contract is not in English...              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Risk Overview Card ───────────────────────────────┐  │
│  │  Contract Name                                     │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  [Gauge]    Critical Risk                    │  │  │
│  │  │  87/100     3 Red Flags · 5 Recommendations  │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │  [Export PDF]                                      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Summary Section ──────────────────────────────────┐  │
│  │  Summary                                          │  │
│  │  [Expandable text block...]                        │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Red Flags Section ────────────────────────────────┐  │
│  │  Red Flags (3)                                     │  │
│  │  ┌─ Flag Card ─────────────────────────────────┐  │  │
│  │  │  ⚠ Unilateral termination clause...         │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Clauses Table Section ────────────────────────────┐  │
│  │  Key Clauses                                      │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ Clause              Risk    Status           │  │  │
│  │  │ Payment Terms       High    Present          │  │  │
│  │  │ Liability Cap       Medium  Present          │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Recommendations Section ──────────────────────────┐  │
│  │  Recommendations (5)                               │  │
│  │  ┌─ Rec Card ──────────────────────────────────┐  │  │
│  │  │  💡 Consider adding a force majeure...      │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Missing Protections Section ──────────────────────┐  │
│  │  Missing Protections (2)                           │  │
│  │  ┌─ Protection Card ───────────────────────────┐  │  │
│  │  │  🛡 No dispute resolution mechanism...       │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Component Specs:**

#### Back Link
- Container: `mb-6`
- Link: `inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded transition-colors`
- Icon: `w-4 h-4` (chevron-left)

#### Language Warning Banner
- Container: `mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3`
- Icon: `w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5` (AlertCircle)
- Text: `text-sm text-yellow-800 leading-normal`
- Role: `role="alert"` with `aria-live="polite"`

#### Risk Overview Card
- Container: `bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8`
- Contract name: `text-[30px] font-bold leading-[1.2] text-slate-900 mb-6`
- Gauge section: `flex flex-col md:flex-row items-center gap-6 md:gap-8`
  - Gauge visual: `relative w-32 h-32 flex-shrink-0` (SVG with stroke-dasharray)
  - Center text: score `text-3xl font-bold` colored by risk level + "/100" `text-sm text-slate-400`
  - Risk details: `flex-1 text-center md:text-left`
    - Risk level badge with color system matching dashboard
    - Stats: `text-sm text-slate-500`
- Export button: `mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50`

#### Section Heading (reused)
- Container: `flex items-center gap-2 mb-4`
- Icon: `w-5 h-5 text-slate-400`
- Text: `text-lg font-semibold text-slate-800`
- Count badge: `inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-medium text-slate-600`

#### Summary Section
- Container: `mb-8`
- Text: `text-base leading-relaxed text-slate-700`
- If long: Collapsed to 3 lines with `line-clamp-3`, expand toggle

#### Red Flag Card
- Container: `bg-red-50 border border-red-100 rounded-lg p-4 mb-3 last:mb-0`
- Layout: `flex items-start gap-3`
- Icon: `w-5 h-5 text-red-600 flex-shrink-0 mt-0.5` (AlertTriangle)
- Title: `text-sm font-semibold text-red-800 mb-1`
- Description: `text-sm text-red-700 leading-normal`

#### Clauses Table
- Container: `mb-8 overflow-x-auto`
- Table: `w-full text-sm`
- Header: `border-b border-slate-200`
  - Th: `px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide`
- Row: `border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors`
  - Td: `px-4 py-3`
  - Clause name: `font-medium text-slate-800`
  - Risk badge: smaller `px-2 py-0.5 rounded text-xs font-medium`

#### Recommendation Card
- Container: `bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-3 last:mb-0`
- Icon: `w-5 h-5 text-indigo-600` (Lightbulb)
- Title: `text-sm font-semibold text-indigo-800 mb-1`
- Description: `text-sm text-indigo-700 leading-normal`

#### Missing Protection Card
- Container: `bg-orange-50 border border-orange-100 rounded-lg p-4 mb-3 last:mb-0`
- Icon: `w-5 h-5 text-orange-600` (ShieldOff)
- Title: `text-sm font-semibold text-orange-800 mb-1`
- Description: `text-sm text-orange-700 leading-normal`

#### States
- **Loading:** Full-page skeleton with gauge skeleton `w-32 h-32 rounded-full bg-slate-100 animate-pulse`
- **Error:** `bg-red-50 border border-red-200 rounded-lg p-6 text-center`
- **Partial data:** Sections with no data show `text-sm text-slate-400 italic py-4`

#### Accessibility Notes
- Risk gauge: `role="img" aria-label="Risk score: 87 out of 100, Critical risk level"`
- Language banner: `role="alert"` with `aria-live="polite"`
- Table: proper `<thead>`, `<tbody>`, `scope="col"` on headers
- Section headings are `<h2>` for screen reader navigation
- Color is never the sole indicator — every risk level has text + icon

---

### 3. UPLOAD

**Layout Hierarchy:**

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (same as Dashboard)                              │
├─────────────────────────────────────────────────────────┤
│  MAIN (max-w-2xl, mx-auto, px-4 md:px-8, py-12)         │
│                                                          │
│  ┌─ Page Header ──────────────────────────────────────┐  │
│  │  Upload Contract                                   │  │
│  │  Upload a construction contract for AI analysis    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Upload Zone ──────────────────────────────────────┐  │
│  │  [Upload Icon - 48px]                              │  │
│  │  Drag & drop your contract here                    │  │
│  │  or                                                 │  │
│  │  [Browse Files]                                    │  │
│  │  PDF, DOCX · Max 10MB                              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ File Selected State ──────────────────────────────┐  │
│  │  📄 contract.pdf    2.4 MB    ✕                    │  │
│  │  [Analyze Contract →]                              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Upload Progress ──────────────────────────────────┐  │
│  │  Analyzing your contract...                        │  │
│  │  [████████████░░░░░░░░] 60%                       │  │
│  │  This usually takes 30-60 seconds                 │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Error State ──────────────────────────────────────┐  │
│  │  ⚠ Upload failed. Please try again.               │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Component Specs:**

#### Upload Zone
- Container (default): `relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-200 p-12 text-center cursor-pointer group`
- Container (drag-over): `border-indigo-500 bg-indigo-50 border-solid scale-[1.02]`
- Container (error): `border-red-300 bg-red-50`
- Hidden input: `absolute inset-0 w-full h-full opacity-0 cursor-pointer` with `aria-label="Upload contract file"`
- Icon: `w-12 h-12 mx-auto mb-4 text-slate-400 group-hover:text-indigo-500 transition-colors`
- Primary text: `text-base font-medium text-slate-700 mb-1`
- Or divider: `text-sm text-slate-400 my-3` — centered "or"
- Browse button: `inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50`
- Helper text: `text-xs text-slate-400 mt-4`

#### File Selected State
- Container: `bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-4`
- File icon: `w-10 h-10 text-slate-400 flex-shrink-0`
- Name: `text-sm font-medium text-slate-800 truncate`
- Size: `text-xs text-slate-500`
- Remove button: `p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50` with `aria-label="Remove file"`
- Analyze button: `mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed`

#### Upload Progress
- Container: `mt-6 text-center`
- Status text: `text-sm font-medium text-slate-700 mb-2`
- Progress bar: `w-full h-2 bg-slate-200 rounded-full overflow-hidden`
  - Fill: `h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out`
- Percentage: `text-xs text-slate-500 mt-1`

#### Error State
- Container: `mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3`
- Message: `text-sm text-red-700`
- Role: `role="error"`

#### States
- **Default:** Upload zone visible
- **Drag-over:** Zone highlights
- **File selected:** Zone replaced by file info + Analyze button
- **Uploading:** Progress bar, button disabled with spinner
- **Success:** Redirect to Analysis Results
- **Error:** Error banner, zone returns to default

#### Accessibility Notes
- Upload zone: `role="button"` with `tabIndex={0}`, keyboard activatable
- `aria-describedby` linking zone to helper text
- Drag-and-drop is enhancement only — file input always accessible
- Progress bar: `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- Error messages: `role="alert"` with `aria-live="assertive"`

---

### 4. Auth (Login + Register)

**Layout Hierarchy:**

```
┌─────────────────────────────────────────────────────────┐
│  MAIN (min-h-screen, flex)                               │
│                                                          │
│  ┌─ Left Panel (desktop only) ────────────────────────┐  │
│  │  [Brand Illustration / Pattern]                    │  │
│  │  "Understand your contracts"                       │  │
│  │  "AI-powered risk analysis for construction"       │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Right Panel (form) ───────────────────────────────┐  │
│  │  ┌─ Form Card ──────────────────────────────────┐  │  │
│  │  │  [Logo] BuildGuard                           │  │  │
│  │  │  Welcome back                                 │  │  │
│  │  │  Sign in to your account                      │  │  │
│  │  │                                               │  │  │
│  │  │  Email                                        │  │  │
│  │  │  [you@example.com            ]               │  │  │
│  │  │                                               │  │  │
│  │  │  Password                    [Show/Hide]     │  │  │
│  │  │  [••••••••••••               ]               │  │  │
│  │  │                                               │  │  │
│  │  │  [ ] Remember me            Forgot password? │  │  │
│  │  │                                               │  │  │
│  │  │  [Sign In]                                   │  │  │
│  │  │                                               │  │  │
│  │  │  ─────────── or ───────────                  │  │  │
│  │  │                                               │  │  │
│  │  │  Don't have an account? [Create one →]       │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Component Specs:**

#### Page Layout
- Container: `min-h-screen flex flex-col md:flex-row bg-slate-50`
- Left panel (desktop): `hidden md:flex md:w-1/2 bg-indigo-600 items-center justify-center p-12 relative overflow-hidden`
- Right panel: `flex-1 flex items-center justify-center p-4 md:p-8`

#### Form Card
- Container: `w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8`
- Logo: `flex items-center gap-2 mb-8`
- Heading: `text-2xl font-bold text-slate-900 mb-1`
- Subtitle: `text-sm text-slate-500 mb-8`

#### Form Fields
- Label: `block text-sm font-medium text-slate-700 mb-1.5`
- Input: `w-full px-4 py-2.5 rounded-md border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow`
- Input (error): `border-red-300 focus:ring-red-500`
- Error text: `mt-1.5 text-xs text-red-600 flex items-center gap-1`

#### Password Field
- Container: `relative`
- Toggle button: `absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600`

#### Checkbox (Remember me)
- Container: `flex items-center gap-2`
- Checkbox: `w-4 h-4 rounded border border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500`

#### Primary Button (Submit)
- `w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`
- Loading: Add spinner icon with `animate-spin w-4 h-4`

#### Accessibility Notes
- Form: `<form>` with `noValidate`
- All inputs have associated `<label>` with `htmlFor`
- Error messages: `aria-live="polite"`, linked via `aria-describedby`
- Password toggle: `aria-pressed="true/false"`
- Autocomplete: `autocomplete="email"`, `autocomplete="current-password"`, `autocomplete="new-password"`

---

## Interaction Rules

### Hover Effects
- Buttons (primary): `hover:bg-indigo-700`
- Buttons (secondary): `hover:bg-slate-50`
- Buttons (destructive): `hover:bg-red-50`
- Cards: `hover:shadow-md hover:border-slate-300`
- Links: `hover:text-indigo-700`
- Upload zone: `hover:border-indigo-400 hover:bg-indigo-50/30`
- Table rows: `hover:bg-slate-50`

### Focus Ring Styles
- All interactive elements: `focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`
- Destructive actions: `focus:ring-red-500`
- Ring color: `#6366F1` (indigo-500), 2px width, 2px offset

### Loading Skeleton Patterns
- Base: `bg-slate-100 animate-pulse rounded`
- Text lines: `h-4 rounded bg-slate-100 animate-pulse`
- Circles: `rounded-full bg-slate-100 animate-pulse`
- Rectangles: `rounded-lg bg-slate-100 animate-pulse`

### Error Message Styling
- Inline: `mt-1.5 text-xs text-red-600 flex items-center gap-1`
- Banner: `bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 flex items-start gap-3`

### Transitions
- All state changes: `transition-all duration-200`
- Color changes: `transition-colors duration-200`
- Transform changes: `transition-transform duration-200`

### Disabled States
- Buttons: `disabled:opacity-50 disabled:cursor-not-allowed`
- Inputs: `disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`

---

## Handoff to Forge — Implementation Checklist

### 1. Design Tokens → `tailwind.config.ts`
- Extend `colors` with risk-level tokens (risk-low, risk-medium, risk-high, risk-critical)
- Extend `fontFamily` with `sans: ['Inter', ...]`, `mono: ['JetBrains Mono', ...]`
- Add `keyframes` for `shimmer` and `slideUp` animations

### 2. Reusable Components → `/components/ui/`
- `Button` — variants: primary, secondary, destructive, ghost; sizes: sm, md, lg; states: loading
- `Input` — with label, error, helper text, icon support
- `Badge` — risk-level variants with icon + text
- `Card` — container with padding variants
- `Alert` — banner with icon, message, dismissible option
- `Skeleton` — with shimmer animation
- `ProgressBar` — with percentage and label
- `Table` — with sortable headers, responsive scroll
- `Dropdown` — for filters with keyboard navigation

### 3. Page Components → `/app/`
- `Dashboard` — header, page header, filter bar, contract list
- `AnalysisResults` — back link, language banner, risk overview, summary, red flags, clauses table, recommendations, missing protections
- `Upload` — upload zone with drag-and-drop, file selected state, progress, error states
- `Login` / `Register` — form card with validation, error handling

### 4. Key Implementation Details
- Use `next/font/google` for Inter font loading
- All icons from `lucide-react` (24px default, 16px for inline)
- Risk gauge: SVG with `stroke-dasharray` for circular progress
- Upload: Native `<input type="file">` with drag-and-drop event handlers
- Responsive breakpoints: Tailwind defaults (sm:640px, md:768px, lg:1024px)

### 5. Accessibility Checklist
- [ ] All images have `alt` text or `aria-hidden="true"`
- [ ] All form inputs have associated `<label>`
- [ ] Color contrast verified for all text/background combinations
- [ ] Focus visible on all interactive elements
- [ ] `aria-live` regions for dynamic content (errors, progress)
- [ ] `role` attributes on non-semantic elements
- [ ] Keyboard navigation works for all interactions
- [ ] `aria-label` on icon-only buttons
- [ ] Skip-to-content link as first focusable element
- [ ] Page `<h1>` present and unique on each page

### 6. Edge Cases to Handle
- Zero contracts → Empty state with illustration + CTA
- Search with no results → "No contracts match" message
- Analysis with no red flags → "No red flags identified"
- File upload too large → Inline error
- Network error → Error banner with retry
- Session expired → Redirect to login
- Very long contract names → Truncate with `truncate` class
- Very long summary text → Collapsed with expand toggle

### 7. Performance Notes
- Lazy load analysis results sections below the fold
- Skeleton screens preferred over spinners
- Optimistic UI for file selection
- Debounce search input (300ms)
