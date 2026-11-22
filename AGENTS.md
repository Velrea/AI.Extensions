# AGENTS.md

- This repository is public. Nothing committed, including commit messages and pull request text, names a private repository, an internal system, a machine path, or a person's private details.
- Tests live under `tests/`, never under `plugins/`.
- A plugin's entry in `.claude-plugin/marketplace.json` carries only the name and the source.
- Bump `version` in a plugin's `plugin.json` on any change to the plugin, following semantic versioning.
- A plugin never names another plugin or its skills. It may name its own skills.
- A README is a pitch for whoever lands on the page: what it does for them and how to install it. How it works and how to test it go in `docs/`.
- A skill's `when_to_use` names concrete tasks, such as a feature, a fix, or a refactor. A trigger that describes an activity in the abstract does not fire reliably.
