# Mermaid diagrams laid out by ELK

Concerns the mermaid plugin's skills and the eval that tunes them.

Mermaid 12, released 2026-09-10, makes ELK its default layout engine for flowchart, state, class, ER, and requirement diagrams, in place of the classic layout. GitHub rendered Mermaid 11.17.2 on 2026-10-04, and a flowchart set to `layout: elk` there appeared to keep the classic layout. The plugin starts with the version GitHub renders, and ELK waits until hosts like GitHub support it.

When it comes:

- The skill switches on the layout engine, not on the version number. Most rules hold for either engine; the ways to move a node so lines stop crossing differ, so each engine gets one small section of its own.
- The engine is worked out rather than asked for: from where the document goes, such as GitHub, or from the Mermaid a project has installed. The user is asked only when neither tells, and the answer is kept in the plugin's settings so nobody is asked twice.
- The eval runs each case on both engines and scores each engine's section separately.
