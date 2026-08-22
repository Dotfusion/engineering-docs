# Glossary

This document defines the terms and acronyms used across this handbook. A standard spells out an acronym on first use within its own page, which does nothing for a reader who arrives in the middle of the handbook from a search result or a link. This page is the shared reference for all of them.

Terms are grouped by the part of the work they belong to. Where a term has its own standard, the definition links to it.

## Documentation and decisions

- **ADR (Architecture Decision Record).** A short document recording one significant technical decision: what we chose, why, what we rejected, and what it commits us to. See [Architecture Decision Records](architecture-decision-records.md).
- **Global documentation.** The standards that apply across every Dotfusion project. This repository.
- **Project documentation.** The reality of one project: its architecture, setup, deployment, integrations, runbooks, decisions, and exceptions to global standards. Lives in that project's repository under `/docs`.
- **Override.** A documented, deliberate deviation from a global standard for one project, recorded in that project's `/docs` with its reason.
- **Runbook.** Written steps for an operational task, such as a deploy, a rollback, or a recovery, that someone can follow under pressure without improvising.
- **AGENTS.md.** The canonical writing standard for this repository, and the file AI coding tools read to learn our conventions. See [AGENTS.md](../agents/AGENTS.md).
- **Skill.** A folder of instructions that Claude Code loads to perform a task our way. Distributed to the team through the `dotfusion-docs` plugin. See [Claude Code plugins setup](../agents/PLUGIN-SETUP.md).

## Development and delivery

- **CI (continuous integration).** Automation that builds and verifies every change before it merges. See [CI/CD](../delivery/ci-cd.md).
- **CD (continuous delivery).** Automation that takes verified code to an environment without a manual build step.
- **Branch protection.** Repository rules that stop a pull request merging until its required checks pass.
- **Preview environment.** A temporary deployment created for one pull request, used to review a change in isolation before merge.
- **Staging.** A stable, production-like environment for integration testing, client review, and acceptance testing.
- **Rollback.** Returning a live system to a previous known-good release.
- **Boilerplate.** A starting repository that a new project is cloned from, carrying our stack and conventions. See [Boilerplates and templates](boilerplates-and-templates.md).

## Testing

- **Unit test.** Verifies one function or module in isolation.
- **Integration test.** Verifies that two or more parts work together.
- **Component test.** Renders one UI component and checks how it behaves under interaction.
- **E2E (end-to-end) test.** Drives a real browser through a real application, the way a user would. See [Playwright end-to-end testing](../quality/testing/e2e-testing.md).
- **Smoke test.** A small subset of end-to-end tests that confirms the application starts and its critical paths work, run immediately after a deploy.
- **Regression test.** A test written in response to a specific bug, so that bug cannot come back.
- **Visual regression test.** Compares a screenshot against a stored baseline to catch unintended layout and style changes.
- **Flaky test.** A test that passes and fails against the same code. Treated as a defect in the test, not noise to be retried away.
- **POM (Page Object Model).** A test structure that puts the selectors and actions for one page behind a class, so tests read as intent rather than selectors.
- **Fixture.** In Playwright, a reusable piece of test setup injected into a test, used in place of shared mutable state.
- **UAT (user acceptance testing).** A check that a feature meets the business requirements agreed with the client or product owner, done before release.

## Accessibility

- **A11y.** A common shorthand for "accessibility", formed from its first letter, its count of eleven middle letters, and its last letter.
- **AODA (Accessibility for Ontarians with Disabilities Act).** Ontario legislation requiring public websites to meet a recognized accessibility standard. See [Accessibility](../accessibility/accessibility.md).
- **WCAG (Web Content Accessibility Guidelines).** The W3C standard that defines, in testable terms, what makes web content accessible. Our target is WCAG 2.1 Level AA.
- **POUR.** The four WCAG principles: content must be perceivable, operable, understandable, and robust.
- **Conformance level.** A WCAG grade of A, AA, or AAA. AA is the common legal and industry target.
- **ARIA (Accessible Rich Internet Applications).** A set of HTML attributes that convey role, state, and name to assistive technology. Used only where a native element cannot do the job.
- **Assistive technology.** Software or hardware someone uses to access content, such as a screen reader, a magnifier, or a switch device.
- **Screen reader.** Software that reads interface content aloud. VoiceOver on macOS and iOS, NVDA on Windows.
- **axe-core.** The accessibility testing engine used by our Playwright suite, by the axe DevTools browser extension, and by Lighthouse's accessibility category.

## Security and data

- **SAST (static application security testing).** Scanning source code for vulnerable patterns without running it. We use Semgrep as a pull request gate. See [Code security scanning](../security/code-security-scanning.md).
- **Secret.** Any value that grants access to a real system: an API key, a database credential, a signing key, a service token.
- **Secrets manager.** The system of record for secrets. Ours is 1Password. See [How to manage .env files](../security/how-to-manage-env.md).
- **Rotation.** Revoking a credential and issuing a replacement, done immediately whenever a secret may have been exposed.
- **Least privilege.** Granting the minimum access needed for a job, and no more.
- **Public environment variable.** A variable prefixed `NEXT_PUBLIC_`, embedded in the browser bundle at build time and readable by every visitor. The prefix is a public contract.
- **PII (personally identifiable information).** Data that identifies a person, directly or in combination with other data. See [Data handling and privacy](../security/data-and-privacy.md).
- **Data subject.** The person whose data is being processed, and the holder of the rights that privacy law grants.
- **PIPEDA (Personal Information Protection and Electronic Documents Act).** Canada's federal private-sector privacy law.
- **Quebec Law 25.** Quebec's private-sector privacy regime, stricter than the federal baseline on consent, transparency, and breach reporting.
- **GDPR (General Data Protection Regulation).** The European Union privacy regime, which applies whenever a client serves or monitors people in the EU, wherever the servers are.

## Running systems

- **Observability.** The property of a system whose behavior can be understood from the signals it emits. See [Observability and monitoring](../observability/monitoring.md).
- **Logs, metrics, and errors.** The three signals we rely on: a timestamped record of events, numeric measurements over time, and captured exceptions with context.
- **Tracing.** Following one request across several services. Added only when a system is distributed enough to need it.
- **Alert fatigue.** The failure mode where noisy alerts train people to ignore them, so a real alert is missed.
- **Incident.** An unplanned event that degrades or interrupts a live system for its users. See [Incident response](../delivery/incident-response.md).
- **Postmortem.** A blameless written review after an incident, covering what happened, why, and what changes prevent a repeat.
- **Core Web Vitals.** Google's user-centered performance metrics: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS). See [Performance](../quality/performance.md).
- **TTFB (Time to First Byte).** How long a request waits before the first byte of the response arrives. A slow TTFB puts a ceiling on LCP that no front-end work can lift.
- **FCP (First Contentful Paint).** How long until the first content renders. Useful for separating a slow server from a slow render.

## Stack and tooling

- **Headless CMS (content management system).** A content management system that stores and serves content through an application programming interface (API), leaving presentation to the front end. We build on AgilityCMS and Storyblok.
- **SSR (server-side rendering).** Rendering a page on the server for each request.
- **SSG (static site generation).** Rendering pages at build time and serving them as static files.
- **ISR (incremental static regeneration).** Serving static pages and regenerating them in the background as content changes.
- **RSC (React Server Component).** A React component that runs only on the server and sends no JavaScript to the browser.
- **Composable architecture.** Building a system from independent, replaceable services rather than one system that does everything.
- **Design token.** A named value for a design decision, such as a color or a spacing step, shared between design and code. See [Design handoff](../process/design-handoff.md).

## Related

- [Engineering principles](engineering-principles.md)
- [Documentation standards](../agents/documentation-standards.md)
- [AGENTS.md](../agents/AGENTS.md)
- [Boilerplates and templates](boilerplates-and-templates.md)
