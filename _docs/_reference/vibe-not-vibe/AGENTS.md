# AGENTS.md — "To vibe or not to vibe"

## What this project is

A 40-minute conference talk for an AI/developer-focused audience. The talk surveys four methods of AI-assisted software development — from basic autocomplete to fully spec-driven agentic workflows — and gives the audience a framework for choosing the right approach.

**Title:** To vibe or not to vibe  
**Subtitle:** Agentic AI coding in the real world — from creative flow to enterprise-grade results  
**Format:** Standard session, 40 minutes  
**Audience:** Developers, tech leads, CTOs

---

## Key source documents

| File | Purpose |
|------|---------|
| `talk-overview.md` | Authoritative source: abstract, the four methods, KPI framework, KPI matrix, talk outline, key distinctions |
| `storytelling.md` | Narrative layer: the 4 Ristoranti storytelling framework, restaurant identities, fake reviews, La Pagella scorecard |
| `4-restaurants-format.md` | Reference for the real *Alessandro Borghese — 4 Ristoranti* TV show format, scoring rules, episode structure, and how the talk adapts it |
| `spec-methodologies.md` | Deep survey of spec-driven development tools: GSD, BMAD, GitHub Spec Kit, Kiro, Tessl, Ralph Loop, OpenSpec — with pro/con tables and a comparison matrix |
| `slides.md` | **Working planning board** — top section lists arguments to land; bottom section is the full slide list with layout and content notes. Update this file as the talk evolves |
| `slides/README.md` | Slide system documentation for agents and humans |
| `slides/_docs/presentation-reference.md` | Complete layout reference (17 layouts, all fields, examples) |

---

## The storytelling framework — *4 Ristoranti*

The talk is structured around *Alessandro Borghese — 4 Ristoranti* (Sky Uno / TV8, 2015–), an Italian restaurant competition show. The real format:

- Four restaurant owners from the same area **visit and secretly score each other** on four categories: **location, service, menu, price** (0–10 scale)
- After all four visits, votes are revealed and totalled
- **Alessandro Borghese** (celebrity chef) adds his own expert vote, which can **overturn the standings**
- The episode winner takes home €5,000 to invest in their restaurant
- Based on the German format *Mein Lokal, Dein Lokal*

**How the talk adapts it:** the four coding paradigms are the four restaurants. The audience is invited into each kitchen. The "reviews" are voiced by developer personas (not the other owners), and the final arbiter is the KPI matrix rather than Borghese's gut. There is no winner — the closing reframes the question as "which kitchen suits *you*?"

The host character is an **8-bit pixel art version of Alessandro Borghese** — chef's jacket, arms crossed, arriving in a black pixel van between sections.

---

## The four methods (restaurants)

| # | Method | Restaurant | Tagline |
|---|--------|------------|---------|
| 1 | Autocomplete+ | BLAZE & BLADE | *"You cook. We make you faster."* |
| 2 | Vibe coding | THE MYSTERY PLATE | *"Tell us how you feel. Eat what arrives."* |
| 3 | Agent as junior dev | CHEF & CO. | *"Great food. We're watching."* |
| 4 | Spec-driven development | THE LAMINATED MENU | *"Every dish. Every time. Exactly."* |

---

## KPI matrix (ground truth from talk-overview.md)

| KPI | Autocomplete+ | Vibe coding | Agent as junior dev | Spec-driven |
|-----|--------------|-------------|---------------------|-------------|
| Creativity | Low | High | Medium | Low |
| Quality of results | Medium | Low | Medium | High |
| Predictability | Medium | Low | Medium | High |
| Token costs | Low | Medium | High | High |
| Scalability | Medium | Low | Medium | High |
| Human effort | High | Low | Medium | High |

> **Critical distinction:** Human effort is HIGH for both Autocomplete+ and Spec-driven, but for opposite reasons — one keeps the developer in the loop by design; the other front-loads cost into spec writing.

---

## Talk outline

| # | Section | Time |
|---|---------|------|
| 1 | The spectrum exists — most teams are stuck at one end | 0–6 min |
| 2 | Mode 1 · Autocomplete+ (BLAZE & BLADE) | 6–13 min |
| 3 | Mode 2 · Vibe coding (THE MYSTERY PLATE) | 13–21 min |
| 4 | Mode 3 · Agent as junior dev (CHEF & CO.) | 21–29 min |
| 5 | Mode 4 · Spec-driven development (THE LAMINATED MENU) | 29–36 min |
| 6 | Decision framework + Q&A | 36–40 min |

---

## Slide system

Slides are built as YAML files served via `slides/slides.html`. The system has 17 layouts and 4 themes.

### File location

All talk slides live in `slides/`. The main deck file should be named `vibe-not-vibe.yaml` (or similar — check `slides/index.yaml` for registered presentations).

### Starting a presentation

```bash
cd slides
python3 -m http.server 8091
# Open: http://localhost:8091/slides.html?presentation=vibe-not-vibe.yaml
```

### Recommended theme

`root-shell` (green/terminal aesthetic) fits the developer-focused audience and the pixel art/retro storytelling style. `grid-zero` (neon/cyber) works as an alternative for high-energy sections.

### Slide structure for each restaurant visit

Follow `storytelling.md` — every restaurant has the same beat:

```
1. ENTRANCE      — exterior, name, tagline (use: section-divider or title)
2. THE OWNER     — character intro + "I'll win because…" monologue (use: quote)
3. THE KITCHEN   — coding paradigm content (use: bullets, bullets-strong, two-column)
4. THE REVIEWS   — 3 fake customer reviews (use: quote or bullets-note)
5. LA PAGELLA    — KPI scorecard (use: bullets-strong or feature-grid)
```

For Restaurant 4 (THE LAMINATED MENU), the kitchen beat includes a **toolbox slide** that maps the spec-driven landscape. Use `spec-methodologies.md` as the source. The four tools to name: GSD (accessible entry), BMAD (enterprise pole), Kiro (IDE-first), Tessl (spec-as-source). See `slides.md` slide 33 for the current framing.

### Layout cheat sheet for this talk

| Need | Layout |
|------|--------|
| Talk opener / restaurant entrance | `title` or `section-divider` |
| Bullet list of features/points | `bullets` |
| KPI scorecard rows | `bullets-strong` (term + description) |
| "I'll win because…" monologue | `quote` |
| Customer reviews | `quote` (one per slide) or `bullets-note` |
| Side-by-side comparison | `two-column` |
| Large KPI metric | `stat-hero` |
| Decision framework grid | `feature-grid` |
| Closing slide | `title-closing` |

---

## Agent responsibilities

When asked to work on this project, an agent may be asked to:

1. **Create or extend the YAML slide deck** — translate sections from `talk-overview.md` and `storytelling.md` into slides following the layout conventions above; use `slides.md` as the authoritative slide list
2. **Add a restaurant section** — follow the 5-beat structure (ENTRANCE → OWNER → KITCHEN → REVIEWS → LA PAGELLA) for each of the four kitchens
3. **Update the KPI matrix** — values come from `talk-overview.md`, not from inference
4. **Adjust storytelling** — quotes, reviews, and persona text come from `storytelling.md`
5. **Update `slides.md`** — this is the shared planning board; keep the arguments list and slide list in sync with any changes to the talk structure
6. **Research or expand spec-driven content** — `spec-methodologies.md` is the reference; do not invent tool descriptions from memory, check the file
7. **Register new YAML files** — add entries to `slides/index.yaml` and `slides/index.html` (find the `PRESENTATIONS` mapping)

---

## Conventions

- Always add `id` fields to slides — enables direct linking and navigation
- Keep `h1`/`h2` titles under 70 characters
- Limit bullet items to 3–6 per slide
- Use `editing: false` in the final/shared presentation
- KPI scores in La Pagella use filled/empty blocks: `⬛` = filled, `⬜` = empty (5-block scale)
- The La Pagella scale maps: Low = 1–2 blocks, Medium = 3 blocks, High = 4–5 blocks

---

## What this project is NOT doing

- No animations (the slide system doesn't support them)
- No speaker notes (not supported)
- No auto-generated winner — the talk explicitly avoids declaring one method superior
- No abstract KPI theory — all scores come from the matrix in `talk-overview.md`
