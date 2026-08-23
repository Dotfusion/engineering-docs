# Developer onboarding

This document covers a new developer's first week: the accounts they need and who grants each, the tools they install on day zero, and where the `onboarding` skill takes over. It exists so that onboarding does not depend on whoever happens to be available that morning.

Onboarding is for Dotfusion engineering hires. Partners, clients, and outsourced developers are covered by the [For partners and clients](../README.md#for-partners-and-clients) section of the handbook index and by [`engineering-standards`](../agents/skills/engineering-standards/), which states the rules we hold a change to without granting access to anything.

## Day zero: accounts and access

Four accounts, and nothing else, gate the first week. Ask for all four on your first morning, because two of them are granted by someone outside engineering and waiting on them serially costs days.

| Account | What it unlocks | Who grants it |
| --- | --- | --- |
| GitHub organization membership | The handbook, the boilerplates, and the project you are joining | The engineering manager |
| 1Password team and vault access | Every secret you will need, and the `op` workflow that replaces `.env` files | The engineering manager (`To confirm`) |
| Jira | The work assigned to you, and the ticket your first pull request closes | The workspace administrator |
| Google Workspace | Product context and business decisions, which live outside engineering | The workspace administrator |

Repository access is separate from organization membership. Ask your team lead for access to the project you are joining, and expect to be added per repository rather than to everything at once.

## Day zero: tools

Install in this order. Each step needs only what the step before it installed, so a new machine with nothing on it can follow the list.

1. **Install the Claude desktop app.** It requires nothing else installed first, and it includes Claude Code, so there is no separate step before you can work in a repository.
2. **Install the command line client**, from a terminal inside the desktop app:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

3. **Add the marketplace and install our plugin:**

```text
/plugin marketplace add Dotfusion/engineering-docs
/plugin install dotfusion-docs@dotfusion
```

4. **Turn auto-update on**, unless your install came from organization settings, in which case it is already on. Run `/plugin`, open the Marketplaces tab, select `dotfusion`, and choose "Enable auto-update". Third-party marketplaces have auto-update off by default, so without this step your skills stay pinned to today and stop matching the handbook.
5. **Run the onboarding skill:**

```text
/dotfusion-docs:onboarding
```

Everything after this point is the skill's job, including the required reading. You do not need to work out what comes next.

The rest of the toolchain, meaning Homebrew, Node, `git`, `gh`, and the 1Password CLI, is installed during the skill rather than before it, because the skill checks each one and gives you the command that fixes what is missing. See [Code standards](../development/code-standards.md#toolchain) for the versions we build against.

## What the skill does

Six phases, in order. The skill verifies rather than instructs: every check is a command with a stated pass condition, so a step is either confirmed or reported as missing, never assumed.

1. **Accounts and access.** Confirms the four accounts above resolve, and names the role to ask when one does not.
2. **Toolchain.** Homebrew, Node against the project's `.nvmrc`, npm, `git`, `gh`, the 1Password desktop app and command line tool, and your editor.
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
- [Claude Code plugins setup](../agents/PLUGIN-SETUP.md), for the organization-wide install and for authoring skills
- [Code standards](../development/code-standards.md), for the toolchain versions
- [How to manage .env files](../security/how-to-manage-env.md), for the secret workflow used in phases 3 and 5
- [Development workflow](../development/development-workflow.md), for the standard phase 6 holds your first pull request to
- [Team working model](team-working-model.md), for how the team expects questions to be asked
