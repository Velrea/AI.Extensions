---
name: work
description: "Creates, lists, and finishes committed work items."
when_to_use: "Starting on the work an item describes, even when the user only asks to build it, or the user asks to create a work item or promote an idea, or asks what is ready."
---

A work item is something committed to. Each is one file in `docs/work/`, or the folder `AGENTS.md` records instead, named for the work.

## Create

A work item is sized to a module: a whole area built in one go, not a feature broken into tasks. Split work into more than one item only where one part must be finished before another can start.

Capture what is wanted and why, at a high level, and what done looks like: enough for the implementer to know what is expected. Invent nothing the conversation did not hold, and write no plan; how to build it is the implementer's to work out. An item promoted from an idea carries over everything the idea held, and the idea is deleted.

Keep specifics from the conversation under two headings. **Decided** holds what the user settled: a choice, a constraint the work must fit, or an approach ruled out, each with its reason in a line or two where the conversation gave one; the implementer follows it. **Suggested** holds what was raised but not settled; the implementer weighs it and may do otherwise. Anything the user did not clearly settle is suggested. Leave out a heading that would be empty.

An item that cannot start until another is finished names that item under **Depends on**.

## List

Show ready items as numbered one-liners, in dependency order. An item is ready when none of the items it depends on remain. An item named by an open pull request is already under way.

## Start

Once work on an item starts, leave the item as written: it is the starting point. Design settled or changed along the way goes into the documents for the code as it is written, following `project:document`. Load `project:groom` as the work begins.

## Finish

Finishing an item is part of the work that completes it, done before that work merges, never as a follow-up: delete its file and remove it from other items' Depends on. Design the item held becomes a document written from the code as built, where it meets the bar in `project:document`, and each decided choice the code kept carries its reason into that document.
