---
name: icon-creation
description: Create, redraw, generate, review, export, or maintain a coherent UI icon set. Use whenever a project needs new icons, an existing icon family needs visual QA, AI image generation should establish an icon style or explore metaphors, SVG icon rules or an icon registry are being established, or SVG icons must be delivered as PNG, JPEG, or WebP files. Includes a portable validator, renderer, and final-asset exporter.
compatibility: Requires Python 3.12+ and uv. The bundled script declares its own Python dependencies.
---

# Icon creation

Use this skill to make a compact UI icon family that stays legible and visually coherent. It is
deliberately framework-agnostic: it works with any application that consumes monochrome SVGs.

## Project contract

Put the set in a directory such as `assets/icons/`:

```text
assets/icons/
├── icons.yaml              # registry: names, goals, categories, search terms
├── variants/               # temporary competing SVG takes (not shipped)
├── preview/                # generated review sheets (normally ignored)
├── export/                 # final PNG/JPEG/WebP outputs (normally ignored)
└── <name>.svg              # approved, shipped icons
```

The bundled script is at `scripts/icon_review.py`. Run it from any project directory with
`--icons-dir` (or use the current directory when it is the icon directory):

```bash
uv run refs/skills/icon-creation/scripts/icon_review.py --icons-dir assets/icons check
uv run refs/skills/icon-creation/scripts/icon_review.py --icons-dir assets/icons sheet --category navigation
uv run refs/skills/icon-creation/scripts/icon_review.py --icons-dir assets/icons variants --category navigation
uv run refs/skills/icon-creation/scripts/icon_review.py --icons-dir assets/icons audit
uv run refs/skills/icon-creation/scripts/icon_review.py --icons-dir assets/icons dupes
uv run refs/skills/icon-creation/scripts/icon_review.py --icons-dir assets/icons export --format png jpg webp --sizes 24 48 96 --background '#ffffff'
```

`uv` installs the script's declared dependencies automatically. The renderer uses resvg, so the
preview is based on the same broadly used SVG rasterisation model rather than a browser accident.

`export` writes one file per icon and size, for example `export/navigation-back-24.png`. PNG and
WebP preserve transparency with `--transparent` (the default); JPEG requires an opaque background.
Use `--color`, `--background`, `--transparent`, `--sizes`, `--format`, and `--export-dir` to
produce the assets required by the target application.

## Registry

Record the intended meaning before drawing. A registry prevents synonyms, exposes unfinished work,
and gives reviewers a label for judging whether the metaphor communicates.

```yaml
# icons.yaml
canon: [navigation-back, navigation-close] # approved reference icons; do not casually redraw

categories:
  navigation:
    navigation-back:
      goal: go to the immediately previous view
      keywords: [back, previous, return]
    navigation-close: close the current view or overlay
    navigation-forward:
      goal: go to the next view
      source: external # documented, but provided by another icon library; no local SVG required
```

Names are kebab-case. The icon's filename and registry key are the same. `source: external` is for
an icon supplied by another library; it stays in the semantic registry but is not expected locally.
Any other `source` value is treated as local unless the project deliberately extends the script.

## Decide before drawing

1. Confirm an icon is useful. A clear label, a colour-coded status, or a familiar text symbol may
   be better than another glyph.
2. Inspect the project's existing icon library and the registry keywords. Reuse an exact existing
   semantic match; do not draw a near-synonym.
3. Write one plain-language goal. If it cannot be described in a line, settle the product concept
   before trying to settle its picture.
4. Draw only the missing concept. Logos and brand marks are a separate asset class: preserve their
   owner’s geometry and licensing instead of forcing them into a UI-icon family.

## Generate a visual direction first

Use the environment's native image-generation capability when a visual direction or metaphor is
uncertain. It is particularly useful for a new family, unfamiliar concepts, or deciding between
outline, solid, rounded, geometric, and hand-drawn directions.

Generate **one style board for the whole batch**, not one unrelated image per icon. State the shared
constraints in the prompt: monochrome UI glyphs, square 24×24 grid, consistent stroke weight and
corner treatment, generous padding, flat vector appearance, no text, no gradients, no shadows, no
3D, and a labelled list of the concepts. Ask for four compact alternatives per ambiguous concept.
For example:

```text
Create a clean monochrome vector-style UI icon sheet on a 24×24 grid. Use 2 px rounded outline
strokes, consistent 2 px optical padding, and no labels, colour, gradients, shadows, or 3D.
Make a coherent family for: back, close, filter, saved search, and team workspace. Show four
alternative metaphors for saved search and team workspace; all other concepts get one glyph.
```

Treat generated imagery as a **reference board**, not a production icon file. Image generators are
good at visual exploration but commonly introduce inconsistent stroke widths, accidental detail,
raster edges, or non-repeatable geometry. Select the clearest direction, then author each approved
icon as SVG under the specification below. Do not trace a generated raster blindly; simplify its
idea until it reads at 16 px and belongs to the established family.

When a family already exists, give the generator an approved contact sheet or canon icons as the
style reference and request only the missing concepts. Reject results that change the family’s
weight, padding, or abstraction level. This keeps generation from resetting the visual language on
every batch.

## SVG specification

Start custom icons from this root:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="..."/>
</svg>
```

| Rule | Requirement |
|---|---|
| Canvas | `viewBox="0 0 24 24"`; no root `width` or `height` |
| Stroke | `currentColor`, width `2`, round caps and joins |
| Fill | root `none`; use `currentColor` only for a deliberately solid shape |
| Live area | keep rendered ink inside 1…23; aim for similar optical size, not identical bounds |
| Complexity | no more than four top-level shapes for custom UI glyphs |
| Disallowed | embedded images, text, styles, classes, masks, clips, filters, gradients, animation, opacity |
| Precision | at most two decimal places in path data |
| Colour | no hard-coded colour; the consumer supplies it with `currentColor` |

These constraints keep the family tintable, cache-friendly, and readable at small sizes. Exempt a
third-party logo or a copied external glyph only deliberately: preserve provenance in the registry,
and do not weaken the custom-icon spec simply to admit an overcomplicated drawing.

## Create–render–review loop

Work one category at a time, ideally six to eight icons. More makes it hard to notice a shared
weight or scale problem; fewer hides the family trend.

1. Run `check` and choose a category of pending local rows.
2. For uncertain concepts, generate a batch-level style board and choose a direction. For settled
   concepts, proceed directly to vector drawing.
3. Draw SVGs to the specification. For an uncertain metaphor, create two to four takes as
   `variants/<name>-1.svg`, `variants/<name>-2.svg`, and so on.
4. Run `check`; fix every mechanical error before visual review.
5. Run `sheet --category <name>`. It renders every icon at 16, 24, and 64 px against light and
   dark grounds, always including the approved canon strip.
6. At 16 px, judge readability first; then weight, optical size, and whether the metaphor uses the
   same visual language as its neighbours. Promote one variant, delete the rest, and rerun.
7. Run `dupes` before accepting the batch. It reports candidates only—inspect them before merging
   concepts that happen to have similar silhouettes.
8. Every roughly 20 accepted icons, and at the end, run `audit` to produce one contact sheet per
   category. This is where a family outlier becomes obvious.
9. Export only accepted SVGs. For transparent UI assets, use PNG or WebP; choose JPEG only when
   the target needs a fixed opaque background:

   ```bash
   # Transparent black icons at 16, 24, and 48 px.
   uv run scripts/icon_review.py --icons-dir assets/icons export \
     --format png webp --sizes 16 24 48 --color '#000000' --transparent

   # Dark icons on a white ground, in PNG, JPEG, and WebP.
   uv run scripts/icon_review.py --icons-dir assets/icons export \
     --format png jpg webp --sizes 24 48 96 --color '#1a1a1a' --background '#ffffff'
   ```

Prefer an independent visual review: give a reviewer the sheet, the registry goals, and this spec,
but not the drawing prompt. Authors tend to recognise their own intent even when the glyph does not
communicate it.

Do not store generated previews or exports unless the repository explicitly treats them as design
records or shipped assets. Add `preview/`, `export/`, and unfinished `variants/` to ignore rules in
ordinary projects.
