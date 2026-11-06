# Documentation Is the King: How to Rule Your Agents

Talk outline (skeleton). Deck: `slides/talk.yaml`. Abstract: `abstract.md`.

---

## Talk metadata

|                   |                                                       |
|-------------------|-------------------------------------------------------|
|**Event**          |AI Heroes, November 2026                               |
|**Speaker**        |Marco De Nittis, Architect @ Synesthesia               |
|**Format**         |TBD (standard session?)                                |
|**Duration**       |TBD (assumed 30-40 min in the timing below)            |
|**Track**          |TBD (AI / Developer Productivity?)                     |
|**Audience**       |Developers, tech leads, architects who work with coding agents |
|**Theme**          |root-shell                                             |

---

## Narrative arc

1. **The old deal.** Documentation was the task that slowed teams down: written late, read rarely,
   stale by the next release.
2. **The flip.** An agent arrives with no memory. It acts on what is written. Docs now decide how
   fast and how well the AI delivers. A stale document is worse than a missing one.
3. **The virtuous circle.** Better docs give better agent output. The agent that makes a change
   updates the docs in the same change, so upkeep gets cheaper and the docs get better.
4. **Self-organizing docs.** Replace a bloated instruction file with a library: a short entry point
   that is a map, frontmatter that says when to read each doc, one owner per fact, a librarian
   agent that keeps the structure.
5. **Practical tips.** What the audience can apply on Monday, for humans and agents.

Running example: `splitwise-lite/` (its `AGENTS.md`, `_docs/Home.md` and `_docs/_meta/`).

---

## Act-by-act outline

| # | Act | Slide ids | Time (TBD) |
|---|-----|-----------|------------|
| 0 | Opening | `cover`, `hook`, `agenda` | 0-3 min |
| 1 | The old deal | `act1-old-deal`, `docs-bottleneck` | 3-6 min |
| 2 | The flip: agents act on what is written | `act2-flip`, `no-memory`, `human-vs-agent`, `docs-drive-output` | 6-12 min |
| 3 | The virtuous circle | `act3-circle`, `virtuous-circle`, `circle-practices`, `circle-evidence` | 12-19 min |
| 4 | Self-organizing docs vs bloated instruction files | `act4-self-organizing`, `bloated-vs-library`, `agents-map`, `building-blocks`, `frontmatter-example` | 19-29 min |
| 5 | Practical tips | `act5-tips`, `tips`, `tooling` | 29-35 min |
| 6 | Closing + Q&A | `closing` | 35-40 min |

### Act 1 — The old deal
- `docs-bottleneck`: written late, read rarely, stale fast, low ROI.
- TODO: add a sourced stat or a personal anecdote (a `stat-hero` slide was dropped from the skeleton).

### Act 2 — The flip
- `no-memory`: quote from splitwise-lite `docs-guidelines.md` §1.
- `human-vs-agent`: humans route around bad docs; agents believe them.
- `docs-drive-output`: docs → context → output. TODO: one real before/after example.

### Act 3 — The virtuous circle
- `virtuous-circle`: diagram of the loop.
- `circle-practices`: same session, same commit; one fact one owner; present tense.
- `circle-evidence`: TODO: real numbers or drop.

### Act 4 — Self-organizing docs
- `bloated-vs-library`: one big file loaded every time vs a map plus focused docs.
- `agents-map`: excerpt of the "Where to look" table in splitwise-lite `AGENTS.md`.
- `building-blocks`: Home map, frontmatter, librarian agent, STE writing, glossary, phases.
- `frontmatter-example`: `summary`, `read_when`, `verified` fields.

### Act 5 — Practical tips
- `tips`: five tips, TODO.
- `tooling`: `mise run digest`, `docs-touched`, `docs-lint` from splitwise-lite `_meta/tools.md`.

---

## Key messages

1. Agents act on what is written. Docs are now the input, not the afterthought.
2. A stale document is worse than a missing one.
3. Close the loop: the change and the doc update ship together.
4. The entry point is a map, not a manual. Read two or three documents, no more.
5. Write for the agent first. It also helps the human who arrives cold.

---

## Open questions / TODOs

- [ ] Confirm format, duration and track with the organizers.
- [ ] Hook line for `hook` (or drop the slide).
- [ ] Evidence: numbers for `circle-evidence` and a stat for Act 1. Source or drop.
- [ ] One concrete before/after story for Act 2.
- [ ] Storytelling device (the previous talk used *4 Ristoranti*). Is there one for this talk?
- [ ] Live demo or screenshots of splitwise-lite? Assets go in `slides/assets/talk/`.
- [ ] Final list of five practical tips.
- [ ] Link with the workshop: where to point attendees at the end.
- [ ] Closing slide: contacts and repo link.
