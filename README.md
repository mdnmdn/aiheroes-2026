# AI Heroes 2026 — Documentation Is the King

Material for two sessions at [AI Heroes 2026](https://aiheroes.it/2026/agenda) (November 2026),
by Marco De Nittis (Architect @ Synesthesia):

- **Talk** — *Documentation Is the King: How to Rule Your Agents*
- **Workshop** — *Pragmatic Agentic Development: Docs, Context and Workflow in Practice*

- Conference agenda: <https://aiheroes.it/2026/agenda>
- Workshop sample project: <https://github.com/mdnmdn/aiheroes-2026-splitwise-sample>

## Quick start

```sh
mise run talk       # serve slides and open the talk deck (port 8091)
mise run workshop   # open the workshop deck
mise run splitwise  # start the workshop sample app (port 8000)
```

## Layout

- `slides/` — YAML decks (`talk.yaml`, `workshop.yaml`) and the in-browser slide engine
- `_docs/` — abstracts, outlines, slide engine docs ([index](_docs/INDEX.md))
- `splitwise-lite/` — hands-on sample project for the workshop
  ([standalone repo](https://github.com/mdnmdn/aiheroes-2026-splitwise-sample))

See [AGENTS.md](AGENTS.md) for the full guide and editing rules.
