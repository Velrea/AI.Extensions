---
name: document
description: "Writes and updates a repository's README, AGENTS.md, and high-level documents in docs/."
when_to_use: "Adding or changing documentation."
---

Code is the source of truth. Documents describe code that exists, as it is now, at a high level. Design for code not yet written belongs in the work item that builds it. Go into detail only where reading the code would not make it obvious how something works, such as a mechanism that spans several parts or a data format other code relies on.

- `README.md` is for people: what the project is and how to use it.
- `AGENTS.md` holds only what an agent would get wrong without it.
- Every other document lives under `docs/`, beside `decisions/`, `ideas/`, and `work/`. Where a document describes code, it links to that code in its prose.

## Structure

This layout, and the folders for decisions, ideas, and work, are the default. Where `AGENTS.md` records a deviation, follow it. When existing docs follow another clear pattern that `AGENTS.md` does not record, describe the pattern and ask the user once whether to keep it or adopt the default. If kept, add one line per deviation to `AGENTS.md`. If adopted, move the docs to the default one area at a time as work touches them, never in one rewrite.

Organize `docs/` the way the system is organized: one document per major system or component, named for it. Before creating one, look for a document whose subject already includes this and extend it. Split a part into its own document when it is a subsystem someone could work on without reading the rest, or when the document no longer reads as one overview. Group the documents for a module's subsystems in a folder named for the module, with the module's own document inside it. Never make a folder for a single document. Folders are named for parts of the system, never for a kind of document such as `architecture/` or `design/`. A guide or a runbook sits beside the part of the system it concerns. Never a document per change, feature, or date, and no catch-all such as notes or misc.

## The bar

A subject earns a document when it is a major system or significant component of the project: something someone new would need explained before working on it. Small changes never do. A subject that clearly meets the bar gets its document without asking. For one close to the line, ask the user, and bring what you would write or change.

## What stays out

State only how things are now: no history and no plans. Rationale goes in a decision record, linked from the document.
