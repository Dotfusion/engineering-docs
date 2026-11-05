# Start here

This handbook holds every engineering standard we work to. Nobody reads it front to back, and nobody should. Find your situation below.

## I am new to the engineering team

[Developer onboarding](process/developer-onboarding.md) covers the whole first week: the five accounts you need and who grants each, the tools to install on a new machine, the four documents to read, and where onboarding ends. Start there rather than here.

The short version, if you have a laptop and nothing else on it: install the Claude desktop app and the Claude Code command line client, sign in with your Dotfusion account so our plugin installs itself, check that all twelve team skills loaded, and run `/dotfusion-docs:onboarding`. The skill walks the rest, including the reading, and tells you what your machine is missing instead of leaving you to find out.

Keep the [Glossary](engineering/glossary.md) open for the first week. It defines every acronym the handbook uses, including AODA, WCAG, SAST, ADR, POUR, and UAT.

## I am starting a new project

[Boilerplates and templates](engineering/boilerplates-and-templates.md) is the checklist. It covers which repository to clone, which skill finishes the setup, how to create the 1Password environment, how to scaffold the documentation, and what to wire into the pipeline before the first branch exists.

Set up the required checks in [CI/CD](delivery/ci-cd.md) on day one. Adding them to a repository that already has open pull requests is more disruptive than adding them to an empty one.

## I am about to write code

Invoke [`engineering-standards`](agents/skills/engineering-standards/) and let it route you. It names the document that governs the task and the rules that block a merge, which is faster than guessing which of these pages applies.

Without the skill, three documents cover most cases: [Code standards](development/code-standards.md) for how the code should read, [Testing types](quality/testing/testing-types.md) for what to test and at what level, and [Accessibility](accessibility/accessibility.md) for anything that touches the interface.

## I am about to open a pull request

- Invoke [`pr-review`](agents/skills/pr-review/) on your own change first. It checks the rules that block a merge before a reviewer has to.
- [Development workflow](development/development-workflow.md) for what the pull request should contain.
- [Manual testing checklist](accessibility/manual-testing-checklist.md) if the change touches the interface.
- [Architecture Decision Records](engineering/architecture-decision-records.md) if you made a decision someone will later ask about.
- Update the documentation in the same pull request. If the change affects behavior, setup, deployment, or operations, then `/docs` and `README.md` change with it.

## I am shipping to production, or something is broken

- [CI/CD](delivery/ci-cd.md) for deploy triggers and, more usefully, rollback.
- [Observability and monitoring](observability/monitoring.md) for confirming the system is healthy.
- [Incident response](delivery/incident-response.md) when it is not. Read it before you need it. It exists so that nobody has to work out who to call while a site is down.

## I need to document something

- [Documenting your work](development/documenting-your-work.md) for what to write at this point in the work, and which skill writes it. Start here.
- [Documentation standards](agents/documentation-standards.md) for what belongs where.
- [AGENTS.md](agents/AGENTS.md) for how to write it. This is the standard, and it wins over any other style guidance.
- The [`project-readme`](agents/skills/project-readme/) and [`project-docs`](agents/skills/project-docs/) skills draft both from the actual codebase. Always read what they produce before committing it.

## I work in product, project management, or leadership

You do not need the code-level documents. These four explain how engineering operates and what it commits to:

1. [Engineering principles](engineering/engineering-principles.md). What we optimize for, and why we prefer small reversible changes.
2. [Team working model](process/team-working-model.md). How we organize the team, and how we expect asynchronous work to run.
3. [CI/CD](delivery/ci-cd.md). What has to be true before a change reaches production.
4. [Incident response](delivery/incident-response.md). What happens when a live system breaks, and what a client is told.

[Accessibility](accessibility/accessibility.md) is worth reading if you talk to clients about AODA obligations. It explains the standard we build to and what we can and cannot claim on a client's behalf.

## I am a partner, a client, or a developer working alongside Dotfusion

Start with [`engineering-standards`](agents/skills/engineering-standards/), which states the rules we hold a change to. Then read whichever of [Code standards](development/code-standards.md), [Development workflow](development/development-workflow.md), and [Accessibility](accessibility/accessibility.md) is closest to the work we are sharing.

[Security guidelines](security/security-guidelines.md) and [Data handling and privacy](security/data-and-privacy.md) cover the baseline we apply. Anything project-specific lives in that project's private repository rather than here, so ask us for it directly.

The [For partners and clients](README.md#for-partners-and-clients) section covers why this is public and how you may reuse it.

## I want to change a standard

[CONTRIBUTING.md](CONTRIBUTING.md). Changes go through a pull request and a review, the same as project code.

## Related

- [Engineering handbook index](README.md)
- [Glossary](engineering/glossary.md)
- [Contributing](CONTRIBUTING.md)
