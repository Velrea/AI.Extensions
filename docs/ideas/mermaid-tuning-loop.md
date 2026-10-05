# A tuning loop for the Mermaid skills

Concerns how the mermaid plugin's skills are improved against a fixed set of requests.

## The cases

A handful of requests per diagram type, at varying complexity, listed for the user to approve before any tuning. Some earlier cases were obscure; the new ones should read like requests people actually make.

## The loop

- It runs largely on its own: it keeps improving a skill until it gets stuck, and only then brings the user in to review what it has done and where it stands.
- The user can see every diagram it generated, so they can track how accurate the judging model is.
- Agents draw each case from the current skill. A script counts lines crossing each other and lines running through boxes; a judge compares each render with the previous skill's render side by side, rather than scoring out of 10, which earlier proved far too lenient.
- Small edits to the skill are tested one at a time, and only those that help without breaking another case are kept. Rules that stop earning their place are removed.
- Before the judge is trusted, it is checked against the user's own verdicts on a set of renders.
- Some cases are kept out of tuning, to check at the end that the skill holds beyond the cases it was tuned on.
