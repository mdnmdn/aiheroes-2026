# Slides — "To vibe or not to vibe"
*Draft brainstorming board — update freely*

---

## Arguments

### The core tension
- Vibe coding has democratized app development — but "it runs" is not the same as "it ships"
- There is a full spectrum of AI-assisted methods, and most teams are stuck at one end of it
- The right method isn't the one with the best scores — it's the one that matches what you're building

### The four methods
- **Autocomplete+** — the developer stays in control; AI removes friction, not judgment
- **Vibe coding** — fast and creative, but carries hidden cleanup debt that lands later
- **Agent as junior dev** — effort shifts from writing code to reviewing and directing it
- **Spec-driven** — consistency becomes contractual; the spec is the real work, not the code

### The key distinctions (must land clearly)
- **Quality ≠ Predictability** — high quality with low predictability is possible; that's vibe coding on a good day
- **Repeatability ≠ Predictability** — same input / same output is not the same as knowing the outcome before you start
- **Human effort paradox** — HIGH for both Autocomplete+ and Spec-driven, but for opposite reasons: one keeps you in the loop throughout; the other front-loads all the cost into spec writing
- **Vibe coding's hidden cost** — effort looks low; cleanup debt makes it medium-to-high overall

### The enterprise question
- Can agentic AI produce maintainable, reviewable, shippable code — not just impressive demos?
- Can we get consistent results across a codebase, not just one-off successes?
- Where do today's tools still fall short — and what does that mean for teams adopting these methods?

### Spec-driven is not one thing
- Even within spec-driven there is a full spectrum: from "add some structure to your prompts" (GSD) to "the spec IS the software" (Tessl)
- The common problem all spec-driven methods solve: **context rot** — the quality degradation that happens as the LLM's context window fills during long sessions
- Different solutions to context rot: fresh subagent instances (GSD, Ralph), structured phases (BMAD, Spec Kit), persistent steering files (Kiro), spec regeneration (Tessl)
- The right tool depends on team size, project age, and how much upfront consistency you're willing to pay for
- Key players worth naming in the talk: **GSD** (accessible, 48K stars, Claude Code native), **BMAD** (enterprise pole, 21+ agents), **Kiro** (AWS/IDE-first), **Tessl** (most radical — spec as source)

### The storytelling mechanics
- The 4 Ristoranti rhythm teaches the audience what's coming — they start anticipating the beat after visit two
- "I'll win because…" lets each paradigm make its best case before the scorecard lands
- Fake reviews carry real-world voice — land the joke and the point simultaneously
- No winner at the end avoids a false conclusion and keeps the talk useful to a mixed audience

---

## Slides

### Opening — 0–6 min

- **1 · To vibe or not to vibe** `title` — Talk title, subtitle, speaker name
- **2 · The question + three questions** `bullets` — Hook: *"Vibe coding has brought app development to everyone. But is it adequate for professional-level work?"* → three sub-questions: enterprise-grade? consistent/predictable? where do tools still fall short?
- **3 · The spectrum** `bullets-strong` — Four methods listed with one-line description each — establishes the map before we zoom in

---

### Restaurant 1 — BLAZE & BLADE · Autocomplete+ — 6–13 min

- **4 · Blaze & Blade** `quote` — Entrance + owner merged: restaurant name, tagline *"You cook. We make you faster."*, straight into the monologue *"I'll win because…"* (storytelling.md)
- **5 · The kitchen** `bullets` — What Autocomplete+ is: inline suggestions, dev stays fully in control, AI as accelerator not author
- **6 · Best fit** `bullets-note` — Daily dev, known patterns, boilerplate, refactoring — note: this is what most teams already have
- **7 · Customer reviews** `quote` — Three reviews from storytelling.md — one per slide or all three on one (TBD)
- **8 · La Pagella** `bullets-strong` — Creativity ⬛⬛⬜⬜⬜ · Quality ⬛⬛⬛⬜⬜ · Predictability ⬛⬛⬛⬜⬜ · etc.

---

### Restaurant 2 — THE MYSTERY PLATE · Vibe coding — 13–21 min

- **9 · The Mystery Plate** `quote` — Entrance + owner merged: restaurant name, tagline *"Tell us how you feel. Eat what arrives."*, straight into *"I'll win because…"* (storytelling.md)
- **10 · The kitchen** `bullets` — What vibe coding is: near-unassisted generation, fast, creative, no guardrails
- **11 · The hidden debt** `bullets-note` — Low effort upfront — but the cleanup lands later; the debt is real, just deferred
- **12 · Quality ≠ Predictability** `two-column` — Key distinction: left = high quality possible / right = you won't know until it's done
- **13 · Customer reviews** `quote` — Three reviews — last one is the CTO posting from a different restaurant
- **14 · La Pagella** `bullets-strong` — Creativity ⬛⬛⬛⬛⬛ · Quality ⬛⬜⬜⬜⬜ · Predictability ⬛⬜⬜⬜⬜ · etc.

---

### Restaurant 3 — CHEF & CO. · Agent as junior dev — 21–29 min

- **15 · Chef & Co.** `quote` — Entrance + owner merged: restaurant name, tagline *"Great food. We're watching."*, straight into *"I'll win because…"* (storytelling.md)
- **16 · The kitchen** `bullets` — What agent-as-junior-dev is: discrete scoped tasks, effort shifts to reviewing and directing
- **17 · The supervision problem** `bullets-note` — How many stations can one chef watch? — the scaling ceiling of this method
- **18 · Customer reviews** `quote` — Three reviews — last one: *"hire more chefs or fewer robots"*
- **19 · La Pagella** `bullets-strong` — Creativity ⬛⬛⬛⬜⬜ · Quality ⬛⬛⬛⬜⬜ · etc.

---

### Restaurant 4 — THE LAMINATED MENU · Spec-driven — 29–36 min

- **20 · The Laminated Menu** `quote` — Entrance + owner merged: restaurant name, tagline *"Every dish. Every time. Exactly."*, straight into *"I'll win because…"* (storytelling.md)
- **21 · The kitchen** `bullets` — Core problem spec-driven solves: context rot + unpredictability. Consistency becomes contractual; the spec is the real work, not the code
- **22 · The toolbox** `bullets-strong` — The spec-driven landscape: **GSD** low overhead, fresh contexts, 48K stars · **BMAD** 21+ agents, full enterprise lifecycle · **Kiro** IDE-first, AWS-native · **Tessl** spec-as-source, most radical
- **23 · The upfront cost** `bullets-note` — Writing the spec is the real work — returns compound over time; the spec itself evolves into documentation
- **24 · Customer reviews** `quote` — Three reviews — last one: *"I'll be back for anything mission-critical"*
- **25 · La Pagella** `bullets-strong` — Creativity ⬛⬜⬜⬜⬜ · Quality ⬛⬛⬛⬛⬛ · Predictability ⬛⬛⬛⬛⬛ · etc.

---

### Closing — 36–40 min

- **26 · Il confronto** `feature-grid` or `two-column` — Full KPI matrix — all four restaurants side by side
- **27 · Back in the van** `quote` — Borghese closing monologue: *"The best restaurant isn't the one with the highest score…"*
- **28 · Which kitchen suits you?** `bullets-strong` or `feature-grid` — Decision framework: method → best fit scenario (from talk-overview.md)
- **29 · The three questions — answered** `bullets` — Callback to slide 2: enterprise-grade? predictable? where do tools still fall short?
- **30 · Q&A** `title-closing` — Speaker info, links, prompt to ask

---

## Open questions

- **Reviews: one slide or three?** One slide is tighter; three slides give each review more air and build rhythm. The third review in each restaurant is the punchline — it might benefit from its own slide.
- **Entrance + owner merge layout:** Slides 4/9/15/20 combine two different beats. `quote` works if the monologue leads; alternatively a `title` slide with the tagline and a pull-quote. Needs testing in the YAML to see what reads best.
- **Il confronto format (slide 26):** The `feature-grid` layout could show each restaurant as a card with its scores. Needs checking against the layout spec — the matrix might be better as a `two-column` or a custom `bullets-strong` with all four columns.
- **Slide count:** 30 slides for 40 minutes = ~1:20 per slide average. Comfortable pacing, especially for review and La Pagella slides which can move fast.
- **Tool naming in slide 22:** Naming GSD/BMAD/Kiro/Tessl makes the talk concrete and actionable, but tools move fast — by conference day some may have changed significantly. Option: name only 2 (GSD + BMAD as poles) and describe the others as a category.
