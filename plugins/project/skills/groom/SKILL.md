---
name: groom
description: "Keeps documents, decisions, ideas, and work items true to the code, one area at a time or across the whole repository."
when_to_use: "Work changes code or documents in an area, or the user asks to groom the repository."
---

Grooming keeps documents, decision records, ideas, and work items true to the code: it finds what has drifted, what is missing, and what is dead.

Before judging anything, in a partial or a full groom, load `project:document`, `project:decide`, `project:idea`, and `project:work`, and judge against their rules.

## What it finds

- Anything that breaks the rules of those four skills.
- A document that no longer matches the code it describes, or describes code that is gone.
- A major system or component with no document.
- README or AGENTS.md out of date, or an AGENTS.md line an agent would not need.
- A major decision made in a merged pull request with no record.
- A decision record whose premise no longer holds.
- An idea already built or no longer relevant.
- A work item already done.
- A link that no longer resolves, including a link to code.

## Partial groom

While working in an area, groom what belongs to it: the documents named for the area or linking to its code, and the decisions, ideas, and work items that name it. Do it inline, without dispatching an agent.

Suggest a full groom when the changes since the last one add, remove, or reshape a major system or component.

## Full groom

Dispatch agents only when the repository is too big to read in one pass. Then dispatch one agent per area of the system, on the strongest model. Each checks its area for everything above, reports, and changes nothing. Check each finding against the code before acting on it.

The commit that applies a full groom carries a `Groomed:` line in its message. The next full groom starts from the last commit that has one.

## Reporting

Prepare corrections for what is clearly wrong without asking. Tell the user what changed, as numbered one-liners of ten words or fewer, and ask only about a call close to the line. Commit only once the user has reviewed and approved the changes.
