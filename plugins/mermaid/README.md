# mermaid

Mermaid diagrams in markdown, rendered to images so each can be looked at and fixed before it is done.

## Rendering

`scripts/render.mjs <file.md | diagram.mmd> [output-folder]` draws every ```` ```mermaid ```` or `~~~mermaid` block, indented ones included, on a page 1200 px wide.

- It writes one PNG per diagram: `graph-1.png`, `graph-2.png`, and so on into the output folder when one is given, taken relative to the working directory, and otherwise into a folder of its own under the system's temporary directory, never beside the file.
- It prints each image's path, says when a diagram shrank to fit the page, and reports the error a reader would see in place of a diagram that does not render.
- It exits 0 when every diagram rendered, 1 when one did not or the file holds none, and 2 when it could not render at all.

It has no dependencies, but needs a Chromium-based browser: Edge, Chrome, or Chromium, found at its standard location or on `PATH`, or named by `MERMAID_RENDER_BROWSER`.

### Which Mermaid

A host renders with its own Mermaid release, and releases lay diagrams out differently, so the script renders with a chosen one:

| Release | Why it is here |
| --- | --- |
| 11.17.2, the default | The release GitHub renders, with the classic layout. |
| 12.1.0 | Mermaid 12 lays out flowchart, state, class, ER, and requirement diagrams with ELK by default. |

Set `MERMAID_RENDER_VERSION` to pick one. On first use the script downloads that release's browser bundle from npm through jsDelivr, checks it against the SHA-256 in `render.mjs`, and keeps it in `.mermaid-render` in the home directory, replacing a cached copy that fails the check. Adding a release means adding its version and hash to `render.mjs`, hashed from the package npm publishes.

## Tests

`node tests/mermaid/scripts/run.mjs` from the repository root runs the render script's tests.
