# Estes Park Portal — Session State

> This file is the handoff document between chat sessions. Read it before touching anything.
> Last updated: 2026-04-02

---

## What This Is

A Vite + React portal for the Estes Park golf resort design charrette in Grand Prairie, Texas on **March 31, 2026**. Design concept: hand-assembled field journal — digital in delivery, handmade in soul. Not a website. A charrette portal.

**Live URL:** Auto-deploys from `main` branch via Vercel (connected to `https://github.com/blaztfemi/estes-park-portal`).

---

## Version History

| Tag/Commit | Description |
|-----------|-------------|
| `v1.0` · `0d4fb9b` | Original build — field journal structure, sticky nav, two-column sections |
| `v2.0` · `31de50e` | Snow Fall rewrite — rejected by Eric (too website-y, lost the nav + flow) |
| `v2.1` · `c6baeab` | v1 structure restored + Unsplash images + big-quote treatment |
| `v2.2` · `5ebdd8c` | Em dash pass, "The Field" rename, PasswordGate added |
| `v2.3` · `4cd04e4` | Local images — Joe Pool Lake hero, Cedar Hill dividers, live oak, windmill |
| `v2.4` · `7124196` | Library section (7th nav item), team reorder, scroll-reveal fix, new hero |
| `v2.5` · `9dd80c1` | **12 charrette case studies** replacing old 8 — images + downloadable .docx reports |
| `v2.5b` · `511b1b0` | Pre-charrette annotation fixes (Place headline, Naming Anchors, Comps headline, Team restructure) |
| `v2.5c` · `bdef96e` | Scroll-reveal blank-page bug fix (root cause resolved) |
| `v2.6`  · `bd0ac17` | Blur-overlay password gate; data accuracy fix (Bandon callout) |
| `v3.0`  · `9c99ce2` | **CURRENT** — Post-charrette Vision section: Big Ideas, Master Plan, 3 zone breakdowns with renderings; 19 charrette images; nav updated to 7 sections; dates to April 2026; Formspree wired |

---

## Current Build State (v3.0)

**Last commit:** `9c99ce2`
**Last push:** 2026-04-02 (pending PAT)
**Branch:** `main`
**Build size:** 205kb JS (gzipped: 66.3kb)

### What's Built

**Nav (7 items):** The Story · The Place · The Market · The Comps · The Vision · The Team · The Loop

**Sections:**
- **Hero** — `/sand-valley-clubhouse.jpg`, headline "The Land Is Ready. The City Is Ready. Now We Decide.", parallax scrollY × 0.35
- **Story (01)** — Grand Prairie narrative, inline `/texas-saddle-windmill.jpg` + `/estes-park-program.png`
- **Place (02)** — "The Land Remembers" (shortened from "...What We Forgot"), Naming Anchors: White Rock Escarpment / Austin Chalk / Cross Timbers / **Cove Bridges** / Cuesta; inline site analysis diagram
- **Market (03)** — DFW demand math, inline `/live-oak-tunnel.jpg`
- **Comps (04)** — "It's Never Been Done. / Just Never Here." headline. **12 case study accordion cards** (Bandon, Cabot Citrus, PGA Frisco, Miakka, Old Shores, Pebble Beach, Pinehurst, Rodeo Dunes, Streamsong, Loop at The Patch, Stadium Finish, Whistling Straights). Each card has: photo header, callout quote, 3 teaches, numbers line, "Go Deeper → Download Full Report" (.docx link)
- **Vision (05)** — NEW. Post-charrette section: "The Land Told Us What to Build". Three Big Ideas (Lost & Found, Golf Rules, Member for a Day). Full-width Conceptual Master Plan image. Three zone breakdowns (Arrival/Caretaker's Cottage, Village, Heart of the Course/Clubhouse) each with TwoCol narrative + hand-drawn rendering. Spirit of the Place mood board. Pull quote: "You arrive curious. You leave converted."
- **Team (06)** — City of Grand Prairie as intro prose (not a card); cards: Escalante Golf → OCM Golf → Destination Designs (Randy) → Work Architecture; 2 ghost "Future Collaborator" cards
- **Loop (07)** — Dark background (matches hero). Formspree form (`xaqlygol`). "This Document Isn't Finished." closing statement.

**Image Dividers (5):**
1. `/cedar-hill-bluebonnets.jpg` — after Story
2. `/texas-sunset-field.jpg` — after Place
3. Unsplash golf (`photo-1587174486073`) — after Market
4. `/sand-valley-lodge.jpg` — after Comps
5. `/golf-cart-oaks.jpg` — after Team

**Assets in `public/`:**
- Site images: `sand-valley-clubhouse.jpg`, `cedar-hill-bluebonnets.jpg`, `texas-sunset-field.jpg`, `sand-valley-lodge.jpg`, `golf-cart-oaks.jpg`, `live-oak-tunnel.jpg`, `texas-saddle-windmill.jpg`, `estes-park-program.png`
- Comp images: `comp-bandon.jpg`, `comp-cabot.jpg`, `comp-frisco.jpg`, `comp-myakka.jpg`, `comp-old-shores.jpg`, `comp-pebble.jpg`, `comp-pinehurst.jpg`, `comp-rodeo.webp`, `comp-streamsong.webp`, `comp-loop.jpg`, `comp-stadium.jpg`, `comp-whistling.jpg`
- Reports: `/reports/bandon-dunes.docx`, `cabot-citrus.docx`, `pga-frisco.docx`, `myakka.docx`, `old-shores.docx`, `pebble-beach.docx`, `pinehurst.docx`, `rodeo-dunes.docx`, `streamsong.docx`, `loop-at-the-patch.docx`, `stadium-finish.docx`, `whistling-straights.docx`
- Charrette images (v3.0): `/charrette/master-plan.jpg`, `cottage-rendering.jpg`, `village-rendering.jpg`, `clubhouse-rendering.jpg`, `spirit-of-place.jpg`, `big-ideas.jpg`, `intro-aerial.jpg`, `key-areas.jpg`, `site-analysis.jpg`, `site-inventory.jpg`, `site-photos.jpg`, `site-watercolor.jpg`, `masterplan-watercolor.jpg`, `program-framework.jpg`, `programming-diagram.jpg`, `vision-watercolor.jpg`, `zone-01-arrival.jpg`, `zone-02-village.jpg`, `zone-03-clubhouse.jpg`

**Password Gate (v2.6 — Blur-Overlay Architecture):**
- `VITE_PORTAL_KEY` env var in Vercel — never in source
- sessionStorage key: `ep_unlocked = "1"`
- **Architecture:** Content is always rendered. PasswordGate is a `position: fixed, z-index: 9999` overlay with `background: rgba(26,24,20,0.88)` + `backdropFilter: blur(6px)`. Content wrapper has `filter: blur(14px) brightness(0.12) saturate(0.25)` + `pointer-events: none` when locked. On correct code: overlay fades out over 0.55s, then `setUnlocked(true)` lifts the content filter. Body `overflow: hidden` while locked.
- `useScrollReveal()` uses `[]` deps — content always in DOM from first render, observer always has elements to watch. Definitive fix for the scroll-reveal blank-page bug.

---

## Key Decisions Made (Do Not Reverse Without Asking)

1. **v1 structure is canonical.** Sticky nav, two-column layout, field journal feel.
2. **No direct quotes from team members.** All paraphrased into narrative.
3. **Single-component architecture.** Everything in `App.jsx`. No splitting unless Eric asks.
4. **Inline styles over Tailwind.** Tailwind installed but unused.
5. **Git auth via PAT per session.** Strip immediately after push. Never store in any file.
6. **Build folder is Linux-native.** All git ops from `/sessions/[session-id]/estes-park-build/`.
7. **Formspree endpoint:** `https://formspree.io/f/xaqlygol` — do not change.
8. **PullQuote:** Large `"` at 90–110px sienna. Quote text 22–30px Playfair italic.
9. **ImageDividers use `background-attachment: fixed`** (CSS parallax).
10. **Hero photo parallax** via `scrollY` React state (translateY at 0.35×).
11. **Comps section** = 12 charrette board case studies. Reports in `public/reports/*.docx`. Do not revert to old 8 comps.
12. **David McDonald bio** — never reference "second attempt." Only affirmative language about Escalante.
13. **Randy Hoffacker org** = Destination Designs (not Work Architecture).
14. **Mayor Ron Jensen** — removed as a card. City of Grand Prairie is the intro prose block above team grid.

---

## Typography Stack

- **Playfair Display** — headlines, pull quotes, stat numbers
- **DM Sans** — nav, labels, subheads, UI elements
- **Lora** — body copy

## Color Tokens

```js
parchment:    "#F5F0E8"
parchmentAlt: "#EDE8DC"
warmBlack:    "#1A1814"
ink:          "#1C1C1A"
sienna:       "#B5541B"   // accent
sage:         "#5C6B5A"   // labels
rule:         "#D9D0C0"
warmBrown:    "#3D2B1A"   // pull quote text
compOpen:     "#EEEAE0"   // comp card expanded bg
```

---

## Git / Deploy Workflow

```
# Per-session push sequence:
git clone https://github.com/blaztfemi/estes-park-portal.git estes-park-build
cd estes-park-build && npm install
# ... make changes ...
git add -A
git commit -m "your message"
git remote set-url origin https://[PAT]@github.com/blaztfemi/estes-park-portal.git
git push origin main --tags
git remote set-url origin https://github.com/blaztfemi/estes-park-portal.git  # strip PAT
```

Eric provides PAT at session start. Strip immediately after push. Never store in any file.

---

## Session Log

| Date | Commit | What Changed |
|------|--------|--------------|
| 2026-03-26 | `v1.0` / `0d4fb9b` | Original build |
| 2026-03-26 | `v2.0` / `31de50e` | Snow Fall rewrite (rejected) |
| 2026-03-26 | `v2.1` / `c6baeab` | v1 restored + images |
| 2026-03-26 | `v2.2` / `5ebdd8c` | Em dash pass, Field rename, PasswordGate |
| 2026-03-28 | `v2.3` / `4cd04e4` | Local images — Joe Pool Lake, Cedar Hill |
| 2026-03-29 | `v2.4` / `7124196` | Library section, team reorder, hero update |
| 2026-03-31 | `v2.5` / `9dd80c1` | 12 charrette case studies + comp images + downloadable reports |
| 2026-03-31 | `v2.5b` / `511b1b0` | Annotation fixes: Place headline, Naming Anchors, Comps headline, Team restructure |
| 2026-03-31 | `v2.5c` / `bdef96e` | Scroll-reveal blank-page bug fixed (root cause: dep on unlocked state) |
| 2026-03-31 | `v2.6`  / `bd0ac17` | Blur-overlay password gate (definitive fix); Bandon data accuracy fix |
| 2026-04-02 | `v3.0`  / `9c99ce2` | Post-charrette Vision section: Big Ideas, Master Plan, zone breakdowns, 19 charrette images, nav→7 sections, dates→April 2026, Formspree wired |
