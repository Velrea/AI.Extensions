---
name: groom
description: "Keeps documents, decisions, ideas, and work items true to the code, one area at a time or across the whole repository."
when_to_use: "Work changes code or documents in an area, or the user asks to groom the repository."
---

Grooming keeps documents, decision records, ideas, and work items true to the code: it finds what has drifted, what is missing, and what is dead.

## What it finds

- A document that no longer matches the code it covers, or covers code that is gone.
- A major system or component with no document. Load `project:document` to write it.
- README or AGENTS.md out of date, or an AGENTS.md line an agent would not need.
- A major decision made in a merged pull request with no record. Load `project:decide` to write it.
- A decision record whose premise no longer holds.
- An idea already built or no longer relevant.
- A work item already done.
- A link that no longer resolves.

Judge "major" by the bars in `project:document` and `project:decide`.

## Partial groom

While working in an area, groom what belongs to it: the documents whose `covers:` match the files being changed, and the decisions, ideas, and work items that name that area. Do it inline, without dispatching an agent.

Suggest a full groom when the changes since the last one add, remove, or reshape a major system or component.

## Full groom

Dispatch one agent per area of the system, on the strongest model. Each checks its area for everything above, reports, and changes nothing. Check each finding against the code before acting on it.

The commit that applies a full groom carries a `Groomed:` line in its message. The next full groom starts from the last commit that has one.

## Reporting

Correct what is clearly wrong without asking. Afterwards, tell the user what changed, as numbered one-liners of ten words or fewer. Ask only about a call close to the line.
