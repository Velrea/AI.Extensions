# AI.Extensions

The Claude Code plugins Velrea uses day to day in development, published for anyone to use.

## Add the marketplace

```bash
claude plugin marketplace add Velrea/AI.Extensions
```

Then install a plugin by name:

```bash
claude plugin install <plugin>@ai-extensions
```

## Plugins

- [general](plugins/general/): small skills that fill gaps in what Claude Code does on its own. Each adds only what Claude Code misses, and is reduced or retired once Claude Code does that reliably without it.
- [mermaid](plugins/mermaid/): Mermaid diagrams that read cleanly where they are published, each rendered the way GitHub shows it so it can be looked at and fixed before it is committed.
- [project](plugins/project/): keeps a repository's documentation and project management in good condition.
- [workshop](plugins/workshop/): draws out what the user wants, builds on their ideas, and helps them choose.

## License

MIT. See [LICENSE.md](LICENSE.md).
