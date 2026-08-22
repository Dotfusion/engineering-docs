# Dotfusion Claude Code plugins setup

Our team skills are distributed as a Claude Code plugin from this repo (`Dotfusion/engineering-docs`), which doubles as a plugin marketplace. The skill is the source of truth; `agents/documentation-standards.md` is the human-readable explainer that points back to it.

## Recommended: zero-touch org install with auto-updates

An org owner registers the marketplace in managed settings so it appears under "Your organization", installs for everyone, and auto-updates on every push, with no per-developer action:

```json
{
  "extraKnownMarketplaces": {
    "dotfusion": {
      "source": { "source": "github", "repo": "Dotfusion/engineering-docs" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "dotfusion-docs@dotfusion": true
  }
}
```

`autoUpdate: true` is the important part: third-party marketplaces have auto-update OFF by default, so without it devs would have to refresh manually.

This repo is public, so background auto-updates work with no extra setup. If it ever becomes private, each developer's environment will need a token for the silent startup fetch to authenticate:

```bash
export GITHUB_TOKEN=your_github_token_here
```

## Manual install (individual dev, no admin)

```text
/plugin marketplace add Dotfusion/engineering-docs
/plugin install dotfusion-docs@dotfusion
/reload-plugins
```

To enable auto-update for yourself: run `/plugin`, open the Marketplaces tab, select `dotfusion`, and choose "Enable auto-update".

## How updates apply

Updates are fetched at startup. When a new version lands you'll see a prompt to run `/reload-plugins` to activate it without restarting. Because the plugin declares no fixed `version`, every commit to `main` counts as a new version, so an update always pulls the latest.

## Using a skill

Skills trigger automatically when your request matches their description, or you can invoke one explicitly with `/dotfusion-docs:<skill-name>`. For example, the README skill runs when you ask Claude to document a repo, or via `/dotfusion-docs:project-readme`.

Start from `engineering-standards`: it is the single entry point that routes a task to the standard that governs it and names the non-negotiable rules. If you are new to the handbook itself, [start-here.md](../start-here.md) routes you by what you are trying to do. The `finish-the-install-agility` and `finish-the-install-storyblok` skills complete per-project setup right after cloning a boilerplate. See the [skills table](../README.md#what-the-skills-do) for the full list.

## Authoring skills locally

To iterate without publishing, point Claude Code at your local checkout. The local copy wins for that session:

```text
claude --plugin-dir /path/to/engineering-docs
```

Edit `agents/skills/<name>/SKILL.md`, run `/reload-plugins` to reload, and commit + push when you're happy.

## Troubleshooting

- **The skills do not appear.** Run `/plugin` and confirm `dotfusion` is listed under Marketplaces and `dotfusion-docs` is enabled. A marketplace added but not installed shows no skills.
- **A skill does not trigger.** Invoke it explicitly as `/dotfusion-docs:<skill-name>` to confirm it loaded. If the explicit call works and the automatic trigger does not, the skill's `description` does not match how you phrased the request, which is a bug worth reporting.
- **An update has not arrived.** Updates are fetched at startup, so restart Claude Code, then run `/reload-plugins`. Confirm auto-update is on under `/plugin`, Marketplaces, `dotfusion`.
- **You are editing a skill and seeing the old version.** Start Claude Code with `claude --plugin-dir /path/to/engineering-docs` so your local checkout wins, and run `/reload-plugins` after each edit.

## Related

- [AGENTS.md](AGENTS.md)
- [Documentation standards](documentation-standards.md)
- [Documenting your work](../development/documenting-your-work.md)
- [Contributing](../CONTRIBUTING.md)
- [Boilerplates and templates](../engineering/boilerplates-and-templates.md)
