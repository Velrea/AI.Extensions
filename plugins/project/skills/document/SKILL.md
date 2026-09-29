---
name: document
description: "Writes and updates a repository's README, AGENTS.md, and high-level subject documents."
when_to_use: "The user asks for something to be documented, a change adds or reshapes a major system or significant component, or a change makes an existing document untrue."
---

Documents describe the system as it is now, at a high level. Go into detail only where reading the code would not make it obvious how something works, such as a mechanism that spans several parts or a data format other code relies on.

- `README.md` is for people: what the project is and how to use it.
- `AGENTS.md` holds only what an agent would get wrong without it.
- Subject documents live in `docs/architecture/` for how something is built and `docs/design/` for what it is and does, one file per subject. Each names the code it covers in its front matter, as `covers:` paths or globs.

## The bar

A subject earns a document when it is a major system or significant component of the project: something someone new would need explained before working on it. Small changes never do. A subject that clearly meets the bar gets its document without asking. For one close to the line, ask the user, and bring what you would write or change.

Update a document in the same change that makes it untrue.

## What stays out

State only how things are now: no history and no plans. Rationale goes in a decision record, linked from the document.
