# Workshop outline — Pragmatic Agentic Development: Docs, Context and Workflow in Practice

Deck: [`slides/workshop.yaml`](../../slides/workshop.yaml) (skeleton, theme `teal-mustard`).
Abstract: [`abstract.md`](./abstract.md). Sample project: [`splitwise-lite/`](../../splitwise-lite/) (read only).

## Metadata

| Field | Value |
|---|---|
| Event | AI Heroes, Nov 2026 |
| Speaker | Marco De Nittis, Architect @ Synesthesia |
| Duration | TBD |
| Format | Hands-on workshop. Attendees work on their own laptop with a coding agent |
| Audience | Solo developers and small teams who already use a coding agent and want consistent results |
| Level | TODO: intermediate? |
| Max attendees | TBD |
| Prerequisites | Laptop, git, mise, a coding agent (Claude Code recommended), a browser. Basic Python reading helps but is not required |

## Agenda

Timing is a placeholder. Fill in once the duration is known.

| # | Section | Slides (ids) | Time |
|---|---|---|---|
| 1 | Workshop title | `cover` | TODO |
| 2 | Agenda | `agenda` | TODO |
| 3 | Goals | `goals` | TODO |
| 4 | Sample project | `project` | TODO |
| 5 | Notable spec-driven workflows | `spec-driven` | TODO |
| 6 | Stream coding | `stream-coding` | TODO |
| 7 | Documentation | `documentation` | TODO |
| 8 | Two specialized agents: librarian, coordinator | `agents` | TODO |
| 9 | Hub and spoke | `hub-and-spoke` | TODO |
| 10 | Two flows, let's do it: project startup, design, planned / proposal | `flows`, `lets-do-it`, `project-startup`, `design`, `flow-planned` | TODO |
| 11 | Let's build (QR, repo link) | `hands-on` | TODO |
| 12 | Further improvements: better tools | `improvements`, `next-steps`, `better-tools` | TODO |

Note: the deck was reset to a skeleton (2026-11-05) and is built progressively. The module and
exercise notes below describe the previous draft; reuse them as material.

## Modules

### 0. Intro & setup
The single rule (document first, agent oriented), the agenda, prerequisites, clone and `mise install`,
smoke test (`mise tasks`, `mise run test`, `mise run docs-lint`, two tabs as two members).

### 1. Sample project tour
Splitwise Lite: Python 3.13, FastAPI, Jinja2 + HTMX, SQLite. Phase: development. Bootstrap features in
`_docs/features/` (sign-in, groups, members, expenses, payments, balances). Roadmap F1–F9 in
`_docs/product/overview.md`. Repository map from `AGENTS.md`.

### 2. Document first, agent oriented
`AGENTS.md` → `_docs/Home.md` → reading path → 2–3 owning docs. Folders encode kind of knowledge,
frontmatter encodes stability (`summary`, `read_when`, `updated` vs `verified`, `source_anchors`).
One fact / one owner, glossary owns vocabulary, contradictions go to `backlog.md`, STE writing.
Sources: `_docs/Home.md`, `_docs/_meta/authoring.md`, `_docs/_meta/phases.md`, `_docs/_meta/ste-writing.md`.

### 3. Self-organizing docs
`mise run docs-*` (lint, index, touched, changed, drift, review, stamp, verify, log, inbox, graph, new),
the drift loop, `mise run digest` for context budget, the librarian agent.
Sources: `_docs/_meta/tools.md`, `_docs/_meta/librarian.md`, `.claude/agents/librarian.md`, `mise.toml`.

### 4. Skills
`splitwise-fullstack`, `coordinator`, `ste-writing` in `.claude/skills/`. Anatomy: description with
"when / when not", reading table, hard rules, definition of done. Skills point to docs, they do not copy them.

### 5. Fixed-stage workflow
Proposed stages: Orient → Plan → Build → Verify → Close (derived from the `coordinator` and
`splitwise-fullstack` skills; not named as such in splitwise-lite). Guardrails: max 3 subagents,
model tier, file ownership, review agent, one commit for code + doc.

### 6. Wrap-up
The four takeaways from the abstract, how to adapt the approach to your own project.

## Exercises

Each exercise has a goal, steps and an expected result (slides use `bullets-badge-note` or `steps`).

| # | Slide | Goal | Based on | Key commands |
|---|---|---|---|---|
| 1 | `ex1-orient` | See how an agent finds its context | F1 Uneven splits in `_docs/product/overview.md`, reading paths in `_docs/Home.md` §4 | `mise run digest --summary _docs` |
| 2 | `ex2-drift` | Fix a doc/code mismatch end to end | Backlog: *Payment receiver error* (`features/payments.md` vs `app/payments/service.py`). Alt: *Mine empty state text* (`features/balances.md`) | `mise run docs-touched`, `docs-verify`, `docs-lint` |
| 3 | `ex3-librarian` | Turn a raw decision into library knowledge | Backlog: *Payer outside the participants* (`product/overview.md`, glossary). Note dropped in `_docs/inbox/` | `mise run docs-inbox`, librarian agent, `docs-log` |
| 4 | `ex4-feature` | Run a roadmap feature through every stage | F1 Uneven splits, `coordinator` + `splitwise-fullstack` skills | `mise run docs-new feature uneven-splits`, `test`, `lint`, `docs-index`, `docs-lint` |

Optional / stretch (TODO: decide): F2 Settlement plan (touches backlog *Greedy settlement plan*),
write a new skill, resolve a design-vocabulary backlog item.

## Attendee setup checklist

Send before the workshop.

- [ ] Install mise (macOS `brew install mise`, Linux `curl https://mise.run | sh`, Windows `winget install jdx.mise`) and activate it in the shell
- [ ] Install git
- [ ] Install and log in to a coding agent (Claude Code recommended). TODO: list supported alternatives
- [ ] `git clone TODO:<repo-url> splitwise-lite && cd splitwise-lite`
- [ ] `mise trust`, then `mise install`
- [ ] `uv sync`
- [ ] `mise run test` passes
- [ ] `mise run docs-lint` passes
- [ ] `mise run dev` opens http://127.0.0.1:8000 and you can sign in as Alice

## Open TODOs

- [ ] Duration, level, max attendees, timing per module
- [ ] Public repo URL for splitwise-lite (currently one local commit, no remote)
- [ ] Workshop starting point: tag/branch per exercise so late joiners can catch up
- [ ] Confirm workflow stage names (slide `workflow-stages`); splitwise-lite does not name them explicitly
- [ ] Exact prompts to paste for each exercise
- [ ] Sample inbox meeting note for exercise 3
- [ ] Scope cut for F1 that fits the time slot (e.g. exact amounts only)
- [ ] Supported agents other than Claude Code; behaviour of `.claude/` skills and agents in other tools
- [ ] API key / account requirements, offline or no-agent fallback
- [ ] Screenshots in `slides/assets/workshop/` (app, Home.md, docs-lint output)
- [ ] Decide exercise placement: interleaved vs one hands-on block
- [ ] Repo link, contacts and feedback form on `closing`
