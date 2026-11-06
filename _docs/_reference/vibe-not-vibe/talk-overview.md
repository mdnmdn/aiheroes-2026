# To vibe or not to vibe

### Agentic AI coding in the real world — from creative flow to enterprise-grade results

-----

## Talk metadata

|                   |                                            |
|-------------------|--------------------------------------------|
|**Format**         |Standard session — 40 minutes               |
|**Track**          |AI / Developer Productivity                 |
|**Audience**       |Mixed — developers, tech leads, CTOs        |
|**Conference type**|Developer / tech leader / agentic AI focused|

-----

## Abstract

Vibe coding has brought app development to everyone — but is it adequate for professional-level work? And what happens when you move beyond the vibe, into more structured, agentic approaches?

We’ll walk through the spectrum of AI-assisted development, from free-form generation to spec-driven workflows, with a clear goal in mind: understanding what it takes to produce enterprise-grade software with agentic tools.

Along the way we’ll cover predictability and consistency across a codebase, the current limits of today’s tools, and the gap between a working prototype and code you’d actually ship.

-----

## The four methods

### 1. Autocomplete+

Inline AI suggestions — the developer stays fully in control. AI accelerates known patterns, boilerplate, and refactoring. The baseline most teams already use.

### 2. Vibe coding

Free-form, near-unassisted generation. Creative and fast. Best for prototyping, MVPs, throwaway scripts. Breaks down at scale and in production contexts.

### 3. Agent as junior dev

A threaded AI agent working on discrete, scoped tasks — features, bug fixes, tests — within a supervised workflow. Effort shifts from writing to reviewing and directing.

### 4. Spec-driven development

Structured, machine-readable specs constrain agent behavior. Designed for large codebases, regulated industries, teams that need auditable and consistent output. High upfront cost, high long-term return.

-----

## KPI framework

Six dimensions for evaluating each method. Rated **Low / Medium / High** — intended as thinking anchors, not precise measurements.

|KPI                   |What it means                                                         |
|----------------------|----------------------------------------------------------------------|
|**Creativity**        |How much creative freedom the method allows                           |
|**Quality of results**|Coherence, correctness, and adherence to codebase conventions         |
|**Predictability**    |Confidence in the outcome *before* you start — not the same as quality|
|**Token costs**       |Resource and financial cost relative to output                        |
|**Scalability**       |How well the method holds up on larger, real-world projects           |
|**Human effort**      |General developer involvement across the full workflow                |


> **Creativity vs Predictability** — natural opposites and almost a spectrum. Vibe lives on one end, spec-driven on the other.
> 
> **Quality vs Predictability** — you can have high quality with low predictability. That’s vibe coding on a good day.

### KPI matrix

|KPI               |Autocomplete+|Vibe coding|Agent as junior dev|Spec-driven|
|------------------|-------------|-----------|-------------------|-----------|
|Creativity        |Low          |High       |Medium             |Low        |
|Quality of results|Medium       |Low        |Medium             |High       |
|Predictability    |Medium       |Low        |Medium             |High       |
|Token costs       |Low          |Medium     |High               |High       |
|Scalability       |Medium       |Low        |Medium             |High       |
|Human effort      |High         |Low        |Medium             |High       |

### Best fit scenario

|Method                 |Best fit                                                                                      |
|-----------------------|----------------------------------------------------------------------------------------------|
|**Autocomplete+**      |Daily development, known patterns, boilerplate, refactoring within an existing codebase       |
|**Vibe coding**        |Prototyping, MVPs, throwaway scripts, creative exploration with no production intent          |
|**Agent as junior dev**|Discrete, well-scoped tasks — features, bug fixes, test writing — inside a supervised workflow|
|**Spec-driven**        |Enterprise software, regulated industries, large teams needing consistent and auditable output|

-----

## Core questions the talk will face

- Can agentic AI produce **enterprise-grade software** — not just “works on my machine” quality, but maintainable, reviewable, shippable code?
- Can we achieve **consistent and predictable results** across a codebase, not just impressive one-off demos?
- **Where do today’s tools still fall short** — and what does that mean for teams adopting these methods?

-----

## Talk outline

|#|Section                                                  |Time     |
|-|---------------------------------------------------------|---------|
|1|The spectrum exists — and most teams are stuck at one end|0–6 min  |
|2|Mode 1 · Autocomplete+                                   |6–13 min |
|3|Mode 2 · Vibe coding                                     |13–21 min|
|4|Mode 3 · Agent as junior dev                             |21–29 min|
|5|Mode 4 · Spec-driven development                         |29–36 min|
|6|Decision framework + Q&A                                 |36–40 min|

-----

## Key distinctions to emphasize

- **Repeatability vs Predictability** — repeatability is “same input, same output”. Predictability is “before you run it, you already know roughly what you’ll get”. Vibe coding can score differently on each.
- **Human effort in Autocomplete+ vs Spec-driven** — both are HIGH but for opposite reasons. One keeps you in the loop by design; the other front-loads cost into spec writing.
- **Vibe coding’s hidden human effort** — low upfront, high cleanup. The debt lands later.