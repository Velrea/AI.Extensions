# Mermaid flowchart skill

A `mermaid:flowchart` skill that draws clean flowcharts: lines that do not cross each other or run through boxes, and a layout a reader can follow.

Done when the skill draws a flowchart with the core rules below, renders it, looks at it, and fixes what it sees before finishing.

## Decided

- Keep the rules to a few core ones. The earlier skill was over-steered by too many preferences. The core rules:
  - Render the diagram, look at it, and fix what you see.
  - Draw every name and relationship the request gives, and nothing else.
  - When a diagram is too big to read, split it into an overview and detail diagrams.
  - Lay it out top to bottom.
  - A group is a module: lines connect to the group's border, not to the boxes inside it.
  - When several lines go to the same place, merge them into one.
  - When the render shows a line crossing another line or running through a box, move the node that causes it and render again, until it is gone or no move removes it.
- Lines crossing each other and lines running through boxes matter most. They cannot always be removed, but a node on the wrong side is the common cause, and moving it often clears them.

## Suggested

- Ways to move a node in Mermaid's classic layout: declare it earlier or later, since nodes in a row are placed roughly in the order they are first declared, or declare the line causing the crossing last so it routes around the outside.
