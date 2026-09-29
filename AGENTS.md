# AGENTS.md

## Repository overview

AI.Extensions is a public Claude Code plugin marketplace. The repository root is the marketplace, and each plugin is a directory under `plugins/`.

## Layout

```
AI.Extensions/
  AGENTS.md            <- this file
  CLAUDE.md            <- one line, `@AGENTS.md`
  README.md            <- the human-facing overview
  LICENSE.md           <- MIT
  .claude-plugin/
    marketplace.json   <- the marketplace manifest
  plugins/             <- one directory per plugin
  tests/               <- tests, each mirroring the path of what it covers
```

## Must-know rules

- **This repository is public.** Everything committed here, including commit messages and pull request text, is written for anyone to read. Nothing names a private repository, an internal system, a machine path, or a person's private details.
- **Tests live under `tests/`, never beside what they cover.** Everything under `plugins/` is copied verbatim into every install, so a test left there ships to machines that will never run it. A test goes under `tests/`, mirroring its subject's path below the repository root, and resolves the subject from its own location so any working directory does.

## Plugins

A plugin lives in `plugins/<name>/`, and `plugins/<name>/.claude-plugin/plugin.json` is the source of truth for its metadata. Its entry in `.claude-plugin/marketplace.json` mirrors the name and the description for the browse surface.

A plugin ships skills as `skills/<name>/SKILL.md` and agents as `agents/<name>.md`, namespaced `<plugin>:<name>` once installed. Reference files its skills share go in `shared/`, which a skill reaches through `${CLAUDE_PLUGIN_ROOT}`. The harness expands that variable when it injects a `SKILL.md`, never when a skill opens a file with the Read tool, so a `shared/` file names a path in prose and the skill that sends the model there resolves it.

`version` in a plugin's `plugin.json` is its release marker. Bump it on any change to the plugin, so installs pick up the new version.
