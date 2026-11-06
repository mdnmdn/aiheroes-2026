---
name: slides
description: Create, edit, reorder, review and preview slides in this repo's YAML slide engine (slides/talk.yaml, slides/workshop.yaml, or a new deck). Use whenever the user asks to add/change/remove/move a slide, pick a layout, change a deck theme, add images, add a new deck, run or open the slides, or check that a deck is valid.
---

# Slides — YAML deck engine

Decks are plain YAML in `slides/`, rendered by `slides/index.html` + `slides/lib/presentation.js`.
Full docs (read on demand, don't guess fields):

| Need | Read |
|---|---|
| Every layout + its fields, YAML examples | `_docs/slides/presentation-reference.md` |
| Running, URLs, themes, adding a deck | `_docs/slides/README.md` |
| Engine internals (loading order, renderers) | `_docs/slides/presentation-framework-structure.md` |
| Talk / workshop narrative and slide-id map | `_docs/talk/outline.md`, `_docs/workshop/outline.md` |

## Hard rules

- Edit content only in `slides/<deck>.yaml`. **Never touch `slides/lib/`.**
- Use only layouts and fields from the reference. Unknown layout = whole deck fails to render.
- Every slide: unique `id` (kebab-case) and a banner comment above it, numbered in order:
  ```yaml
    # ── 7. Virtuous circle ──────────────────────────────────────────
    - layout: diagram
      id: virtuous-circle
  ```
  Renumber the banners after inserting, removing or moving slides.
- 3–6 bullets per slide, titles under 70 chars, one idea per slide. Unfinished content: `TODO:`.
- Images only from `slides/assets/<deck>/`, path written as `assets/<deck>/x.png`. Check the file exists.
- Keep `_docs/<deck>/outline.md` in sync: its act table lists slide ids — update it on add/remove/reorder/rename.
- Run `mise run validate` after every change. Fix until it passes.

## Layout cheat sheet

| Want | Layout | Key fields |
|---|---|---|
| Opening / closing | `title` / `title-closing` | h1, subtitle, tagline, logo / h1, items, tagline |
| Chapter break | `section-divider` | h2, tagline |
| Bullets | `bullets`, `bullets-note`, `bullets-badge`, `bullets-badge-note` | h2, items, note, badge |
| Term: definition | `bullets-strong` | h2, items[{term, desc}] |
| Side by side (text/code/graph/image/badge) | `two-column` | h2, columns[2], badge, note |
| Code | `code` | h2, code, language, note |
| Mermaid | `diagram` | h2, graph, note |
| Cards (2–6) | `feature-grid` | h2, cards[{icon, h3, text}] |
| Process (3–5) | `steps` | h2, steps[{h3, text}] |
| Quote | `quote` | quote, attribution |
| One big number / up to 6 | `stat-hero` / `kpis` | label, stat, description / h2, items[{value, label}], note |
| Free-form / big image | `fullpage` | h1\|h2, text, items, image, code, badge, note |

Prefer `two-column` over legacy aliases (`image-right/left`, `text-code-*`, `text-badge-*`, `two-column-note`).

## Gotchas

- No backticks in slide text — they render badly. Use quotes or a `badge`.
- Mermaid: line breaks inside labels use `<br>`; `\n` prints literally.
- Strings with `:` , `#`, or leading `-`/`*` must be quoted. Use `|` for code and graphs.
- Text is HTML-escaped (`esc()` in `lib/presentation.js`): `<em>`, `<br>`, `&rarr;` show literally.
  Use plain Unicode (→, ·, —) instead. Mermaid labels are the exception (`<br>` works there).
- No speaker notes, animations or video in this engine. Put notes in the outline.
- Theme picked from the ☰ menu is stored in `localStorage` and overrides `meta.theme`.

## Run and preview

```bash
mise run validate           # always, after edits
mise run slides             # serve on :8091 + open talk (alias: talk)
mise run workshop           # serve + open workshop
mise run open workshop      # open on a running server
mise run stop
```

Deep link: `http://localhost:8091/index.html?presentation=workshop.yaml#slide=<id>`.
To check rendering visually, serve and screenshot the slide with the browser skill (agent-browser/playwright).

## New deck

1. `slides/<name>.yaml` (start from `slides/_samples/quick-demo.yaml`), `meta.title` required, `editing: false`.
2. Images in `slides/assets/<name>/`.
3. Add `{ title: '...', file: '<name>.yaml' }` to `window.PRESENTATIONS` in `slides/index.html`.
4. Outline in `_docs/<name>/outline.md` + one line in `_docs/INDEX.md`.
5. `mise run validate`.
