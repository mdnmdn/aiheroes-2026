# Presentation Framework Structure

Technical documentation for developers and maintainers. Describes the internal architecture, component interactions, and code structure.

**Audience:** Web developers maintaining the codebase  
**Purpose:** Understand how the system works internally for maintenance and enhancements

> Paths below are relative to [`slides/`](../../slides/), the served root (`mise run serve`). Engine: [`slides/lib/presentation.js`](../../slides/lib/presentation.js), renderer: [`slides/index.html`](../../slides/index.html).

---

## 🏗️ System Architecture

### Core Design Principle

**One engine, infinite presentations**

- Single HTML renderer handles all presentations
- YAML files contain all content (separation of concerns)
- Themes are pluggable CSS modules
- JavaScript engine dynamically renders based on layout type

---

## 📦 Core Components

### 1. Renderer (`index.html`)

#### `index.html`
The single renderer page, reused for every deck. Standard structure:

**Structure:**
```html
<head>
  <!-- Base structural CSS -->
  <link rel="stylesheet" href="lib/presentation.css">
  
  <!-- Active theme (swapped by JS) -->
  <link id="themeLink" rel="stylesheet" href="themes/theme-launch-pad.css">
</head>
<body>
  <!-- Particle canvas (theme-dependent animation) -->
  <canvas id="particleCanvas"></canvas>
  
  <!-- Progress bar -->
  <div class="progress-bar" id="progressBar"></div>
  
  <!-- Edit mode controls -->
  <button class="edit-toggle" id="editToggle">✏️</button>
  <div class="edit-banner" id="editBanner">Edit Mode...</div>
  
  <!-- Navigation dots -->
  <nav class="nav-dots" id="navDots"></nav>
  
  <!-- Theme switcher -->
  <div class="theme-switcher" id="themeSwitcher">
    <!-- Theme buttons -->
  </div>
  
  <!-- Slides container (populated by JS) -->
  <div id="slides-container"></div>
  
  <!-- Loading/error screens -->
  <div id="loading-screen"></div>
  <div id="error-screen"></div>
  
  <!-- YAML parser & engine -->
  <script src="lib/js-yaml.min.js"></script>
  <script src="lib/presentation.js"></script>
</body>
```

Before `presentation.js` loads, `index.html` sets:

```html
<script>
  window.EDIT_MODE_ENABLED = false;            // hide edit toggle, disable E
  window.DEFAULT_PRESENTATION_FILE = 'talk.yaml';
</script>
```

**Usage:**
```html
<!-- Default deck (loads talk.yaml) -->
<a href="index.html">View</a>

<!-- Other deck via query param -->
<a href="index.html?presentation=workshop.yaml">View Workshop</a>

<!-- With theme override -->
<a href="index.html?presentation=workshop.yaml&style=grid-zero">View with Theme</a>
```

`_samples/index-embedded.html` is a variant with the YAML embedded in the page.

### 2. Content Layer (YAML)

Content is completely separated from presentation logic.

**File:** `talk.yaml`, `workshop.yaml` (or any `.yaml` file under `slides/`; examples in `_samples/`)

**Structure:**
```yaml
meta:
  title: "Presentation Title"
  theme: mission-control          # Default theme
  themes: [...]                   # Available themes
  editing: true                   # Allow edit mode
  logo: assets/logo-small.png            # Optional logo

slides:
  - layout: title                 # Layout type
    id: intro                     # Optional: for named navigation
    h1: "Main Title"
    subtitle: "Subtitle"
    tagline: "Tagline"
    # ... layout-specific properties
```

**YAML Parsing:**
```javascript
// In lib/presentation.js
const yaml = await fetch(presentationParam || window.DEFAULT_PRESENTATION_FILE).then(r => r.text());
const deck = jsyaml.load(yaml);  // Parses YAML to JS object
```

### 3. Theme System

Seven pluggable CSS themes with color variables.

**Theme Architecture:**
```
themes/
├── theme-launch-pad.css       # Navy + Gold (professional)
├── theme-root-shell.css       # Green + Blue (terminal)
├── theme-grid-zero.css        # Cyan + Magenta (neon)
├── theme-mission-control.css  # Gold + Blue (space)
├── theme-teal-mustard.css     # Dark Teal + Mustard (editorial, serif)
├── theme-navy-apricot.css     # Navy + Apricot (editorial, serif)
└── theme-violet-tokyo.css     # Deep Violet + Hot Pink (particles)
```

**CSS Structure (per theme):**
```css
/* Color variables */
:root {
  --primary-color: #f0b840;      /* Theme primary */
  --secondary-color: #1a2a4a;    /* Theme secondary */
  --particle-c1: 0,255,204;      /* Particle colors */
  --particle-c2: 255,0,170;
}

/* Component theming */
.slide { background: linear-gradient(...); }
.nav-dot.active { background: var(--primary-color); }
.neon-badge { border: 1px solid var(--primary-color); }
```

**Runtime Theme Switching:**
```javascript
// In initThemeSwitcher()
document.getElementById('themeLink').href = 
    `themes/theme-${themeName}.css`;
localStorage.setItem('presentation-theme', themeName);
// On load: localStorage value wins over ?style= and meta.theme
```

### 4. Presentation Engine (JavaScript)

**File:** `lib/presentation.js`

Core engine handles all presentation logic:

#### Initialization (`init()`)
```javascript
async function init() {
  // 1. Load presentation content
  // - Try query param: ?presentation=file.yaml (HTTP only)
  // - Try embedded YAML: <script type="application/x-yaml"> (only if no DEFAULT_PRESENTATION_FILE)
  // - Fallback to: window.DEFAULT_PRESENTATION_FILE ('talk.yaml'), else presentation.yaml

  // 2. Parse YAML with jsyaml library
  const deck = jsyaml.load(yamlContent);

  // 3. Validate and render
  buildSlides(deck);

  // 4. Initialize presentation controller
  new SlidePresentation();

  // 5. Setup theme switcher
  initThemeSwitcher(deck.meta?.theme);
}
```

#### Slide Building (`buildSlides()`)
```javascript
function buildSlides(deck) {
  const html = deck.slides.map((slide, i) => {
    const renderer = RENDERERS[slide.layout];
    if (!renderer) throw new Error(`Unknown layout: ${slide.layout}`);
    
    return `<section class="slide ${slide.layout}">
      <div class="slide-content">
        ${renderer(slide)}
      </div>
    </section>`;
  }).join('');
  
  document.getElementById('slides-container').innerHTML = html;
}
```

#### Layout Renderers (`RENDERERS` object)
Each layout has a renderer function that converts YAML to HTML:

```javascript
const RENDERERS = {
  'title': s => `
    ${s.logo ? `<img src="${s.logo}" class="logo">` : ''}
    <h1>${s.h1}</h1>
    <div class="accent-line"></div>
    ${s.subtitle ? `<div class="subtitle">${s.subtitle}</div>` : ''}
    ${s.tagline ? `<p class="tagline">${s.tagline}</p>` : ''}
  `,
  'bullets': s => `
    <h2>${s.h2}</h2>
    <ul class="bullet-list">
      ${s.items.map(i => `<li>${i}</li>`).join('')}
    </ul>
  `,
  'diagram': s => `...mermaid pre block...`,
  // ... 24 layout names in total (19 canonical + 5 legacy aliases)
};
```

#### Slide Controller (`SlidePresentation` class)

```javascript
class SlidePresentation {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.current = 0;
    
    this.setupObserver();      // Intersection observer for visibility
    this.setupKeys();          // Keyboard navigation
    this.setupTouch();         // Touch/swipe support
    this.setupNavDots();       // Navigation dots
    this.setupEditMode();      // Edit mode controls
    
    this.restorePosition();    // Restore from URL hash
  }

  goTo(i) {
    // Navigate to slide
    this.slides[i].scrollIntoView({ behavior: 'smooth' });
    this.updateUI();
    this.updateHash(i);        // Update URL hash
  }

  setupKeys() {
    // Arrow keys, Space, E key, Ctrl+S
  }

  setupTouch() {
    // Swipe left/right
  }

  toggleEdit() {
    // Toggle contenteditable on text elements
  }
}
```

#### Named Slide Navigation

```javascript
// In SlidePresentation constructor
const hash = window.location.hash;
const slideMatch = hash.match(/#slide=(.+)$/);

if (slideMatch) {
  const param = slideMatch[1];
  // Try numeric index
  const numIndex = parseInt(param, 10);
  if (!isNaN(numIndex) && numIndex < this.totalSlides) {
    this.goTo(numIndex);
  } else if (this.namedSlides[param]) {
    // Try named slide
    this.goTo(this.namedSlides[param]);
  }
}
```

### 5. Deck picker (replaces the directory hub)

The original project had a separate `index.html` directory page with a `PRESENTATIONS` map and a `slides.html` renderer. In this repo there is no directory page: `index.html` is the renderer. `window.PRESENTATIONS` in `index.html` lists the decks, and `initPresentationPicker()` in `presentation.js` adds them to the ☰ menu. `currentPresentationFile()` resolves the deck in this order: `?presentation=`, then `sessionStorage['presentation-current']`, then `DEFAULT_PRESENTATION_FILE`. The loaded deck is saved back to `sessionStorage`. The ☰ menu "Home" action and the `H` `H` shortcut go to `index.html?presentation=<current>#slide=_last`, so they stay on the current deck.

---

## 🔄 Data Flow

```
1. User opens HTML file
         ↓
2. JavaScript loads (presentation.js)
         ↓
3. init() runs:
   - Load YAML (from param, embedded, or default)
   - Parse with jsyaml.load()
         ↓
4. buildSlides() renders HTML:
   - For each slide, call layout renderer
   - Renderer converts YAML to HTML
   - Insert into DOM
         ↓
5. SlidePresentation initializes:
   - Setup keyboard/touch handlers
   - Setup theme switcher
   - Setup edit mode
   - Restore position from URL hash
         ↓
6. User sees presentation
   - Navigate with arrows/space/dots
   - ☰ menu (theme, fullscreen, home)
   - Edit mode (E key)
```

---

## 💾 File Storage

**Default (query param):**
```bash
# HTTP - load from file
GET /index.html?presentation=workshop.yaml
```

**Embedded (no network):**
```html
<script type="application/x-yaml" id="defaultPresentation">
meta:
  title: "..."
slides: [...]
</script>
```

**Fallback:**
```javascript
fetch(window.DEFAULT_PRESENTATION_FILE || 'presentation.yaml')  // 'talk.yaml' in this repo
```

---

## 🎨 Edit Mode Implementation

### UI Components
```html
<button class="edit-toggle" id="editToggle">✏️</button>
<div class="edit-banner" id="editBanner">
  Edit Mode • Click text to edit • Ctrl+S to save
</div>
```

### contenteditable
```javascript
toggleEdit() {
  this.isEdit = !this.isEdit;
  const elements = document.querySelectorAll('h1,h2,h3,p,li');
  
  if (this.isEdit) {
    elements.forEach(el => el.contentEditable = 'true');
  } else {
    elements.forEach(el => el.contentEditable = 'false');
  }
}
```

### Export
```javascript
exportFile() {
  // Get current DOM
  const html = document.documentElement.outerHTML;
  
  // Create blob and download
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'presentation.html';
  a.click();
}
```

### Global Disable
```javascript
// In HTML, before presentation.js loads:
<script>window.EDIT_MODE_ENABLED = false;</script>

// In setupEditMode():
if (window.EDIT_MODE_ENABLED === false) {
  toggle.style.display = 'none';
  return;
}
```

---

## 🚀 Query Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `?presentation=` | Load custom YAML file | `?presentation=demo.yaml` |
| `?style=` | Set default theme | `?style=grid-zero` |
| `#slide=` | Navigate to slide | `#slide=intro` or `#slide=3` |

**Full Example:**
```
index.html?presentation=workshop.yaml&style=root-shell#slide=key-points
```

---

## 🔌 Hooks & Plugins

### IntersectionObserver (Slide Visibility)
```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      this.current = Array.from(this.slides).indexOf(e.target);
    }
  });
});
```

---

## 🎯 Extending the System

### Add New Layout
1. Create renderer function in `RENDERERS` object (`lib/presentation.js` — engine is shared, change deliberately)
2. Define structure in YAML
3. Add CSS in `lib/presentation.css`
4. Document in `presentation-reference.md`

### Add New Theme
1. Create `themes/theme-custom.css`
2. Define color variables
3. Add a `<button class="menu-opt theme-opt" data-theme="custom">` in the ☰ menu of `index.html`
4. Engine auto-detects via `data-theme` attribute
5. Prototype the look first in `layout/templates.html` if useful (see README, "slides/layout/ design variants")

### Customize YAML Schema
1. Modify `RENDERERS` object to accept new properties
2. Update `presentation-reference.md` with new fields
3. Ensure backward compatibility

---

## 📊 Stats

| Component | Lines | Purpose |
|-----------|-------|---------|
| presentation.js | ~690 | Core engine |
| presentation.css | ~280 | Base styles |
| theme-*.css | ~70-90 each | Theme definitions |
| index.html | ~105 | Page structure |
| YAML content | Variable | Presentation data |

---

## 🔗 Related Documentation

- **[presentation-reference.md](presentation-reference.md)** — For presentation creators
- **[README.md](README.md)** — User guide and getting started
- **[../INDEX.md](../INDEX.md)** — Index of all project docs
