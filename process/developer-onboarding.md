# Developer onboarding

This document covers a new developer's first week: the accounts they need and who grants each, the tools they install on day zero, and where the `onboarding` skill takes over. It exists so that onboarding does not depend on whoever happens to be available that morning.

Onboarding is for Dotfusion engineering hires. Partners, clients, and outsourced developers are covered by the [For partners and clients](../README.md#for-partners-and-clients) section of the handbook index and by [`engineering-standards`](../ai/skills/engineering-standards/), which states the rules we hold a change to without granting access to anything.

## Day zero: accounts and access

Five accounts, and nothing else, gate the first week. Ask for all five on your first morning, because two of them are granted by someone outside engineering and waiting on them serially costs days.

| Account | What it unlocks | Who grants it |
| --- | --- | --- |
| Claude, in the Dotfusion organization | Claude Code, and our team skills, which the organization installs for you when you sign in | The engineering manager |
| GitHub organization membership | The handbook, the boilerplates, and the project you are joining | The engineering manager |
| 1Password team and vault access | Every secret you will need, and the `op` workflow that replaces `.env` files | The engineering manager (`To confirm`) |
| Jira | The work assigned to you, and the ticket your first pull request closes | The workspace administrator |
| Google Workspace | Product context and business decisions, which live outside engineering | The workspace administrator |

Repository access is separate from organization membership. Ask your team lead for access to the project you are joining, and expect to be added per repository rather than to everything at once.

## Day zero: tools

Install in this order. Each step needs only what the step before it installed, so a new machine with nothing on it can follow the list. When you finish step 7, every team skill is installed and updates itself.

1. **Install the Claude desktop app.** It requires nothing else installed first.
2. **Install the Claude Code command line client.** Open the macOS Terminal app and run the installer:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Then confirm it installed: `claude --version` prints a version.

3. **Sign in with your Dotfusion account.** Run `claude` in Terminal and sign in with the Claude account in the Dotfusion organization, the first account in the table above. Do not sign in with a personal Claude account. Our skills come from the organization's settings, so a personal account signs in without them.
4. **Restart Claude Code once.** Quit it, then run `claude` again. Signing in downloads the organization's settings, which install our `dotfusion-docs` plugin from the `dotfusion` marketplace, this repository, with auto-update on. Those settings apply when Claude Code starts, so the plugin installs on this second start, not on the first.
5. **Confirm our plugin installed itself.** In Terminal, run:

```bash
claude plugin list
```

The check passes when `dotfusion-docs@dotfusion` appears with `Scope: managed` and `Status: ✔ enabled`. If it does, skip to step 7.

6. **Only if the plugin is still missing, install it yourself.** Tell the engineering manager as well, because it means the organization's settings did not reach your account. Start a Claude Code session with `claude`, then type these two commands. The first installs the plugin from this repository's marketplace, and the second loads it into the session:

```text
/plugin install dotfusion-docs --marketplace Dotfusion/engineering-docs
/reload-plugins
```

Then turn auto-update on: run `/plugin`, open the Marketplaces tab, select `dotfusion`, and choose "Enable auto-update". Third-party marketplaces have auto-update off by default, so without this your skills stay pinned to today and stop matching the handbook.

7. **Check that every skill loaded.** In Terminal, run the command below. It prints the plugin's components, and its `Skills (12)` line must name every skill in [the list of twelve](../ai/PLUGIN-SETUP.md#check-that-every-skill-is-installed). If one is missing, follow [the plugin troubleshooting](../ai/PLUGIN-SETUP.md#troubleshooting).

```bash
claude plugin details dotfusion-docs@dotfusion
```

8. **Run the onboarding skill:**

```text
/dotfusion-docs:onboarding
```

Everything after this point is the skill's job, including the required reading. You do not need to work out what comes next.

Install team skills only through the plugin. Do not copy a skill into `~/.claude/skills`, and do not upload one to claude.ai. A copy stops updating but keeps the same name, so it competes with the plugin version and Claude can follow the outdated one without telling you. [Keep one copy of each skill](../ai/PLUGIN-SETUP.md#keep-one-copy-of-each-skill) explains how to find and remove one.

The rest of the toolchain, meaning Homebrew, Node, `git`, `gh`, and the 1Password CLI, is installed during the skill rather than before it, because the skill checks each one and gives you the command that fixes what is missing. See [Code standards](../development/code-standards.md#toolchain) for the versions we build against.

## What the skill does

Six phases, in order. The skill verifies rather than instructs: every check is a command with a stated pass condition, so a step is either confirmed or reported as missing, never assumed.

1. **Accounts and access.** Confirms the five accounts above resolve, and names the role to ask when one does not.
2. **Toolchain.** Claude Code and our plugin, including that every team skill loaded and no stale copy competes with one. Then Homebrew, Node against the project's `.nvmrc`, npm, `git`, `gh`, the 1Password desktop app and command line tool, and your editor.
3. **Secrets access.** Confirms `op` works and that you can reach a vault you were added to. No secret value is ever discussed, pasted, or read back.
4. **The required reading.** The four documents below, each followed by one question the document answers.
5. **The project running.** Clone the repository you were assigned, pull its secrets through `op`, follow that project's own `README.md` and `/docs/setup.md`, and start it locally.
6. **Your first pull request.** A branch named to the standard, a change, `pr-review` on your own diff, the required checks, and a reviewer.

## The required reading

These four are a soft gate. The skill states what is unread and why it matters before moving on, and if you choose to move on anyway it records the skip rather than dropping it. Reading them later is a decision, not an oversight.

1. [Engineering principles](../engineering/engineering-principles.md). The ideas everything else follows from.
2. [Team working model](../process/team-working-model.md). Roles, and how a team spread across time zones makes progress without waiting on each other.
3. [Development workflow](../development/development-workflow.md). Branching, pull requests, and what a reviewer will ask you about.
4. [How to manage .env files](../security/how-to-manage-env.md). Read this one before phase 5, because it is the difference between pulling secrets correctly and committing a client's credentials.

Keep the [Glossary](../engineering/glossary.md) open for the first week. It defines every acronym the handbook uses.

## Where onboarding ends

Onboarding is done when your first pull request merges. Not when the project runs, and not when the reading is finished.

The reason is that the failures which cost the most sit at the end: no permission to push a branch, a required check you cannot run locally, no reviewer assigned, or branch protection nobody mentioned. A developer whose dev server runs looks onboarded and is not.

## What you are expected to leave behind

Every place you got stuck is a defect in this handbook or in the skill, not in you. The skill records those as findings while you work, in a progress file on your machine.

After your first pull request merges, work through that list with your team lead and open a pull request for each fix worth making. You are the only person who will hit every gap, and by your third week you will have forgotten where they were.

## Related

- [Start here](../start-here.md), which routes any reader by situation
- [Claude Code plugins setup](../ai/PLUGIN-SETUP.md), for the organization-wide install and for authoring skills
- [Code standards](../development/code-standards.md), for the toolchain versions
- [How to manage .env files](../security/how-to-manage-env.md), for the secret workflow used in phases 3 and 5
- [Development workflow](../development/development-workflow.md), for the standard phase 6 holds your first pull request to
- [Team working model](team-working-model.md), for how the team expects questions to be asked
