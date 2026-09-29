---
name: document
description: "Writes and updates a repository's README, AGENTS.md, and high-level documents in docs/."
when_to_use: "The user asks for something to be documented, a change adds or reshapes a major system or significant component, or a change makes an existing document untrue."
---

Documents describe the system as it is now, at a high level. Go into detail only where reading the code would not make it obvious how something works, such as a mechanism that spans several parts or a data format other code relies on.

- `README.md` is for people: what the project is and how to use it.
- `AGENTS.md` holds only what an agent would get wrong without it.
- Every other document lives under `docs/`, beside `decisions/`, `ideas/`, and `work/`. A document about part of the system names the code it covers in its front matter, as `covers:` paths or globs.

## Structure

Organize `docs/` the way the system is organized: one document per major system or component, named for it. Before creating one, look for a document whose subject already includes this and extend it. Split a part into its own document when it is a subsystem someone could work on without reading the rest, or when the document no longer reads as one overview. Group the documents for a module's subsystems in a folder named for the module, with the module's own document inside it. Never make a folder for a single document. Other kinds of document, such as a guide or a runbook, go where the project needs them. Never a document per change, feature, or date, and no catch-all such as notes or misc.

## The bar

A subject earns a document when it is a major system or significant component of the project: something someone new would need explained before working on it. Small changes never do. A subject that clearly meets the bar gets its document without asking. For one close to the line, ask the user, and bring what you would write or change.

Update a document in the same change that makes it untrue.

## What stays out

State only how things are now: no history and no plans. Rationale goes in a decision record, linked from the document.
