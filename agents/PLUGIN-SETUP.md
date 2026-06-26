# Dotfusion Claude Code plugins setup

Our team skills are distributed as a Claude Code plugin from this repo
(`Dotfusion/engineering-docs`), which doubles as a plugin marketplace.
The skill is the source of truth; `agents/documentation-standards.md` is the
human-readable explainer that points back to it.

## Recommended: zero-touch org install with auto-updates

An org owner registers the marketplace in managed settings so it appears under
"Your organization", installs for everyone, and auto-updates on every push,
with no per-developer action:

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

`autoUpdate: true` is the important part: third-party marketplaces have
auto-update OFF by default, so without it devs would have to refresh manually.

This repo is public, so background auto-updates work with no extra setup. If it
ever becomes private, each developer's environment will need a token for the
silent startup fetch to authenticate:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

## Manual install (individual dev, no admin)

```text
/plugin marketplace add Dotfusion/engineering-docs
/plugin install dotfusion-docs@dotfusion
/reload-plugins
```

To enable auto-update for yourself: run `/plugin`, open the Marketplaces tab,
select `dotfusion`, and choose "Enable auto-update".

## How updates apply

Updates are fetched at startup. When a new version lands you'll see a prompt to
run `/reload-plugins` to activate it without restarting. Because the plugin
declares no fixed `version`, every commit to `main` counts as a new version, so
an update always pulls the latest.

## Using a skill

Skills trigger automatically when your request matches their description, or you
can invoke one explicitly with `/dotfusion-docs:<skill-name>`. For example, the
README skill runs when you ask Claude to document a repo, or via
`/dotfusion-docs:project-readme`.

Start from `engineering-standards`: it is the single entry point that routes a
task to the standard that governs it and names the non-negotiable rules. The
`finish-the-install-agility` and `finish-the-install-storyblok` skills complete
per-project setup right after cloning a boilerplate. See the
[README skills table](../README.md#claude-code-plugin-and-skills) for the full
list.

## Authoring skills locally

To iterate without publishing, point Claude Code at your local checkout. The
local copy wins for that session:

```text
claude --plugin-dir /path/to/engineering-docs
```

Edit `agents/skills/<name>/SKILL.md`, run `/reload-plugins` to reload, and
commit + push when you're happy.
