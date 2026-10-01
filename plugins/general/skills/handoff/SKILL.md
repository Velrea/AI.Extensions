---
name: handoff
description: "Writes a handoff where it can be found again, once, and resumes from one."
when_to_use: "The user asks for a handoff, or passes a handoff file to resume from."
argument-hint: "[handoff file to resume from]"
---

Write the handoff's content as you would without this skill. This skill adds only where it goes, what it is called, and how it is used up.

## Writing

1. **Location.** Write it in `.claude/handoffs/` under the project root: the git top level, or the working directory when there is no git repository. When you are not in a project at all, ask the user where it goes.
2. **Ignore.** In a git repository, make sure the root `.gitignore` ignores both `.claude/handoffs/` and `.claude/worktrees/`, adding whichever line is missing.
3. **Name.** `<short-kebab-name-of-the-work>-<yyyyMMdd-HHmmss>.md`, in local time. Never overwrite a file: if the name is taken, add `-2`, `-3`, and so on.
4. **Once.** A handoff is a one-time note. Never update or append to one; a later handoff is a new file.
5. **Self-deleting.** The file opens with these lines, verbatim:

   > **Resume instruction:** Read this whole file, then delete it immediately, before doing anything else. Do not read it or write to it again. Everything you need from it is now in your context.

## Resuming

When a handoff file is passed in, read it, delete it at once, and carry on from its contents alone.
