# Mermaid tuning loop

A loop that improves a Mermaid skill against a fixed set of requests, starting with the flowchart skill.

Done when the loop can run on its own against the flowchart skill's approved cases, improving the skill until it gets stuck, and the user can review what it did and every diagram it drew.

## Decided

- A handful of cases per diagram type, at varying complexity, approved by the user before any tuning. Some earlier cases were obscure; the new ones should read like requests people actually make.
- The loop runs largely on its own: it keeps improving the skill until it gets stuck, and only then brings the user in to review what it has done and where it stands.
- The user can see every diagram the loop generated, so they can track how accurate the judging model is.

## Suggested

- Agents draw each case from the current skill. A script counts lines crossing each other and lines running through boxes; a judge compares each render with the previous skill's render side by side rather than scoring out of 10, which earlier proved far too lenient.
- Test small edits to the skill one at a time, and keep only those that help without breaking another case. Remove rules that stop earning their place.
- Check the judge against the user's own verdicts on a set of renders before trusting it.
- Keep some cases out of tuning, to check at the end that the skill holds beyond the cases it was tuned on.
