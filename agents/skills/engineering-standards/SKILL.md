---
name: engineering-standards
description: Authoritative pointer to Dotfusion's engineering standards. Use before writing or changing application code, before opening a pull request, when adding or changing environment variables, when editing CI/CD or deployment config, when wiring observability, when recording an architecture decision, when changing UI (accessibility), when adding a dependency, or when a developer asks "what's our standard for X", "check this against our rules", or "is this the Dotfusion way". Lists every engineering standard, where to find it, and the non-negotiable rules that apply to every change.
---

# Engineering standards

This skill is the single entry point to Dotfusion's engineering standards. It does not duplicate the standards. It tells you which document applies to the task in front of you and states the rules you must never violate.

The canonical source is [`Dotfusion/engineering-docs`](https://github.com/Dotfusion/engineering-docs). Read the linked document before acting on a topic, then return here for the next one.

## How to use this skill

1. Identify the task type (new code, refactor, dependency change, env change, CI change, UI change, infrastructure change, decision, doc change).
2. Open the standards row below that matches the task.
3. Apply the rules from the linked document.
4. Confirm the non-negotiable rules are not violated.
5. If a decision is not covered, ask the developer. Do not invent defaults.

## Standards index

| Topic | Apply when | Document |
| --- | --- | --- |
| Engineering principles | At any technical decision point | [engineering-principles.md](https://github.com/Dotfusion/engineering-docs/blob/main/engineering/engineering-principles.md) |
| Code standards | Writing or refactoring code, naming, comments, error handling, dependency hygiene | [code-standards.md](https://github.com/Dotfusion/engineering-docs/blob/main/development/code-standards.md) |
| Development workflow | Creating a branch, opening a pull request, doing code review | [development-workflow.md](https://github.com/Dotfusion/engineering-docs/blob/main/development/development-workflow.md) |
| Architecture Decision Records | Choosing a framework, library, or pattern; deviating from a standard | [architecture-decision-records.md](https://github.com/Dotfusion/engineering-docs/blob/main/engineering/architecture-decision-records.md) |
| Testing strategy | Deciding what to test and at what level | [testing-strategy.md](https://github.com/Dotfusion/engineering-docs/blob/main/quality/testing-strategy.md) |
| Testing types | Picking unit, integration, component, E2E, or other | [testing-types.md](https://github.com/Dotfusion/engineering-docs/blob/main/quality/testing/testing-types.md) |
| E2E testing | Writing or configuring Playwright tests | [e2e-testing.md](https://github.com/Dotfusion/engineering-docs/blob/main/quality/testing/e2e-testing.md) (see also `playwright-best-practices` and `playwright-cli` skills) |
| CI/CD | Editing workflow files, branch protection, deploy triggers, rollback | [ci-cd.md](https://github.com/Dotfusion/engineering-docs/blob/main/delivery/ci-cd.md) |
| Observability | Wiring error tracking, logs, uptime, alerts | [monitoring.md](https://github.com/Dotfusion/engineering-docs/blob/main/observability/monitoring.md) |
| Security baseline | Authentication, authorization, input handling, dependency scanning | [security-guidelines.md](https://github.com/Dotfusion/engineering-docs/blob/main/security/security-guidelines.md) |
| Secrets and env vars | Adding, reading, or changing any `.env*`, deciding `NEXT_PUBLIC_` | [how-to-manage-env.md](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md) |
| SAST | Configuring or interpreting Semgrep findings | [code-security-scanning.md](https://github.com/Dotfusion/engineering-docs/blob/main/security/code-security-scanning.md) |
| Accessibility | Any UI change | [accessibility.md](https://github.com/Dotfusion/engineering-docs/blob/main/accessibility/accessibility.md) |
| Accessibility manual checks | Before sign-off on a UI change | [manual-testing-checklist.md](https://github.com/Dotfusion/engineering-docs/blob/main/accessibility/manual-testing-checklist.md) |
| Team working model | Async collaboration, handoffs, documenting decisions | [team-working-model.md](https://github.com/Dotfusion/engineering-docs/blob/main/process/team-working-model.md) |
| Documentation standards | Writing or updating project documentation | [documentation-standards.md](https://github.com/Dotfusion/engineering-docs/blob/main/agents/documentation-standards.md) |
| Writing style | Writing any prose: docs, ADRs, PR descriptions, comments | [agents/AGENTS.md](https://github.com/Dotfusion/engineering-docs/blob/main/agents/AGENTS.md) (see also `writing-guidelines` skill) |

## Activity-specific skills

These do work, not just routing. Invoke them directly when the task matches:

- `vercel-react-best-practices` for React and Next.js performance rules. Folder is `react-best-practices`; the skill name in its frontmatter is `vercel-react-best-practices`.
- `playwright-best-practices` for Playwright test writing, debugging, and structure (covers accessibility checks with axe-core).
- `playwright-cli` for spec-driven test generation and ad-hoc page inspection.
- `project-readme` to generate or refresh the root `README.md`.
- `project-docs` to scaffold or audit the project's `/docs` folder.
- `writing-guidelines` to review any prose you produce.
- `finish-the-install` for the per-project setup of the Next.js + AgilityCMS boilerplate.

## Non-negotiable rules

These apply to every change. A violation blocks merge.

1. **Never commit a secret.** No keys, tokens, or environment values in git. Manage secrets through 1Password (`op run` or `op inject`). See [how-to-manage-env.md](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md).
2. **Never use `--force` or `--legacy-peer-deps`.** If a peer conflict appears, stop and report it. If a workaround is unavoidable, record the reason in the project's `/docs/overrides.md`.
3. **`NEXT_PUBLIC_` is a public contract.** A variable with that prefix is embedded in the browser bundle forever. Confirm public-by-design before adding it. The correct fix for "this var isn't working on the client" is a server-side route, not a public prefix.
4. **No silent error swallowing.** Every caught error is logged or surfaced with context. Distinguish expected errors from unexpected ones.
5. **Update the docs in the same PR.** Behavior, setup, deployment, or operations change means `/docs` and `README.md` change in the same pull request.
6. **Record significant decisions as ADRs.** Anything affecting architecture, delivery, operations, security, cost, or long-term maintainability goes under `/docs/decisions/NNNN-slug.md`. ADRs are immutable once accepted.
7. **Mark unknowns explicitly.** Use the literal token `Unknown:` followed by what is not confirmed. Do not guess.
8. **Pipeline is the gate.** Every PR runs install/build, lint and type-check, tests, and Semgrep SAST. High and critical SAST findings block merge. Required checks are enforced as branch-protection rules.
9. **UI changes pass the accessibility checklist.** Target is WCAG 2.1 AA. Run `eslint-plugin-jsx-a11y`, axe-core in tests, and the manual checklist from [manual-testing-checklist.md](https://github.com/Dotfusion/engineering-docs/blob/main/accessibility/manual-testing-checklist.md).
10. **Ask before assuming.** When a decision is not covered by a standard or by the developer's prior input, ask.

## Branching and pull requests

Default branch: `main`. Feature branches use a clear prefix and a short slug:

```text
feature/add-contact-form
fix/repair-vercel-build
chore/update-dependencies
docs/add-deployment-runbook
```

Pull requests are small enough to review with confidence. Each PR includes a clear title, a short description of what changed and why, testing notes, screenshots or recordings for UI changes when useful, and documentation updates in the same PR when behavior, architecture, setup, deployment, or operations change.

## Writing style for any prose

Sentence-case headings. Active voice, address the reader as "you", use "we" for team standards. Straight quotes (`"` and `'`), not curly. No em dash. Do not use "easy", "simple", or "quick" to describe an action. Every code block has a language tag. Run the `writing-guidelines` skill on any document you produce.

## Output

When this skill is invoked, produce:

- the topic row that matches the task
- the rules from the linked document that apply
- whether any non-negotiable rule is at risk
- the next concrete action

## Related

- [Dotfusion/engineering-docs](https://github.com/Dotfusion/engineering-docs)
- [Plugin setup](https://github.com/Dotfusion/engineering-docs/blob/main/agents/PLUGIN-SETUP.md)
