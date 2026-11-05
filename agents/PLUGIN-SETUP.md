# Dotfusion Claude Code plugins setup

Our team skills are distributed as a Claude Code plugin, `dotfusion-docs`, from this repository (`Dotfusion/engineering-docs`), which doubles as a plugin marketplace named `dotfusion`. The skill is the source of truth; `agents/documentation-standards.md` is the human-readable explainer that points back to it.

This page covers how the plugin reaches a developer, how to check that every skill is installed, and how to author skills. A new developer follows [Developer onboarding](../process/developer-onboarding.md), which links here for the checks.

## How the organization installs the plugin

This is how Dotfusion is set up today. The marketplace and the plugin are registered in the Claude organization's server-managed settings. When a developer signs in to Claude Code with their Dotfusion account, Claude Code downloads those settings. They apply when Claude Code starts, so the plugin installs the next time the developer starts Claude Code after signing in, and then stays updated on every push to `main`. The developer types no install command. In `claude plugin list`, the plugin shows `Scope: managed`.

The managed settings contain:

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

`autoUpdate: true` is the important part: third-party marketplaces have auto-update off by default, so without it developers would have to refresh manually.

A developer signed in with a personal Claude account does not receive these settings, and has no team skills until they sign in with their Dotfusion account.

This repository is public, so background auto-updates work with no extra setup. If it ever becomes private, each developer's environment will need a token for the silent startup fetch to authenticate:

```bash
export GITHUB_TOKEN=your_github_token_here
```

## Install the plugin yourself

Use this only when `claude plugin list` does not show `dotfusion-docs@dotfusion` after you sign in with your Dotfusion account and restart Claude Code once. Tell the engineering manager as well, because it means the organization's settings did not reach your account.

Start a Claude Code session with `claude`, then type these two commands. The first installs the plugin from this repository's marketplace, and the second loads it into the current session:

```text
/plugin install dotfusion-docs --marketplace Dotfusion/engineering-docs
/reload-plugins
```

The one-step install needs Claude Code 2.1.275 or later. On an earlier version, add the marketplace first with `/plugin marketplace add Dotfusion/engineering-docs`, then run `/plugin install dotfusion-docs@dotfusion`.

Then turn auto-update on: run `/plugin`, open the Marketplaces tab, select `dotfusion`, and choose "Enable auto-update". The plugin now shows `Scope: user` in `claude plugin list`.

## Check that every skill is installed

First confirm the plugin itself. In Terminal, run:

```bash
claude plugin list
```

`dotfusion-docs@dotfusion` must appear with `Status: ✔ enabled`.

Then list what the plugin loaded:

```bash
claude plugin details dotfusion-docs@dotfusion
```

Its `Skills (12)` line names every skill the plugin installs, and in a Claude Code session each one also appears when you type `/dotfusion-docs:`. All twelve must be there:

- `accessibility`
- `engineering-standards`
- `finish-the-install-agility`
- `finish-the-install-storyblok`
- `onboarding`
- `playwright-best-practices`
- `playwright-cli`
- `pr-review`
- `project-docs`
- `project-readme`
- `react-best-practices`, whose `SKILL.md` names itself `vercel-react-best-practices`
- `writing-guidelines`

When a skill is added to or removed from `agents/skills/`, update this list in the same pull request.

## Keep one copy of each skill

Install team skills only through the plugin. A copy of a skill in another place stops updating but keeps the same name, so it competes with the plugin version and Claude can follow the outdated copy without telling you. Copies end up in two places:

- **Your personal skills folder.** Run `ls ~/.claude/skills`. A folder named after a team skill is a copy. Move it out of the way rather than deleting it, so you can restore it if you need to. The commands below create a backup folder and move one copy into it:

```bash
mkdir -p ~/skills-backup
mv ~/.claude/skills/project-readme ~/skills-backup/
```

- **Skills uploaded to claude.ai.** Claude Code syncs them into `~/.claude/skills/synced/`, where a folder named after a team skill is a copy. Delete the upload in the skills list of your claude.ai settings. Do not delete the synced folder on disk: the next sync restores it.

Restart Claude Code after removing a copy, then repeat the check in [Check that every skill is installed](#check-that-every-skill-is-installed).

## How updates apply

Updates are fetched at startup. When a new version lands you'll see a prompt to run `/reload-plugins` to activate it without restarting. Because the plugin declares no fixed `version`, every commit to `main` counts as a new version, so an update always pulls the latest.

## Using a skill

Skills trigger automatically when your request matches their description, or you can invoke one explicitly with `/dotfusion-docs:<skill-name>`. For example, the README skill runs when you ask Claude to document a repo, or via `/dotfusion-docs:project-readme`.

Start from `engineering-standards`: it is the single entry point that routes a task to the standard that governs it and names the non-negotiable rules. If you are new to the handbook itself, [start-here.md](../start-here.md) routes you by what you are trying to do. The `finish-the-install-agility` and `finish-the-install-storyblok` skills complete per-project setup right after cloning a boilerplate. See the [skills table](../README.md#what-the-skills-do) for what each one does.

## Authoring skills locally

To iterate without publishing, point Claude Code at your local checkout. The local copy wins for that session:

```text
claude --plugin-dir /path/to/engineering-docs
```

Edit `agents/skills/<name>/SKILL.md`, run `/reload-plugins` to reload, and commit and push when you're happy.

## Troubleshooting

- **You have no team skills after signing in.** Run `claude plugin list`. If `dotfusion-docs@dotfusion` is missing, confirm you signed in with your Dotfusion account rather than a personal one, then quit Claude Code and start it again so the organization's settings apply. If it is still missing, follow [Install the plugin yourself](#install-the-plugin-yourself).
- **The skills do not appear.** Run `/plugin` and confirm `dotfusion` is listed under Marketplaces and `dotfusion-docs` is enabled. A marketplace added but not installed shows no skills.
- **A skill behaves like an older version, or appears twice.** A copy of it is installed outside the plugin. See [Keep one copy of each skill](#keep-one-copy-of-each-skill).
- **A skill does not trigger.** Invoke it explicitly as `/dotfusion-docs:<skill-name>` to confirm it loaded. If the explicit call works and the automatic trigger does not, the skill's `description` does not match how you phrased the request, which is a bug worth reporting.
- **An update has not arrived.** Updates are fetched at startup, so restart Claude Code, then run `/reload-plugins`. If you installed the plugin yourself, confirm auto-update is on under `/plugin`, Marketplaces, `dotfusion`.
- **You are editing a skill and seeing the old version.** Start Claude Code with `claude --plugin-dir /path/to/engineering-docs` so your local checkout wins, and run `/reload-plugins` after each edit.

## Related

- [Developer onboarding](../process/developer-onboarding.md)
- [AGENTS.md](AGENTS.md)
- [Documentation standards](documentation-standards.md)
- [Documenting your work](../development/documenting-your-work.md)
- [Contributing](../CONTRIBUTING.md)
- [Boilerplates and templates](../engineering/boilerplates-and-templates.md)
