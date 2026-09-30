---
name: work
description: "Creates, lists, and finishes committed work items."
when_to_use: "The user asks to create a work item or promote an idea, asks what is ready, or finishes the work an item describes."
---

A work item is something committed to. Each is one file in `docs/work/`, or the folder `AGENTS.md` records instead, named for the work.

## Create

A work item is sized to a module: a whole area built in one go, not a feature broken into tasks. Split work into more than one item only where one part must be finished before another can start.

Capture what is wanted and why, at a high level, and what done looks like: enough for the implementer to know what is expected. Invent nothing the conversation did not hold, and write no plan; how to build it is the implementer's to work out. An item promoted from an idea names it.

Keep specifics from the conversation under two headings. **Decided** holds what the user settled: a choice, a constraint the work must fit, or an approach ruled out; the implementer follows it. **Suggested** holds what was raised but not settled; the implementer weighs it and may do otherwise. Anything the user did not clearly settle is suggested. Leave out a heading that would be empty.

An item that cannot start until another is finished names that item under **Depends on**.

## List

Show ready items as numbered one-liners, in dependency order. An item is ready when none of the items it depends on remain. An item named by an open pull request is already under way.

## Finish

When the work is done, delete its file, and the idea it was promoted from, and remove it from other items' Depends on. Design the item held becomes a document written from the code as built, where it meets the bar in `project:document`.
