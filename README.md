# Dotfusion Engineering docs

This repository contains the global engineering documentation for the team.

It defines how we work across projects: engineering principles, development workflow, code standards, review expectations, testing strategy, delivery and observability practices, security, accessibility, documentation standards, and the AI-agent instructions that help developers write and maintain documentation.

Project-specific documentation belongs inside each project repository under `/docs`. Project docs reference these global standards and document only what is different for that project.

## Table of contents

### Engineering

- [Engineering principles](engineering/engineering-principles.md)
- [Architecture Decision Records](engineering/architecture-decision-records.md)

### Process

- [Team working model](process/team-working-model.md)

### Development

- [Development workflow](development/development-workflow.md)
- [Code standards](development/code-standards.md)

### Quality

- [Testing strategy](quality/testing-strategy.md)
- [Testing types](quality/testing/testing-types.md)
- [Playwright E2E testing](quality/testing/e2e-testing.md)

### Accessibility

- [Accessibility (a11y)](accessibility/accessibility.md)
- [Manual testing checklist](accessibility/manual-testing-checklist.md)

### Delivery

- [CI/CD](delivery/ci-cd.md)

### Observability

- [Monitoring](observability/monitoring.md)

### Security

- [Security guidelines](security/security-guidelines.md)
- [How to manage .env files](security/how-to-manage-env.md)
- [Code security scanning](security/code-security-scanning.md)

### Documentation & AI

- [Documentation standards](agents/documentation-standards.md)
- [AGENTS.md](agents/AGENTS.md)
- [Claude Code plugins setup](agents/PLUGIN-SETUP.md)

## Claude Code plugin and skills

This repository also doubles as a Claude Code plugin marketplace. The skills under
[`agents/skills/`](agents/skills/) are distributed to the team through the plugin.
See [Claude Code plugins setup](agents/PLUGIN-SETUP.md) for installation and updates.

| Skill | What it does |
| --- | --- |
| [`engineering-standards`](agents/skills/engineering-standards/) | Single entry point to these standards. Routes a task to the document that governs it and states the non-negotiable rules that apply to every change. |
| [`finish-the-install-agility`](agents/skills/finish-the-install-agility/) | Completes the per-project setup of a repo cloned from the Next.js + AgilityCMS boilerplate (env vars, brand colors, fonts, metadata), then verifies the install. |
| [`finish-the-install-storyblok`](agents/skills/finish-the-install-storyblok/) | Completes the per-project setup of a repo cloned from the Next.js + Storyblok boilerplate (region, tokens, secrets, brand colors, fonts, metadata), then verifies the install. |
| [`project-readme`](agents/skills/project-readme/) | Generates and refreshes a project's root `README.md`. |
| [`project-docs`](agents/skills/project-docs/) | Scaffolds and audits a project's `/docs` folder, including ADRs. |
| [`writing-guidelines`](agents/skills/writing-guidelines/) | Reviews docs and prose against our writing style. |
| [`playwright-best-practices`](agents/skills/playwright-best-practices/) | Patterns for writing, debugging, and structuring Playwright tests. |
| [`playwright-cli`](agents/skills/playwright-cli/) | Spec-driven test generation and ad-hoc page inspection. |
| [`react-best-practices`](agents/skills/react-best-practices/) | React and Next.js performance rules (skill name `vercel-react-best-practices`). |

## How these docs are organized

Every standard follows the same shape so the collection reads as one handbook:

1. A short statement of purpose.
2. The current standard, described concretely.
3. Where the boundary sits between this global default and project-specific reality.
4. A `Related` section linking the neighbouring docs.

When a standard changes for everyone, change it here. When it changes for one project, record the exception in that project's `/docs`.

## Documentation model

We use two documentation levels:

1. **Global documentation.** Shared engineering standards, principles, workflows, and conventions. This repository.
2. **Project documentation.** Project-specific architecture, setup, integrations, deployment details, runbooks, decisions, and exceptions to global standards. The `/docs` folder in each project repository.

Project docs should reference global docs instead of duplicating them.

GitBook collects these documents and organizes them in a wiki-style view for the team.

## Visibility rule

This repository is intended to be **public**.

### Do not include

- client-specific information
- private architecture details
- credentials, secrets, tokens, or environment values
- internal infrastructure identifiers
- incident details that expose vulnerabilities
- contractual or commercial information

If a document only applies to one client or one project, it belongs in that project's private repository.
