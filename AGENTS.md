# AI Heroes 2026 — agent guide

This folder prepares two sessions for the AI Heroes conference (November 2026), by Marco De Nittis
(Architect @ Synesthesia):

- **Talk** — *Documentation Is the King: How to Rule Your Agents*
- **Workshop** — *Pragmatic Agentic Development: Docs, Context and Workflow in Practice*

Both decks are plain YAML rendered by a small in-browser slide engine. The workshop is hands-on on the
`splitwise-lite/` sample project.

## Layout

```
.
├── AGENTS.md            ← you are here (CLAUDE.md imports it)
├── mise.toml            ← tasks: serve slides, validate decks, run the sample app
├── slides/              ← slide engine + decks (served as web root)
│   ├── index.html       ← renderer; default deck talk.yaml, others via ?presentation=<file>.yaml
│   ├── talk.yaml        ← TALK deck
│   ├── workshop.yaml    ← WORKSHOP deck
│   ├── assets/talk/     ← images for the talk     (YAML path: assets/talk/x.png)
│   ├── assets/workshop/ ← images for the workshop (YAML path: assets/workshop/x.png)
│   ├── themes/          ← 7 CSS themes
│   ├── lib/             ← engine + vendored libs — DO NOT MODIFY
│   ├── _samples/        ← example decks covering every layout
│   └── layout/          ← experimental 1920×1080 design variants (not used by the decks)
├── _docs/               ← ALL meta docs (outlines, abstracts, engine docs, references)
│   ├── INDEX.md         ← map of the docs
│   ├── talk/            ← abstract.md, outline.md
│   ├── workshop/        ← abstract.md, outline.md
│   ├── slides/          ← slide engine docs (README, layout reference, architecture)
│   └── _reference/      ← material from a previous talk, style reference only
└── splitwise-lite/      ← workshop sample project — has its own AGENTS.md and mise.toml
```

## Where to look

| For | Read |
|---|---|
| Map of all the docs | [`_docs/INDEX.md`](_docs/INDEX.md) |
| Talk: abstract, narrative, slide plan | [`_docs/talk/`](_docs/talk/) |
| Workshop: abstract, agenda, exercises | [`_docs/workshop/`](_docs/workshop/) |
| How the slide engine works, URLs, keys | [`_docs/slides/README.md`](_docs/slides/README.md) |
| Every layout and its fields | [`_docs/slides/presentation-reference.md`](_docs/slides/presentation-reference.md) |
| How the speaker built a previous talk | [`_docs/_reference/vibe-not-vibe/`](_docs/_reference/vibe-not-vibe/) |
| Editing slides (skill: rules, layout cheat sheet, gotchas) | [`.claude/skills/slides/SKILL.md`](.claude/skills/slides/SKILL.md) |
| Anything inside the sample project | [`splitwise-lite/AGENTS.md`](splitwise-lite/AGENTS.md) |

## Tasks (`mise tasks` for the full list)

| Command | What it does |
|---|---|
| `mise run slides` (alias `talk`) | Serve `slides/` on port 8091 and open the talk |
| `mise run workshop` | Serve `slides/` and open the workshop deck |
| `mise run serve` | Serve `slides/` without opening a browser |
| `mise run open [talk\|workshop]` | Open a deck on the running server |
| `mise run stop` | Stop the slides server |
| `mise run validate` | Check every deck parses; each slide has `layout` and `id` |
| `mise run splitwise` | Start the sample app (`splitwise-lite`, port 8000) |

The port is `SLIDES_PORT` (default 8091). YAML loads over HTTP only, not `file://`.
In the browser, ☰ → **Presentation** switches decks. The current deck is kept in `sessionStorage`.
To add a deck, also add it to `window.PRESENTATIONS` in `slides/index.html`.

## Rules for editing decks

- Content lives only in `slides/talk.yaml` and `slides/workshop.yaml`. Never edit `slides/lib/`.
- Use only layouts and fields listed in `_docs/slides/presentation-reference.md`.
- Every slide has a unique `id` and a `# ── N. Name ───` comment banner above it.
- 3–6 bullets per slide, titles under 70 characters. Mark unfinished content with `TODO:`.
- Reference only images that exist under `slides/assets/<deck>/`.
- Keep `_docs/<deck>/outline.md` in sync with the deck: when you add, remove or reorder slides,
  update the slide-id mapping in the outline.
- Run `mise run validate` after every deck change.

## Rules for the sample project

- `splitwise-lite/` is the workshop material: its state is part of the exercises. Do not change it
  unless the task is explicitly about the sample project; then follow `splitwise-lite/AGENTS.md`.

## Docs

- Every meta doc (planning, outlines, notes, research) goes in `_docs/`, never in the root or `slides/`.
- When you add a doc, add one line for it in `_docs/INDEX.md`.
