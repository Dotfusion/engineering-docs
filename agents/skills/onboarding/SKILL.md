---
name: onboarding
description: Runs a new Dotfusion developer's first week end to end. Verifies their four accounts, verifies and fixes the toolchain on a new Mac, sets up 1Password access, walks the required reading behind a soft gate, gets their assigned client project running locally, and finishes at their first merged pull request. Use when a developer says they are new, "onboard me", "it's my first day", "I just joined", "set up my machine", "what do I do first", or when someone asks how to onboard a new developer. For Dotfusion engineering hires only; point partners and outsourced developers at engineering-standards instead.
---

# Onboarding a new developer

This skill runs a first week rather than describing one. It checks what is actually true on the machine in front of you, tells the developer what to fix, walks the required reading, gets their assigned project running against real secrets, and stops when their first pull request merges.

It is for Dotfusion engineering hires. If the developer is a partner, a client, or an outsourced contributor, say so, point them at [`engineering-standards`](https://github.com/Dotfusion/engineering-docs/tree/main/agents/skills/engineering-standards) and [start-here.md](https://github.com/Dotfusion/engineering-docs/blob/main/start-here.md), and stop. Their access model is different and this skill assumes access they will not have.

Read handbook documents through the resolution order in the `engineering-standards` skill, under "Where to read the handbook". The handbook is on this machine inside the installed plugin. Do not fetch a URL for a file you already have.

## The four rules you follow

- **Verify, do not ask.** Every check below is a command with a stated pass condition. Never ask the developer whether something is installed. A developer on day one does not know what the 1Password command line tool is, and will answer yes. Run the command, or have them run it, and read the output.
- **Two modes, one set of checks.** Where you can run commands, run them and report. Where you cannot, give the developer the exact command, ask for the output, and read it back. The checks do not change between modes.
- **Never receive a secret.** You never ask for, accept, display, or read back a secret value. You confirm that `op` resolves references, and you materialize files with `op inject` or wrap commands with `op run`. This matters more here than anywhere else, because phase 5 uses a live client system. If a developer pastes a secret into the conversation, tell them to rotate it, and point at the incident process in [How to manage .env files](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md).
- **Grade the document, not the person.** When a developer cannot answer a question about a document they read, the section is unclear. Record it as a finding against the handbook. Never imply the developer is behind.

## Before you start: the progress file

Onboarding spans days, so keep state on disk at `~/.dotfusion/onboarding.md`. Create it on first run and read it on every subsequent run, so a developer can resume without repeating a phase. It never contains a secret.

```markdown
# Onboarding progress

Started: YYYY-MM-DD
Project: <repository name>

## Phases
- [ ] 1. Accounts and access
- [ ] 2. Toolchain
- [ ] 3. Secrets access
- [ ] 4. Required reading
- [ ] 5. The project running locally
- [ ] 6. First merged pull request

## Skipped
<Each reading the developer chose to move past, with the date.>

## Findings
<Every place the handbook, a project README, or this skill was wrong, missing, or unclear.>

## Blocked on
<What someone else has to do, and which role owns it.>
```

Write to it at the end of every phase, not at the end of the session. A session that stops halfway must leave the file accurate.

## Phase 1: accounts and access

Four accounts gate the week. Check all four before fixing any of them, because two are granted outside engineering and serial waiting costs days. Report the full picture, then start the requests.

| Account | Check | Pass condition | Who to ask |
| --- | --- | --- | --- |
| GitHub organization | `gh api user/orgs --jq '.[].login'` | `Dotfusion` appears in the list | The engineering manager |
| Repository access | `gh repo view <assigned repo>` | The repository resolves | Their team lead |
| Vault access | `op vault list` | At least one vault is listed | The engineering manager |
| Jira | The developer opens their board | They can see work assigned to them | The workspace administrator |
| Google Workspace | The developer signs in | They can sign in | The workspace administrator |

Ask the developer which repository they were assigned. Never guess a repository name, and never list the ones you find on the machine: repository names are client information and this skill is public.

For every failing check, write the missing account and the owning role to `Blocked on`, tell the developer to request it now, and continue with what does not depend on it. Phases 2 and 4 need no account at all, so a developer waiting on Jira is not blocked.

## Phase 2: toolchain

A new Mac has none of this. Run the checks first and report the whole list, then fix in order, because several of these install the next one.

| Tool | Check | Pass condition |
| --- | --- | --- |
| Homebrew | `brew --version` | A version prints |
| Node | `node --version` | 20 or newer |
| npm | `npm --version` | A version prints |
| Git | `git --version` | A version prints |
| GitHub CLI | `gh --version` | A version prints |
| 1Password app | Cannot be checked from a shell | The developer confirms it is installed, signed in, and unlocked |
| 1Password integration | Cannot be checked from a shell | The developer confirms "Connect with 1Password app" is on under Settings, Developer |
| 1Password CLI | `op --version` | A version prints |
| Editor | `code --version`, or their editor's equivalent | A version prints |

Two of these cannot be checked from a shell. State that plainly and ask the developer to confirm each. Never infer one from a neighboring check passing, and never mark a phase complete on an assumption.

Install what is missing with Homebrew:

```bash
brew install git gh node 1password-cli
```

`Unknown:` the handbook does not name a Node version manager. Projects pin a version in `.nvmrc`, so a developer needs one to match a pin, but which tool the team uses is not written down. Ask the engineering manager, use their answer, and record it as a finding so [Code standards](https://github.com/Dotfusion/engineering-docs/blob/main/development/code-standards.md) gains the sentence.

The Node version here only has to clear the floor. The exact version comes from the project's `.nvmrc` in phase 5.

Do not configure global npm flags, and do not install project dependencies yet.

## Phase 3: secrets access

This phase proves the developer can reach secrets without any value entering the conversation.

Confirm `op --version` succeeds and `op vault list` shows at least one vault: that is the real proof secrets are reachable. `op whoami` is not reliable for this: it can report "account is not signed in" even when `op vault list` and `op account list` both work, so treat it as a secondary signal, not the check itself. If `op vault list` returns nothing or errors, the desktop integration is off: send them back to the 1Password app, Settings, Developer.

Explain the two workflows from [How to manage .env files](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md), and say which one they will use in phase 5:

```bash
op run --env-file=".env.sample" -- npm run dev
```

```bash
op inject -i .env.sample -o .env.local
```

Tell them the rule that matters most: never create a `.env` file by hand, and never send a secret through chat or Slack. If they have already done either, treat the value as compromised and follow the incident process.

## Phase 4: the required reading

Four documents. After each one, ask at least one question that the document answers, and that a developer who skimmed it would get wrong. Ask more than one when a single question would not tell you whether they understood it rather than just pattern-matched a keyword. Vary the questions rather than reading from a script, and aim them at what the developer will hit this week.

Every question offers "I don't know" as a real option next to the others, at no cost to pick. A guess when unsure teaches you nothing; "I don't know" tells you exactly where to point them. Offer it plainly rather than as a last resort for when nothing else fits.

| Document | What the questions must test |
| --- | --- |
| [Engineering principles](https://github.com/Dotfusion/engineering-docs/blob/main/engineering/engineering-principles.md) | Which principle decides a concrete tradeoff they will face, not whether they can list the principles |
| [Team working model](https://github.com/Dotfusion/engineering-docs/blob/main/process/team-working-model.md) | Have them write a real question the way the document says to ask one, with context, what they tried, links, and what they need |
| [Development workflow](https://github.com/Dotfusion/engineering-docs/blob/main/development/development-workflow.md) | What a reviewer will send their pull request back for |
| [How to manage .env files](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md) | What they do when a tool needs a real `.env` file on disk, and what happens the moment a secret reaches git |

This is a soft gate. Before moving on, state what is unread and why it matters for the phase ahead. If the developer chooses to move on anyway, write the skipped document and the date to `Skipped` and continue. Skipped and recorded is a decision. Skipped and silent is how a client's credentials end up in a commit.

Treat the last row as the one worth holding the line on. A developer who cannot answer it is about to do phase 5 against a live client system.

No wrong answer here is a failure, and nothing about giving one, or picking "I don't know", should make a developer feel behind: a gap found now is a gap avoided in phase 5, against a live client system. When an answer is wrong or unknown, do not correct and move on. Name the section that should have taught it, add a finding, and give them the passage. Offer to let them reread it and try again rather than handing over the correct answer outright. A developer who would rather keep moving without retrying can, but the offer to retry stands every time.

## Phase 5: the project running locally

The developer is joining an existing client project, not starting a new one. Do not invoke `finish-the-install-agility` or `finish-the-install-storyblok`: those set up a fresh boilerplate and have no place in onboarding.

Work from the project's own documentation rather than from anything you know:

1. Clone the repository they named in phase 1.
2. Read its `README.md` and `docs/setup.md`. These are the instructions. Follow them rather than improvising a setup.
3. Match the Node version in `.nvmrc`.
4. Materialize or inject secrets with `op`, using the project's `.env.sample` as the contract. If `op inject` reports an unresolved reference, a secret is missing from the 1Password environment: name which one, and stop. Do not source it from anywhere else.
5. Install dependencies. Never pass `--force` or `--legacy-peer-deps`. A peer conflict is a stop-and-report, per [Code standards](https://github.com/Dotfusion/engineering-docs/blob/main/development/code-standards.md).
6. Start the project and confirm it serves.

When that project's documentation does not get them running, say so plainly and name exactly what was missing: an undocumented variable, a step that no longer works, a service nobody mentioned. Then offer the better first task. Running [`project-readme`](https://github.com/Dotfusion/engineering-docs/tree/main/agents/skills/project-readme) and [`project-docs`](https://github.com/Dotfusion/engineering-docs/tree/main/agents/skills/project-docs) on the repository turns the gap into their first contribution, and this is the only week they will hit every one of those gaps.

Add every missing step to `Findings`, whether or not they fix it now.

## Phase 6: the first merged pull request

Onboarding is not done when the project runs. It is done when a change of theirs merges, because the failures that cost the most sit at the end and are invisible from a running dev server: no permission to push a branch, a required check they cannot run locally, no reviewer assigned, branch protection nobody explained.

Walk them through it once, small:

1. A branch named to the standard in [Development workflow](https://github.com/Dotfusion/engineering-docs/blob/main/development/development-workflow.md), for example `docs/add-deployment-runbook`.
2. A change worth merging. A documentation fix from their `Findings` list is a good first change, and it is real work.
3. [`pr-review`](https://github.com/Dotfusion/engineering-docs/tree/main/agents/skills/pr-review) on their own diff before a person sees it.
4. The pipeline green, per [CI/CD](https://github.com/Dotfusion/engineering-docs/blob/main/delivery/ci-cd.md). If a required check cannot run for them, that is a finding and an access problem, not their mistake.
5. Documentation updated in the same pull request when behavior, setup, deployment, or operations changed.
6. A reviewer requested, and the pull request merged.

When it merges, mark phase 6 complete and close out.

## Closing out

Produce a report the developer can hand to their lead. It contains:

- which phases passed, with dates
- anything still in `Blocked on`, with the role that owns it
- every reading in `Skipped`
- the full `Findings` list, which is the agenda for the pass over the handbook and this skill

Then say the part that makes onboarding compound: the findings list is the deliverable. Every entry is a place the handbook or this skill failed a reader, and the developer who has been hitting them all week is the only person who knows where they are. Work through it with their team lead and open a pull request for each fix worth making, per [Contributing](https://github.com/Dotfusion/engineering-docs/blob/main/CONTRIBUTING.md).

## Related

- [Developer onboarding](https://github.com/Dotfusion/engineering-docs/blob/main/process/developer-onboarding.md), the handbook page this skill executes
- [Start here](https://github.com/Dotfusion/engineering-docs/blob/main/start-here.md), which routes any reader by situation
- [Claude Code plugins setup](https://github.com/Dotfusion/engineering-docs/blob/main/agents/PLUGIN-SETUP.md), for the install path used on day zero
- [How to manage .env files](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md), the source for phases 3 and 5
- [Development workflow](https://github.com/Dotfusion/engineering-docs/blob/main/development/development-workflow.md), the standard phase 6 holds the first pull request to
- `engineering-standards`, for handbook resolution and for every standard after onboarding
- `project-readme` and `project-docs`, for when the assigned project is not documented
- `pr-review`, invoked in phase 6
