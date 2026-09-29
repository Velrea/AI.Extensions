---
name: decide
description: "Records a major decision: a hard call between real alternatives, and why this route won."
when_to_use: "A hard call between real alternatives has just been settled, or the user asks to record a decision."
---

A decision record holds a major decision that still binds: what was chosen, the alternatives investigated, and why this one won. Each is one file in `docs/decisions/`, named for the decision, never numbered.

## The bar

A decision earns a record when all three hold: reversing it would mean substantial rework, it was a hard call between real alternatives, and it is still in force. A decision that clearly meets the bar gets a record without asking. One that clearly falls short gets nothing, and no mention. Ask the user only about a decision close to the line.

## Writing

Capture the investigation and evaluation as the conversation held them, at whatever length that takes. Invent nothing. Link the record from each document it shaped.

## Replacing

A decision that replaces a recorded one rewrites or deletes that record. Never mark a record superseded.
