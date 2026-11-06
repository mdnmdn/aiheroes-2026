# Dynamic Presentation System

Create, deliver, and share beautiful presentations with pure YAML. No design skills needed.

This document covers both **human usage** and **AI agent integration**.

> In this repo the engine lives in [`slides/`](../../slides/) (renderer: [`slides/index.html`](../../slides/index.html), engine: [`slides/lib/presentation.js`](../../slides/lib/presentation.js)). The two decks are [`slides/talk.yaml`](../../slides/talk.yaml) (default) and [`slides/workshop.yaml`](../../slides/workshop.yaml). All paths inside a YAML deck (images, logos) are relative to `slides/`, e.g. `assets/talk/x.png`.

---

## Quick Start

### 1. Run the Decks

From the project root (tasks defined in [`mise.toml`](../../mise.toml)):

```bash
mise run slides      # serve slides/ on port 8091 and open the talk deck (alias: mise run talk)
mise run workshop    # serve slides/ and open the workshop deck
mise run serve       # serve slides/ without opening a browser
mise run open workshop   # open a deck on an already-running server (talk|workshop)
mise run stop        # stop the server on port 8091
mise run validate    # check every slides/*.yaml parses and each slide has layout + id
```

Without mise (fallback):

```bash
cd slides && python3 -m http.server 8091
open http://localhost:8091/                                     # talk.yaml (default)
open "http://localhost:8091/index.html?presentation=workshop.yaml"
```

Example decks live in `slides/_samples/` — load e.g. `?presentation=_samples/full-demo.yaml`. Use arrow keys to navigate.

### 2. Create Your First Presentation

Create a file named `slides/my-presentation.yaml`:

```yaml
meta:
  title: "My First Presentation"
  theme: mission-control
  editing: false

slides:
  - layout: title
    h1: "Welcome"
    subtitle: "My Talk"
    tagline: "Let's go!"

  - layout: bullets
    h2: "Main Points"
    items:
      - First point
      - Second point
      - Third point

  - layout: title-closing
    h1: "Thank You"
    tagline: "Questions?"
```

Load it in your browser:

```
http://localhost:8091/index.html?presentation=my-presentation.yaml
```

---

## What You Can Do

- **24 layout names** (19 canonical + 5 legacy aliases) — titles, bullets, code, images, grids, and more
- **7 themes** — instantly switch at runtime from the ☰ menu
- **Edit mode** — modify content in-browser and export as HTML (disabled in this repo's `index.html`, see below)
- **Offline support** — works on file:// protocol
- **Named slide navigation** — shareable links to specific slides
- **Responsive design** — works on all screen sizes
- **No setup** — just YAML files, no build tools needed

What this system doesn't do: no animations, no speaker notes, no video embedding, no collaboration tools.

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| `→` or `Space` | Next slide |
| `←` | Previous slide |
| `L` | Go to last slide |
| `R` | Reload the presentation |
| `F` `F` (double press) | Toggle fullscreen |
| `H` `H` (double press) | Go to `index.html` (default deck) |
| `E` | Toggle edit mode (only if `window.EDIT_MODE_ENABLED !== false`) |
| `Ctrl+S` / `Cmd+S` | Export to HTML file (in edit mode) |
| Click dots | Jump to specific slide |
| Click `☰` (top-right menu) | Home / Refresh / Last / Fullscreen / change theme |

---

## Content Format: YAML

### Basic Structure

```yaml
meta:
  title: "Presentation Title"
  theme: mission-control        # Optional: launch-pad, root-shell, grid-zero, teal-mustard, navy-apricot, violet-tokyo
  editing: false                # Optional: allow editing (default: true)

slides:
  - layout: title
    id: intro                    # Optional: for direct linking
    h1: "Main Title"
    subtitle: "Subtitle"

  - layout: bullets
    id: main-content
    h2: "Key Points"
    items:
      - First point
      - Second point
      - Third point

  - layout: title-closing
    h1: "Thank You"
```

### Available Layouts (24 layout names)

The renderers in `slides/lib/presentation.js` accept 24 layout names: the 19 layouts with their own section in the reference, plus 5 legacy aliases (`two-column-note`, `text-code-right`, `text-code-left`, `text-badge-right`, `text-badge-left`). The table below is a quick summary; `bullets-badge-note`, `text-code-left`, `text-badge-left` and `two-column-note` are covered only in the reference.

| Layout | Purpose | Key Fields |
|--------|---------|-----------|
| `title` | Opening slide | h1, subtitle, tagline, logo |
| `bullets` | Bullet list | h2, items[] |
| `bullets-note` | List + note | h2, items[], note |
| `bullets-badge` | List + command | h2, items[], badge |
| `bullets-strong` | Term + description pairs | h2, items[] |
| `two-column` | Side-by-side | h2, columns[] |
| `code` | Code block | h2, code, language |
| `diagram` | Mermaid diagram | h2, graph |
| `feature-grid` | Card grid | h2, cards[] |
| `quote` | Block quote | quote, attribution |
| `image-right` | Text + image | h2, items[], image |
| `image-left` | Image + text | h2, items[], image |
| `steps` | Numbered steps | h2, steps[] |
| `section-divider` | Chapter break | h2, tagline |
| `stat-hero` | Large metric | label, stat |
| `kpis` | KPI grid (up to 6, 3×2) | h2, items[]{value,label}, note |
| `fullpage` | Versatile single-column canvas | h1/h2, text, items[], image, code, badge, note (all optional) |
| `text-code-right` | Text left, code right | h2, items[], code |
| `text-badge-right` | Text left, badge right | h2, items[], badge |
| `title-closing` | Closing slide | h1, items[] |

Full specifications: see [presentation-reference.md](presentation-reference.md)

---

## Themes

| Name | Style |
|------|-------|
| `launch-pad` | Navy + Gold (professional) |
| `root-shell` | Green + Blue (terminal/dev) |
| `grid-zero` | Cyan + Magenta (neon/cyber) |
| `mission-control` | Gold + Blue (space/NASA) |
| `teal-mustard` | Dark Teal + Mustard (warm editorial, serif) |
| `navy-apricot` | Navy + Apricot (structured editorial, serif) |
| `violet-tokyo` | Deep Violet + Hot Pink (high-energy, particles) |

Set in YAML:
```yaml
meta:
  theme: root-shell
```

Or via URL: `?presentation=demo.yaml&style=grid-zero`

Note: the last theme picked from the menu is saved in `localStorage` (`presentation-theme`) and takes precedence over both `meta.theme` and `&style=`. Pick the theme again from the ☰ menu (or clear localStorage) if a deck does not show its declared theme.

---

## URL Generation

```
index.html?presentation=file.yaml&style=theme#slide=id
```

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `?presentation=` | Load YAML file (path relative to `slides/`; default `talk.yaml`) | `?presentation=workshop.yaml` |
| `&style=` | Set theme | `&style=grid-zero` |
| `#slide=` | Navigate to slide | `#slide=intro` or `#slide=3` |

---

## File Organization

```
slides/                                 ← served root (mise run serve)
├── index.html                          ← Renderer; default deck set by window.DEFAULT_PRESENTATION_FILE = 'talk.yaml'
├── talk.yaml                           ← Talk deck (default)
├── workshop.yaml                       ← Workshop deck (?presentation=workshop.yaml)
├── favicon.ico                         ← old avatar icon, fallback only
├── assets/
│   ├── talk/                          ← Images for talk.yaml (assets/talk/x.png)
│   └── workshop/                      ← Images for workshop.yaml
│   └── icons/                         ← Favicon (icon-creation skill): icons.yaml, brand-doc-king.svg, export/*.png linked from index.html
├── lib/                               ← Engine (do not modify)
│   ├── presentation.js                ← Loader, layout renderers, navigation, menu
│   ├── presentation.css               ← Base styles
│   ├── highlight.min.js + highlight-github-dark.min.css ← Syntax highlighting
│   ├── mermaid.min.js                 ← Diagram renderer
│   └── js-yaml.min.js                 ← YAML parser
├── themes/                            ← 7 themes
│   ├── theme-launch-pad.css
│   ├── theme-root-shell.css
│   ├── theme-grid-zero.css
│   ├── theme-mission-control.css
│   ├── theme-teal-mustard.css
│   ├── theme-navy-apricot.css
│   └── theme-violet-tokyo.css
├── _samples/                          ← Example decks: presentation.yaml, full-demo.yaml, quick-demo.yaml, index-embedded.html
└── layout/                            ← Experimental 1920x1080 design variants (see below)
    ├── templates.html
    ├── deck-stage.js
    └── *.jpg                          ← Screenshots of the variants

_docs/slides/
├── README.md                          ← You are here (humans + agents)
├── presentation-reference.md          ← Complete layout specs
└── presentation-framework-structure.md ← System architecture
```

There is no separate directory page: `index.html` is the renderer itself. The decks are listed in `window.PRESENTATIONS` in `index.html` and shown in the ☰ menu under **Presentation** (see [Switch Between Decks](#switch-between-decks)).

---

## slides/layout/ design variants

[`slides/layout/`](../../slides/layout/) is a design sandbox, **not** used by the YAML engine.

- [`templates.html`](../../slides/layout/templates.html) — a standalone HTML deck ("AI Coding — Blueprint variants") with ~10 hand-written 1920x1080 slides exploring "blueprint" palettes (teal & mustard, navy & apricot, Tokyo neon, cyber mint, acid, violet, violet/pink hybrids) on pipeline, stat, code, manifesto and ordinal compositions. Several YAML themes (`teal-mustard`, `navy-apricot`, `violet-tokyo`) derive from these.
- [`deck-stage.js`](../../slides/layout/deck-stage.js) — the `<deck-stage>` web component that runs `templates.html`: each direct `<section>` child is a slide on a fixed design canvas auto-scaled/letterboxed to the viewport; keyboard nav (←/→, PgUp/PgDn, Space, Home/End, number keys, `R` to reset), a fading slide-count overlay, optional speaker notes via `<script type="application/json" id="speaker-notes">`, a `slidechange` event, and `@media print` one-slide-per-page output for PDF.
- `*.jpg` — reference screenshots of selected variants.

View it at `http://localhost:8091/layout/templates.html` while the server runs. Use it to prototype a look before porting it to a theme CSS file.

---

## Common Tasks

### Create a New Presentation (add a deck)

1. Create `slides/my-talk.yaml` with your content (start from `slides/_samples/quick-demo.yaml` or the example above)
2. Put its images in `slides/assets/my-talk/` and reference them as `assets/my-talk/x.png`
3. Give every slide a `layout` and an `id`, then run `mise run validate`
4. Load it: `http://localhost:8091/index.html?presentation=my-talk.yaml` (or `mise run open my-talk`)
5. Add it to the ☰ menu: append `{ title: 'My Talk', file: 'my-talk.yaml' }` to `window.PRESENTATIONS` in `slides/index.html`
6. Optional: add a `[tasks.my-talk]` entry in `mise.toml` mirroring `tasks.workshop`

### Switch Between Decks

`slides/index.html` lists the decks in the ☰ menu:

```javascript
window.PRESENTATIONS = [
    { title: 'Talk — Documentation Is the King', file: 'talk.yaml' },
    { title: 'Workshop — Pragmatic Agentic Development', file: 'workshop.yaml' },
];
```

- The menu shows a **Presentation** section above **Theme**. The current deck is marked `▸`.
- Pick a deck to load `index.html?presentation=<file>` on the last slide you viewed in that deck.
- The current deck is saved in `sessionStorage` (`presentation-current`). A reload, a plain `index.html`, ☰ → Home and `H` `H` keep it. The setting lasts for the browser tab. A new tab starts on `DEFAULT_PRESENTATION_FILE`.
- The last slide is saved per deck (`presentation-last-<file>`), so switching decks does not lose your place.

### Change the Default Deck

Edit `window.DEFAULT_PRESENTATION_FILE` in `slides/index.html` (currently `'talk.yaml'`). Loading order in `presentation.js`: `?presentation=` param, else the deck saved in `sessionStorage` (HTTP only) → embedded `<script id="defaultPresentation">` YAML (only when no default file is set) → `DEFAULT_PRESENTATION_FILE` (fallback `presentation.yaml`).

### Enable Edit Mode

`slides/index.html` sets `window.EDIT_MODE_ENABLED = false`, which hides the ✏️ toggle and disables `E`. Remove that line (temporarily) to edit in the browser; `meta.editing: false` still disables it per deck.

### Share a Specific Slide

Add `id` fields to slides, then link with `#slide=name`:

```yaml
slides:
  - layout: bullets
    id: main-points
    h2: "Key Points"
```

```
http://localhost:8091/index.html?presentation=my-talk.yaml#slide=main-points
```

### Export as PDF

Open in browser → `Cmd+P` (Mac) / `Ctrl+P` (Windows) → Save as PDF.

---

## For AI Agents

### What Agents Can Do

- Generate presentations from data/context
- Modify presentations by updating YAML files
- Extract content from presentations
- Generate presentation URLs with specific slides

### Integration Pattern

```
1. RECEIVE user request
2. GENERATE presentation YAML
3. VALIDATE structure
4. SAVE to file
5. GENERATE share URL
6. RETURN link to user
```

### Generate a Presentation (JavaScript)

```javascript
const yaml = require('js-yaml');
const fs = require('fs');

const deck = {
  meta: {
    title: "Q2 Metrics Report",
    theme: "mission-control",
    editing: false
  },
  slides: [
    { layout: "title", h1: "Q2 2026 Report", subtitle: "Business Metrics" },
    { layout: "stat-hero", label: "Revenue Growth", stat: "+15%" },
    { layout: "stat-hero", label: "User Base", stat: "50,000" },
    { layout: "title-closing", h1: "Looking Strong" }
  ]
};

fs.writeFileSync('report.yaml', yaml.dump(deck));
```

### Modify an Existing Presentation

```javascript
const yaml = require('js-yaml');
const fs = require('fs');

const deck = yaml.load(fs.readFileSync('my-presentation.yaml', 'utf8'));
deck.slides[1].items.push("New point added by agent");
deck.meta.theme = "grid-zero";
fs.writeFileSync('my-presentation.yaml', yaml.dump(deck));
```

### Validate Structure

```javascript
if (!deck.meta?.title) throw new Error("Missing meta.title");
if (!Array.isArray(deck.slides) || deck.slides.length === 0) throw new Error("Missing slides array");

deck.slides.forEach((slide, i) => {
  if (!slide.layout) throw new Error(`Slide ${i} missing layout`);
});
```

### Agent Best Practices

1. Always include `id` on slides — enables direct linking
2. Validate YAML before saving
3. Keep slide titles under 70 characters
4. Limit bullets to 3-6 items per slide
5. Use `editing: false` in final/shared presentations

---

## Constraints

- No animations or transitions (intentional)
- No speaker notes in the YAML engine (design constraint; `slides/layout/deck-stage.js` supports them, but only for hand-written HTML decks)
- No video embedding (intentional simplicity)
- No real-time collaboration (single-author)
- YAML loading requires HTTP (no `file://` cross-origin for custom presentations)

---

## Documentation References

- **[presentation-reference.md](presentation-reference.md)** — Complete layout reference (19 canonical layouts + legacy aliases, 25+ examples)
- **[presentation-framework-structure.md](presentation-framework-structure.md)** — System architecture and internals
- **[../INDEX.md](../INDEX.md)** — Index of all project docs

---

**Version:** 1.2 | **Last Updated:** 2026-11-05 (relocated to `slides/` + `_docs/slides/`)
