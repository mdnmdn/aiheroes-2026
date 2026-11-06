# Presentation Creator's Reference

Complete guide for creating and customizing presentations. Covers YAML syntax, layouts, metadata, and best practices.

**Audience:** Presentation creators and content developers  
**Purpose:** Learn how to build presentations using YAML and the available layouts

---

## 📋 Quick Start

### 1. Create a YAML File

Create a file named `slides/my-presentation.yaml` (asset paths inside it are relative to `slides/`):

```yaml
meta:
  title: "My Presentation"
  theme: mission-control
  editing: false

slides:
  - layout: title
    id: intro
    h1: "Welcome"
    subtitle: "My Talk"
    tagline: "Let's go!"

  - layout: bullets
    id: main-points
    h2: "Key Points"
    items:
      - First point
      - Second point
      - Third point

  - layout: title-closing
    id: closing
    h1: "Thank You"
    tagline: "Questions?"
```

### 2. Load the Presentation

```bash
# From the project root
mise run serve                          # or: cd slides && python3 -m http.server 8091
# Open: http://localhost:8091/index.html?presentation=my-presentation.yaml
```

`mise run slides` / `mise run workshop` serve and open the two project decks (`talk.yaml` is the default deck).

---

## 📝 Metadata (meta)

Top-level configuration for your presentation.

```yaml
meta:
  title: "Presentation Title"        # Required: shown in browser tab
  subtitle: "Optional subtitle"       # Optional: used in some layouts
  tagline: "Short description"        # Optional: appears below subtitle
  logo: "logo-small.png"             # Optional: relative path to image
  theme: "mission-control"           # Optional: default theme
  themes: [...]                      # Optional: available themes
  editing: true                      # Optional: enable/disable edit mode
```

### theme Options

Available themes:
- `launch-pad` — Navy + Gold (professional)
- `root-shell` — Green + Blue (terminal)
- `grid-zero` — Cyan + Magenta (neon)
- `mission-control` — Gold + Blue (space)
- `teal-mustard` — Dark Teal + Mustard (warm editorial, serif)
- `navy-apricot` — Navy + Apricot (structured editorial, serif)
- `violet-tokyo` — Deep Violet + Hot Pink (high-energy, particles)

### editing

- `editing: true` — Allows editing via `E` key (default; note `slides/index.html` sets `window.EDIT_MODE_ENABLED = false`, which disables edit mode globally)
- `editing: false` — Disables edit mode UI

Can be overridden globally with `window.EDIT_MODE_ENABLED = false` in HTML.

---

## 🎯 Slide Structure

Every slide has:
- **layout** (required) — Type of slide (title, bullets, etc.)
- **id** (optional) — Unique identifier for direct linking

```yaml
slides:
  - layout: title
    id: my-slide-name
    h1: "Title"
    # ... layout-specific fields
```

### Named Slide Navigation

Give slides IDs to enable direct linking:

```yaml
slides:
  - layout: title
    id: intro              # Access via: #slide=intro
    h1: "Introduction"

  - layout: bullets
    id: key-points        # Access via: #slide=key-points
    h2: "Key Points"
```

**URL Examples:**
```
index.html                           (first slide, clean URL)
index.html#slide=key-points          (named slide)
index.html#slide=2                   (numeric index)
```

---

## 🎨 Slide Layouts

### 1. `title` — Opening Slide

Opening slide with optional logo and branding.

```yaml
- layout: title
  id: opening
  logo: assets/logo-small.png           # Optional
  h1: "Main Title"               # Required
  subtitle: "Subtitle"           # Optional
  tagline: "Tagline text"        # Optional
```

**Use for:** Presentation start, section openers

---

### 2. `title-closing` — Closing Slide

Closing slide with optional bullet points.

```yaml
- layout: title-closing
  id: closing
  logo: assets/logo-small.png           # Optional
  h1: "Thank You"                # Required
  items:                         # Optional: list of points
    - "Point one"
    - "Point two"
    - "Point three"
  tagline: "Questions?"          # Optional
```

**Use for:** Presentation end, thank you slides

---

### 3. `bullets` — Bullet List

Simple content slide with bullet points.

```yaml
- layout: bullets
  id: main-content
  h2: "Topic Title"              # Required
  items:                         # Required: list of strings
    - "First bullet"
    - "Second bullet"
    - "Third bullet"
    - "Fourth bullet"
```

**Use for:** Content delivery, key points, lists

---

### 4. `bullets-note` — Bullets + Note

Bullet list with explanatory note at the bottom.

```yaml
- layout: bullets-note
  id: bullets-with-note
  h2: "Main Points"              # Required
  items:                         # Required: 1-5 items
    - "Point one"
    - "Point two"
  note: "Additional explanation"  # Required: explanatory text
```

**Use for:** Content with clarification or disclaimer

---

### 5. `bullets-badge` — Bullets + Command Pill

Bullet list with highlighted command or keyword badge.

```yaml
- layout: bullets-badge
  id: command-example
  h2: "Git Commands"             # Required
  items:                         # Required: 1-5 items
    - "Initialize repository"
    - "Create branches"
    - "Merge changes"
  badge: "git init"              # Required: command or keyword
```

**Use for:** Code commands, highlighted keywords, action buttons

---

### 6. `bullets-badge-note` — Bullets + Badge + Note

Combination of bullets, badge, and note.

```yaml
- layout: bullets-badge-note
  id: complex-bullets
  h2: "Advanced Concept"         # Required
  items:                         # Required: 1-4 items
    - "Concept one"
    - "Concept two"
  badge: "npm install"           # Required
  note: "Additional context"     # Optional
  note_size: small               # Optional: 'small' or default
```

**Use for:** Technical explanations with examples

---

### 7. `bullets-strong` — Term + Description

Bullet list where items are term:description pairs.

```yaml
- layout: bullets-strong
  id: definitions
  h2: "Terminology"              # Required
  items:                         # Required: list of term+desc
    - term: "Commit"
      desc: "Snapshot of code at a point in time"
    - term: "Branch"
      desc: "Parallel line of development"
    - term: "Merge"
      desc: "Combine branches together"
```

**Use for:** Glossaries, definitions, key concepts

---

### 8. `two-column` — Unified Two-Column Layout

Two columns where each column independently renders as **items**, **code**, **diagram**, or **badge** based on which field is present.

#### Column types

Each column object supports one content field:

| Field | Renders as | Optional fields |
|-------|-----------|----------------|
| `items` | Bullet list | `h3`, `badge` |
| `code` | Syntax-highlighted code block | `language` |
| `graph` | Mermaid diagram | — |
| `image` | Image | `image_alt` |
| `badge` | Centered badge (alone, fills column) | — |

A slide-level `badge` field renders beneath the entire grid (before `note`), spanning the full width. It carries a top margin (`--content-gap`) to breathe away from the columns:

```yaml
- layout: two-column
  h2: "How it works"
  columns:
    - items:
        - Step 1: write the spec
        - Step 2: run the agent
    - code: |
        kiro generate --spec api.md
      language: bash
  badge: "$ kiro generate"          # Slide-level — appears below the grid
  note: "Optional note"             # Optional — appears after badge
```

#### Items + Items (classic comparison)

```yaml
- layout: two-column
  id: comparison
  h2: "Comparison Title"         # Required
  columns:                       # Required: exactly 2 columns
    - h3: "Left Column"          # Optional: column heading
      items:
        - "Point A1"
        - "Point A2"
    - h3: "Right Column"
      items:
        - "Point B1"
        - "Point B2"
  note: "Optional note below"    # Optional
```

#### Items + Code

```yaml
- layout: two-column
  id: explained-code
  h2: "How It Works"
  columns:
    - items:
        - "Step 1: Initialize"
        - "Step 2: Configure"
    - code: |
        const app = init();
        app.configure({ debug: true });
      language: javascript
```

#### Items + Diagram

```yaml
- layout: two-column
  id: architecture
  h2: "System Architecture"
  columns:
    - items:
        - "Client sends requests"
        - "API routes to services"
        - "Database persists data"
    - graph: |
        graph TD
          A[Client] --> B[API]
          B --> C[(DB)]
```

#### Code + Code

```yaml
- layout: two-column
  id: before-after
  h2: "Before / After"
  columns:
    - h3: "Before"
      code: |
        var x = 1;
        var y = 2;
      language: javascript
    - h3: "After"
      code: |
        const x = 1;
        const y = 2;
      language: javascript
```

#### Items + Image

```yaml
- layout: two-column
  id: feature-visual
  h2: "Feature Overview"
  columns:
    - items:
        - "Key benefit one"
        - "Key benefit two"
    - image: assets/screenshot.png
      image_alt: "Feature screenshot"
```

#### Items + Badge

```yaml
- layout: two-column
  id: command-highlight
  h2: "Key Command"
  columns:
    - items:
        - "Initialize repository"
        - "Create first commit"
    - badge: "git init"
```

**Use for:** Comparisons, code explanations, architecture + text, images, before/after

---

### 10. `code` — Code Block

Display code or terminal commands.

```yaml
- layout: code
  id: code-example
  h2: "Code Example"             # Required
  code: |                        # Required: literal code
    git commit -m "Fix bug"
    git push origin main
  note: "Commit message format"  # Optional: explanation
```

**Use for:** Code snippets, terminal commands, configuration

---

### 10b. `diagram` — Mermaid Diagram

Display Mermaid diagrams (flowcharts, sequence diagrams, class diagrams, etc.).

```yaml
- layout: diagram
  id: architecture
  h2: "System Architecture"         # Required
  graph: |                          # Required: Mermaid diagram definition
    graph LR
      A[Client] --> B[API Gateway]
      B --> C[Service]
      C --> D[(Database)]
  note: "Simplified architecture"   # Optional: explanation
```

**Use for:** Flowcharts, sequence diagrams, ER diagrams, architecture diagrams

for new line use <br>, \n is printed verbatim

---

### 11. `feature-grid` — Card Grid

Grid of cards with icons and descriptions (2-6 cards).

```yaml
- layout: feature-grid
  id: features
  h2: "Features"                 # Required
  cards:                         # Required: 2-6 cards
    - icon: "🚀"
      h3: "Fast"
      text: "Lightning quick performance"
    - icon: "🔒"
      h3: "Secure"
      text: "Enterprise-grade security"
    - icon: "♻️"
      h3: "Reliable"
      text: "99.9% uptime SLA"
```

**Use for:** Feature highlights, product overview, capability showcase

---

### 12. `quote` — Block Quote

Emphasize a key statement or quote.

```yaml
- layout: quote
  id: quote-example
  quote: "Every expert was once a beginner"  # Required
  attribution: "Author Name"     # Optional: who said it
```

**Use for:** Inspirational quotes, key statements, emphasis

---

### 13. `image-right` — Text Left, Image Right

Content with supporting image on the right.

```yaml
- layout: image-right
  id: img-right
  h2: "Feature with Image"       # Required
  items:                         # Optional: left side bullets
    - "Benefit one"
    - "Benefit two"
  image: "screenshot.png"        # Required: image path
  image_alt: "Screenshot of app" # Optional: alt text
```

**Use for:** Feature explanation with visual reference

---

### 14. `image-left` — Image Left, Text Right

Image on left, content on right (mirror of image-right).

```yaml
- layout: image-left
  id: img-left
  h2: "Image on Left"
  items:
    - "Point one"
    - "Point two"
  image: "diagram.png"           # Required
  image_alt: "Process diagram"
```

**Use for:** Before/after, process flows, visual documentation

---

### 15. `steps` — Numbered Process

Ordered steps or workflow visualization.

```yaml
- layout: steps
  id: workflow
  h2: "Getting Started"          # Required
  steps:                         # Required: 3-5 steps
    - h3: "Step 1: Setup"
      text: "Initialize the project"
    - h3: "Step 2: Configure"
      text: "Add your settings"
    - h3: "Step 3: Deploy"
      text: "Push to production"
```

**Use for:** Tutorials, processes, workflow diagrams

---

### 16. `section-divider` — Section Break

Visual separator between major sections.

```yaml
- layout: section-divider
  id: section-break
  h2: "Advanced Topics"          # Required
  tagline: "Let's dive deeper"   # Optional
```

**Use for:** Chapter breaks, section separators

---

### 17. `stat-hero` — Large Metric

Emphasize a key metric or statistic.

```yaml
- layout: stat-hero
  id: big-number
  label: "Success Rate"          # Optional: small label
  stat: "98%"                    # Required: the big number
  description: "of deployments"  # Optional: explanation
```

**Use for:** Key metrics, success rates, achievements

---

### 18. `kpis` — KPI Grid

Display up to 6 key metrics in a 3-column × 2-row grid. Each cell shows a big value and a smaller label.

```yaml
- layout: kpis
  id: metrics
  h2: "Q2 Performance"         # Optional: slide heading
  items:                       # Required: 1–6 items
    - value: "98%"
      label: "Uptime"
    - value: "+42%"
      label: "Revenue growth"
    - value: "1.2s"
      label: "Avg response time"
    - value: "50K"
      label: "Active users"
    - value: "12"
      label: "Services deployed"
    - value: "0"
      label: "Critical incidents"
  note: "Q2 2026 · YoY comparison"  # Optional
```

**Use for:** Dashboards, scorecards, KPI reviews, La Pagella-style ratings

---

### 19. `fullpage` — Versatile Single-Column Canvas

A free-form single-column layout. All fields are optional — use any combination to compose the slide you need. Content stacks top to bottom; the image expands to fill remaining vertical space.

```yaml
- layout: fullpage
  id: my-slide
  h1: "Big Headline"              # optional — large title (use h1 OR h2, not both)
  h2: "Section Heading"          # optional — h2 heading
  text: "Prose paragraph text."  # optional — body paragraph
  items:                         # optional — bullet list
    - First point
    - Second point
  image: assets/photo.png        # optional — fills remaining height
  image_alt: "Alt text"
  code: |                        # optional — code block
    some code here
  language: python               # optional — syntax highlighting language
  badge: "$ run command"         # optional — command pill
  note: "Footer note text"       # optional — muted note
```

**All fields are optional.** Any combination works:
- Image only → large padded visual
- Heading + items + image → captioned visual with bullets
- Heading + text + code → prose + code block
- Items + badge + note → command reference with context

**Use for:** Full-bleed visuals, image + caption combos, rich single-column content, anything that doesn't fit two-column

---

## 🎯 Legacy Layouts (Deprecated)

The following layouts still work as aliases. Prefer the canonical equivalents instead.

| Legacy layout | Use instead |
|---------------|------------|
| `two-column-note` | `two-column` with `note` |
| `text-code-right` | `two-column` columns: `[{items}, {code}]` |
| `text-code-left` | `two-column` columns: `[{code}, {items}]` |
| `text-badge-right` | `two-column` columns: `[{items}, {badge}]` |
| `text-badge-left` | `two-column` columns: `[{badge}, {items}]` |
| `image-right` | `two-column` columns: `[{items}, {image}]` |
| `image-left` | `two-column` columns: `[{image}, {items}]` |

---

## 🎨 Themes

Switch themes at runtime or set default in metadata.

```yaml
meta:
  theme: root-shell      # Set default theme
```

**Available themes:**
1. **Launch Pad** — Navy + Gold (professional)
2. **Root Shell** — Green + Blue (terminal/dev)
3. **Grid Zero** — Cyan + Magenta (neon/cyber)
4. **Mission Control** — Gold + Blue (space/NASA)
5. **Teal Mustard** — Dark Teal + Mustard (warm editorial, serif)
6. **Navy Apricot** — Navy + Apricot (structured editorial, serif)
7. **Violet Tokyo** — Deep Violet + Hot Pink (high-energy, particles)

**Runtime switching:** Click the ☰ menu (top-right) and pick a theme. The choice is saved in `localStorage` and overrides `meta.theme` on later loads.

---

## ✏️ Edit Mode

### Enable/Disable

```yaml
meta:
  editing: true   # Allow editing (default)
  editing: false  # Disable editing
```

### Keyboard Controls

- **`E`** — Toggle edit mode on/off
- **`Ctrl+S`** or **`Cmd+S`** — Export presentation as HTML

### Disable Globally

Add this to your HTML file (before `presentation.js` loads):

```html
<script>
  window.EDIT_MODE_ENABLED = false;
</script>
```

---

## 🔗 Complete Example

```yaml
meta:
  title: "Introduction to Git"
  subtitle: "Mastering Version Control"
  tagline: "A practical guide"
  logo: assets/logo-small.png
  theme: mission-control
  editing: false

slides:
  - layout: title
    id: intro
    logo: assets/logo-small.png
    h1: "Introduction to Git"
    subtitle: "Mastering Version Control"
    tagline: "A practical deep dive"

  - layout: bullets
    id: what-is-git
    h2: "What is Git?"
    items:
      - "Distributed version control system"
      - "Tracks changes to code over time"
      - "Enables collaboration"
      - "Open source & widely adopted"

  - layout: two-column
    id: comparison
    h2: "Centralized vs Distributed"
    columns:
      - h3: "Centralized (SVN)"
        items:
          - "Single central server"
          - "Limited offline work"
          - "Server failure = blocker"
      - h3: "Distributed (Git)"
        items:
          - "Full copy on each machine"
          - "Work offline freely"
          - "Resilient & independent"

  - layout: code
    id: git-commands
    h2: "Common Commands"
    code: |
      git init
      git add .
      git commit -m "Initial commit"
      git push origin main

  - layout: feature-grid
    id: git-features
    h2: "Git Benefits"
    cards:
      - icon: "🚀"
        h3: "Fast"
        text: "Lightning-quick operations"
      - icon: "🔒"
        h3: "Secure"
        text: "Cryptographic integrity"
      - icon: "♻️"
        h3: "Flexible"
        text: "Supports many workflows"

  - layout: section-divider
    id: advanced
    h2: "Advanced Techniques"
    tagline: "Branches, merges, and rebasing"

  - layout: steps
    id: pr-workflow
    h2: "Pull Request Workflow"
    steps:
      - h3: "1. Create Branch"
        text: "Branch from main"
      - h3: "2. Make Changes"
        text: "Commit your work"
      - h3: "3. Push & PR"
        text: "Create pull request"
      - h3: "4. Review"
        text: "Team reviews code"
      - h3: "5. Merge"
        text: "Merge to main"

  - layout: quote
    id: wisdom
    quote: "Commit early, commit often"
    attribution: "Git Best Practices"

  - layout: title-closing
    id: closing
    h1: "You're Git Ready!"
    items:
      - "Practice with real projects"
      - "Learn from mistakes"
      - "Share and collaborate"
    tagline: "Questions?"
```

---

## 📍 Navigation

### Keyboard Controls

| Key | Action |
|-----|--------|
| `→` or `Space` | Next slide |
| `←` | Previous slide |
| `L` | Last slide |
| `R` | Reload |
| `F` `F` (double press) | Toggle fullscreen |
| `H` `H` (double press) | Go to `index.html` |
| `E` | Toggle edit mode |
| `Ctrl+S` / `Cmd+S` | Export to HTML (in edit mode) |
| Click dots | Jump to slide |
| Click ☰ | Menu: Home / Refresh / Last / Fullscreen / theme |

### URL Navigation

```
# By slide ID (readable)
index.html#slide=intro
index.html#slide=git-commands

# By numeric index
index.html#slide=0
index.html#slide=3

# With a specific deck
index.html?presentation=workshop.yaml#slide=overview
```

---

## 🔧 Best Practices

1. **Keep slides focused** — One main idea per slide
2. **Use short bullet lists** — 3-5 items maximum
3. **Break long talks into sections** — Use `section-divider`
4. **Add images when helpful** — Use `image-right`/`image-left`
5. **Highlight key commands** — Use `bullets-badge`
6. **Name your slides** — Use `id` for easy linking
7. **Test different themes** — Find what works best
8. **Don't enable edit mode in production** — Set `editing: false`
9. **Don't use backticks** are rendered bad

---

## 🔗 Related Documentation

- **[presentation-framework-structure.md](presentation-framework-structure.md)** — For developers
- **[README.md](README.md)** — User guide and getting started
- **[../INDEX.md](../INDEX.md)** — Index of all project docs
- **[slides/lib/presentation.js](../../slides/lib/presentation.js)** — Engine source (layout renderers)

---

**Last Updated:** 2026-04-09  
**Version:** 1.0
