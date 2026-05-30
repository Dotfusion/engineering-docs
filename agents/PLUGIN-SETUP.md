# Dotfusion Claude Code plugins — setup

Our team skills are distributed as a Claude Code plugin from this repo
(`Dotfusion/engineering-docs`), which doubles as a plugin marketplace.
The skill is the source of truth; `agents/documentation-standards.md` is the
human-readable explainer that points back to it.

## Recommended: zero-touch org install with auto-updates

An org owner registers the marketplace in managed settings so it appears under
"Your organization", installs for everyone, and auto-updates on every push —
no per-developer action:

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

The README skill triggers automatically when you ask Claude to document a repo,
or explicitly via `/dotfusion-docs:project-readme`.

## Authoring skills locally

To iterate without publishing, point Claude Code at your local checkout — the
local copy wins for that session:

```text
claude --plugin-dir /path/to/engineering-docs
```

Edit `agents/skills/<name>/SKILL.md`, run `/reload-plugins` to reload, and
commit + push when you're happy.
