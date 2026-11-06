# Spec-Driven Development — Methodologies Reference

A survey of the main approaches to structured, spec-driven AI coding. Written as background for the *"To vibe or not to vibe"* talk — specifically for the Spec-Driven section (The Laminated Menu).

---

## Why this space exists

Vibe coding generates code fast but produces unpredictable, hard-to-maintain output. Spec-driven methods attempt to close the gap between "it works on my machine" and "it ships to production" by giving the AI agent structure: what to build, how to build it, and how to verify the result before committing.

The methods differ in where the structure lives (documents, specs, agents, Git), how much upfront work they require, and how they handle the fundamental problem of context degradation in long sessions.

---

## BMAD — Breakthrough Method for Agile AI-Driven Development

**Orientation:** Enterprise teams, complex projects, many roles  
**GitHub:** [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)  
**Docs:** [docs.bmad-method.org](https://docs.bmad-method.org/)

### What it is

BMAD replaces vibe coding with a fully structured development lifecycle driven by specialized agent personas. Its core philosophy is **context engineering**: giving AI agents not just a task, but the full body of knowledge required to execute it — requirements, architecture, APIs, schemas, and decisions from previous phases.

### How it works

- **21+ specialized agents** modeled on domain expert roles (analyst, architect, developer, QA, etc.)
- **50+ guided workflows** covering the full lifecycle from requirements to QA
- **Scale-adaptive intelligence**: automatically adjusts planning depth and process rigor based on project size and complexity
- **Persistent artifacts**: documentation and specs are maintained across the project, not discarded after a session
- **Model-agnostic**: validated with Claude, Gemini, GPT-4, and Grok

### Best for

Large enterprise teams with multiple roles, complex multi-module systems, projects that require rigorous documentation and quality gates.

### Tradeoffs

| Pro | Con |
|-----|-----|
| Thorough — covers every phase of the lifecycle | Heaviest framework in this space; significant onboarding cost |
| Scales to genuine enterprise complexity | 21+ agents means a steep learning curve before it pays off |
| Persistent artifacts create an audit trail | Overkill for small teams or single-developer projects |
| Model-agnostic — not locked to any provider | Process overhead can slow down fast-moving early-stage work |

---

## GSD — Get Shit Done

**Orientation:** Low-overhead spec-driven workflow, Claude Code and 12 other runtimes  
**GitHub:** [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done/)  
**Stars:** 48K+ (as of 2026)

### What it is

GSD is a lightweight meta-prompting and context engineering system built on top of Claude Code. Its central insight: **context rot** — the quality degradation that happens as an agent fills its context window — is the core failure mode of long coding sessions. GSD solves it by externalizing state into files and spawning fresh agent instances for each task.

### How it works

- **Fresh subagent contexts**: each task gets a clean 200K token window — no accumulated noise
- **Aggressive atomicity**: plans are 2–3 tasks, designed to fit in ~50% of a fresh context window
- **Wave-based parallelism**: independent tasks run simultaneously; dependent tasks wait
- **Architecture**: ~50 markdown files, a Node.js CLI helper, 29 slash commands (Skills), 12 custom agents, 2 background hooks
- **Multi-runtime**: supports Claude Code, Cursor, Copilot, Windsurf, Codex, Gemini CLI, and 6 more

### Install

```bash
npx get-shit-done-cc@latest
# then: /gsd-help
```

### Best for

Developers who want spec-driven discipline without heavy process. Particularly strong for Claude Code users. The "deliberate simplicity" alternative to BMAD.

### Tradeoffs

| Pro | Con |
|-----|-----|
| Solves context rot systematically | Requires Node.js — not pure markdown |
| Low overhead; gets out of your way | 50 markdown files is still a cognitive surface |
| 12 runtime support — not locked to Claude Code | Atomicity requirement means you must decompose tasks carefully upfront |
| 48K GitHub stars — large community | Less structured than BMAD; relies more on developer discipline |

---

## GitHub Spec Kit

**Orientation:** Open standard across assistants, team-wide spec hygiene  
**GitHub:** [github/spec-kit](https://github.com/github/spec-kit)

### What it is

An open-source toolkit from GitHub that introduces a formal specification workflow with a **constitution** — a document that establishes non-negotiable project principles before any development begins. Designed to be a portable standard that works across different AI assistants.

### How it works

Strictly linear four-phase workflow:

```
Specify → Plan → Tasks → Implement
```

1. **Specify**: high-level intent → AI generates a detailed specification (user journeys, success criteria)
2. **Plan**: stack and constraints → AI generates a technical plan (architecture, standards, legacy integration)
3. **Tasks**: spec + plan → AI breaks into small, reviewable chunks with dependency management and parallel markers
4. **Implement**: AI implements each task; developer reviews each output

**File structure**: `.github/` for agent prompts, `.specify/` for specs, plans, tasks, and helper scripts.

**Constitution**: a `constitution.md` that codifies principles the AI must never violate — security posture, architectural constraints, code style, etc.

### Best for

Teams that want an open, portable spec standard that isn't tied to a specific IDE or runtime. Good when multiple developers or tools need to work from the same spec.

### Tradeoffs

| Pro | Con |
|-----|-----|
| Open standard — tool-agnostic | More formal and verbose than GSD; can feel heavy for small changes |
| Constitution enforces project-wide non-negotiables | Strictly linear process — no wave parallelism |
| Backed by GitHub — likely to gain ecosystem support | Younger and less battle-tested than BMAD |
| Clean separation of spec / plan / tasks | Task generation quality depends heavily on how well Specify and Plan phases were done |

---

## Kiro

**Orientation:** AWS-native, greenfield, IDE-integrated guided workflow  
**Website:** [kiro.dev](https://kiro.dev/)  
**GitHub:** [kirodotdev/Kiro](https://github.com/kirodotdev/Kiro)

### What it is

An agentic IDE from AWS, forked from VS Code (Code OSS). Kiro brings spec-driven development into the editor itself, guiding developers through a structured three-phase workflow from natural language requirements to a task checklist, all within the IDE. Built on Amazon Bedrock, runs Claude Sonnet 4.0/3.7 internally.

### How it works

Three-phase spec workflow, all living as files in the project:

1. **Requirements** → `requirements.md`: user stories with acceptance criteria written in **EARS syntax** (Easy Approach to Requirements Syntax)
2. **Design** → `design.md`: technical architecture — data flows, TypeScript interfaces, DB schemas, API endpoints
3. **Tasks** → task checklist: implementation steps that build on each other

**Agent Hooks**: user-defined prompts triggered automatically by file changes — enforces consistency and can run quality checks on every save.  
**Agent Steering**: persistent project knowledge in `.kiro/steering/` markdown files — the IDE reads these to stay aligned with project conventions across sessions.

### Best for

AWS-native projects, greenfield development where you want a guided workflow inside the editor. Teams comfortable with a managed IDE (not just a plugin).

### Tradeoffs

| Pro | Con |
|-----|-----|
| Spec-driven workflow built into the IDE — zero friction | Requires switching to Kiro as your IDE (VS Code fork, not a plugin) |
| Agent Hooks enforce consistency automatically | Currently AWS / Bedrock-only; not model-agnostic |
| EARS syntax gives requirements a formal, testable structure | Currently in preview; production readiness TBD |
| Steering files solve persistent context elegantly | Less Git-centric than GSD or OpenSpec |

---

## Tessl

**Orientation:** Spec-as-source — the spec is the primary artifact, code is generated from it  
**Website:** [tessl.io](https://tessl.io/)  
**Docs:** [docs.tessl.io](https://docs.tessl.io/)

### What it is

The most radical position in this space: **the spec is not a planning document — it is the source**. Code is regenerated from the spec when needed; developers maintain and version the spec, not the generated code. Tessl integrates via MCP with any compatible agent.

### How it works

Two products:

1. **Tessl Framework** (MCP plugin): plugs into Claude Code, Cursor, Codex, Gemini CLI — provides tools for creating and maintaining specs, enforcing spec-first workflows, and generating aligned tests. "Vibe-specs" is a fast-entry mode for generating a spec from a rough description.

2. **Tessl Spec Registry**: 10,000+ pre-built specs for open source libraries — tells the agent how to use a library correctly, avoiding API hallucinations and version mixups.

Specs live in the codebase as long-term memory. Tests are generated from the spec and act as hard guardrails — existing functionality cannot be broken without the spec explicitly changing.

### Best for

Teams who want the spec to remain the maintained artifact over time, not just a bootstrap document. Also valuable for managing OSS library usage across a large codebase (the registry).

### Tradeoffs

| Pro | Con |
|-----|-----|
| Spec Registry is a unique differentiator — prevents OSS hallucinations | "Spec as source" is a significant workflow shift — teams must trust code generation fully |
| Tests derived from spec create hard correctness guarantees | Code you can't read/modify directly is uncomfortable for many developers |
| Works via MCP — integrates with existing tools | Still early; regenerating large codebases from spec is not yet production-proven at scale |
| Vibe-specs lowers the barrier to spec-first entry | Spec quality determines code quality — garbage spec, garbage code |

---

## Ralph Loop

**Orientation:** Autonomous iteration, CI/CD repair, long-running agents without context fatigue  
**GitHub:** [snarktank/ralph](https://github.com/snarktank/ralph) / [iannuttall/ralph](https://github.com/iannuttall/ralph)

### What it is

Ralph is an autonomous agent loop that runs AI coding tools (Claude Code or Amp) **repeatedly in fresh instances until all PRD items are complete**. Its core bet: the agent's context window should never be trusted as persistent memory — only Git and files should be.

### How it works

```
1. Read prd.json for highest-priority incomplete story
2. Spawn a fresh AI instance (Claude Code or Amp)
3. Implement the story
4. Run quality checks
5. Commit on success → update prd.json + progress.txt
6. Repeat until all stories pass or max iterations reached
```

**Memory architecture**:
- `prd.json` — the product requirements, updated as stories complete
- `progress.txt` — learnings and insights captured during implementation
- **Git history** — the actual code story; rollbacks are straightforward
- **CLAUDE.md auto-sync**: after each iteration, Ralph updates the project's config files with discovered patterns and conventions — future instances read these, so the system literally teaches itself how to work better with the codebase

**Story sizing constraint**: each story must fit within a single context window (~30–90 minutes of human implementation time). Oversized tasks fail.

### Best for

Long autonomous runs, CI/CD repair loops, scenarios where context fatigue is a known problem, or anywhere you want Git to be the only reliable memory.

### Tradeoffs

| Pro | Con |
|-----|-----|
| Elegantly solves context fatigue by design | Requires careful upfront task decomposition — stories must be small |
| Git as memory is auditable, rollback-friendly | Less useful for interactive/exploratory work |
| Self-improving via CLAUDE.md sync | Failures mid-loop require investigation before resuming |
| Works with Claude Code and Amp | Less structured spec formalism than BMAD or Spec Kit |

---

## OpenSpec

**Orientation:** Brownfield systems, explicit change control, tracked modifications to existing code  
**GitHub:** [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)

### What it is

OpenSpec is built for the opposite case from Kiro or BMAD: you already have a production codebase with real users. Every change is a **delta**, and OpenSpec makes that explicit with a propose → apply → archive workflow and formal delta markers.

### How it works

Three-phase change lifecycle:

```
Propose → Apply → Archive
```

1. **Propose**: write a spec for the change, marking sections as `ADDED`, `MODIFIED`, or `REMOVED` relative to what exists
2. **Apply**: implement the tasks derived from the proposal
3. **Archive**: merge the delta into the source-of-truth spec; the next change builds on the updated baseline

**Delta markers**: `ADDED` / `MODIFIED` / `REMOVED` — every proposal clearly communicates what changes relative to existing functionality. This makes code review easier and creates an auditable history of intent alongside the Git history of code.

### Best for

Brownfield projects, regulated industries where change intent must be documented, teams iterating on stable production systems.

### Tradeoffs

| Pro | Con |
|-----|-----|
| Delta markers make change intent explicit — excellent for code review | Overhead of propose/archive cycle slows down fast-moving work |
| Designed for brownfield — doesn't assume a clean slate | Less suited to greenfield or exploratory prototyping |
| Auditable history of spec changes alongside Git | Smaller community than GSD or BMAD |
| Clean change control without heavy process tooling | Archive step requires discipline — easy to skip and accumulate drift |

---

## Comparison table

| | BMAD | GSD | GitHub Spec Kit | Kiro | Tessl | Ralph Loop | OpenSpec |
|--|------|-----|-----------------|------|-------|------------|----------|
| **Overhead** | High | Low | Medium | Medium | Low–Med | Low | Medium |
| **Best for** | Enterprise/complex | Claude Code teams | Cross-tool standard | AWS / greenfield | Spec-as-source | Autonomous loops | Brownfield |
| **Spec lives in** | Artifacts + agents | Markdown files | `.specify/` folder | `.kiro/` folder | Codebase (MCP) | `prd.json` | Propose/archive docs |
| **Context strategy** | Structured phases | Fresh subagents | Linear phases | Steering files | Spec regeneration | Fresh instances + Git | Delta per change |
| **Model-agnostic** | Yes | Yes | Yes | No (Bedrock) | Yes (MCP) | Yes | Yes |
| **Open source** | Yes | Yes | Yes | Yes | Framework yes | Yes | Yes |
| **Unique differentiator** | 21+ role agents | Context rot fix | Constitution.md | IDE hooks + EARS | Spec Registry | Git-as-memory loop | Delta markers |

---

## For the talk

The Spec-Driven section (The Laminated Menu, 29–36 min) doesn't need to cover all seven. Suggested approach:

- **Lead with GSD** — most accessible, highest adoption, already familiar to Claude Code users
- **Contrast with BMAD** — shows the enterprise end of the spectrum; the "heavy lamination"
- **Mention Kiro** — AWS product, mainstream visibility, good example of IDE-integrated spec
- **Name-drop Tessl** — the most interesting philosophical position (spec as source)
- **Keep Ralph and OpenSpec as asides** — valuable for specific contexts but not mainstream enough to anchor the narrative

The core point the talk needs to land: spec-driven is not one thing. The spectrum runs from "a bit more discipline in your prompts" (GSD) to "the spec IS the software" (Tessl). Choosing the right tool depends on team size, project age, and how much consistency you're willing to pay upfront for.
