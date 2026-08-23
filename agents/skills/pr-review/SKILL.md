---
name: pr-review
description: Review a change against Dotfusion's engineering standards before it merges. Use when a developer asks to review a pull request, review a diff, review their code or changes, check whether something is ready to merge, asks "does this pass our standards", "anything I missed", "review this before I push", or wants a second pair of eyes on work in progress. Checks correctness, the non-negotiable rules, secrets and environment variables, accessibility, tests, performance, privacy, and whether documentation changed alongside behavior. Reports findings by severity with a file and line for each. Prefer this over reviewing from memory.
---

# Pull request review

Review a change the way a Dotfusion reviewer would: against the standards, with a file and line for every finding, ordered so the developer fixes what blocks a merge first.

You are not a linter. The pipeline already runs lint, type-check, and tests (and Semgrep where a project has it configured: setting it up is a client-agreed cost, so most projects do not have it), so do not repeat what a machine reports. Your job is the part automation cannot do: whether the change is correct, whether it violates a rule that blocks a merge, and whether it left something undocumented.

Never approve. Report findings and let a person decide.

## Step 1: Read the change

Establish the diff before judging it:

```bash
git fetch origin main
git diff origin/main...HEAD --stat
git diff origin/main...HEAD
```

If the developer names a pull request instead, read it with `gh pr view <number> --json title,body,files` and `gh pr diff <number>`.

Read enough surrounding code to judge the change in context. A diff shows what changed and hides what it affects. When a changed function has callers outside the diff, read them.

## Step 2: Check the rules that block a merge

These come from [engineering-standards](https://github.com/Dotfusion/engineering-docs/blob/main/agents/skills/engineering-standards/SKILL.md). Any one of them is a blocking finding:

1. **A committed secret.** Any credential, token, or environment value in the diff. Check `.env*` files, config, test fixtures, and code comments. A test account password is a secret. See [How to manage .env files](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md).
2. **`--force` or `--legacy-peer-deps`.** Check `package.json`, lockfile changes, CI config, and Dockerfiles. Permitted only with the five-point record [code-standards.md](https://github.com/Dotfusion/engineering-docs/blob/main/development/code-standards.md) requires, in the project's `/docs/overrides.md`.
3. **A new `NEXT_PUBLIC_` variable.** The prefix is permanent and public. Confirm the value is public by design, and that the developer did not add the prefix to make a value reach the client. The correct fix for that is a server-side route.
4. **A swallowed error.** An empty catch, a caught error that is neither logged nor rethrown, or a generic catch with no context.
5. **Documentation that did not change with behavior.** If the diff changes behavior, setup, deployment, configuration, integrations, or operations, then `/docs` and `README.md` change in the same pull request. See [Documenting your work](https://github.com/Dotfusion/engineering-docs/blob/main/development/documenting-your-work.md) for which file each trigger affects.
6. **A significant decision with no record.** A new framework, library, hosting choice, structural pattern, or a deliberate deviation from a standard needs an ADR under `/docs/decisions/`. See [Architecture Decision Records](https://github.com/Dotfusion/engineering-docs/blob/main/engineering/architecture-decision-records.md).
7. **Personal data in a log or an error report.** A logged request body, form submission, or user record. Check that error tracking scrubs bodies, headers, and cookies. See [Data handling and privacy](https://github.com/Dotfusion/engineering-docs/blob/main/security/data-and-privacy.md).
8. **A UI change that fails the accessibility checklist.** See step 4.

## Step 3: Review the code itself

This is the part worth the most and the part a tool cannot do. Read for:

- **Correctness.** Trace the change against the case it claims to handle, then against the edge cases: empty, null, zero, one, many, concurrent, and failed. Name a concrete input that produces a wrong result rather than saying the code "may not handle" something.
- **Error handling.** Expected failures (validation, user input) distinguished from unexpected ones (system faults, bugs). Errors carry enough context to debug from a log line alone.
- **Naming that describes intent.** Business meaning over implementation detail, per [Code standards](https://github.com/Dotfusion/engineering-docs/blob/main/development/code-standards.md).
- **Unnecessary complexity.** An abstraction with one caller, a config option nobody sets, a layer that only forwards.
- **Test coverage where it matters.** Not a percentage. Does a test exist for the behavior this change introduces, and would it fail if the change were reverted? A bug fix needs a regression test. See [Testing types](https://github.com/Dotfusion/engineering-docs/blob/main/quality/testing/testing-types.md) for the right level.
- **New dependencies.** Actively maintained, framework-compatible, and worth their bundle cost. A dependency for something small is a finding.

## Step 4: Review by what the change touches

Run only the sections that apply.

### The change touches the interface

Against [Accessibility](https://github.com/Dotfusion/engineering-docs/blob/main/accessibility/accessibility.md) and the [manual testing checklist](https://github.com/Dotfusion/engineering-docs/blob/main/accessibility/manual-testing-checklist.md), checked against the diff:

- Interactive elements are real `button` and `a` elements, not styled `div` elements
- Every interactive element is keyboard reachable and operable, and focus stays visible
- Icon-only controls have an accessible name; images have appropriate alt text
- Headings descend without skipping, and there is one main heading
- Form inputs have associated visible labels, and errors are linked to their field
- ARIA appears only where a native element cannot do the job
- Nothing conveys meaning by color alone
- Motion respects `prefers-reduced-motion`

Ask whether the developer ran the manual checklist. Automated axe results are a floor, not a pass.

### The change touches rendering or adds client code

Against [Performance](https://github.com/Dotfusion/engineering-docs/blob/main/quality/performance.md):

- New client-side JavaScript is deliberate. A server component that ships no JavaScript is cheaper
- Images use the framework's image component with explicit dimensions, so the layout does not shift
- Anything loading late reserves its space
- A new third-party script is deferred until after interaction, which is where a failing INP usually comes from
- The bundle cost of a new dependency is known, not assumed

### The change touches data collection

Against [Data handling and privacy](https://github.com/Dotfusion/engineering-docs/blob/main/security/data-and-privacy.md):

- A new form field or analytics property has a stated reason
- A retention path exists for anything new that is stored
- No production personal data in fixtures, seeds, or preview environments
- A new third party receiving user data is recorded

### The change touches CI, deployment, or infrastructure

Against [CI/CD](https://github.com/Dotfusion/engineering-docs/blob/main/delivery/ci-cd.md):

- Required checks still run and still block
- `RUN_E2E` is set, so end-to-end and Lighthouse jobs actually run
- The deploy trigger for each environment is unchanged or deliberately changed
- Rollback still works. A database migration that is not backward compatible makes rollback unsafe and must be called out
- No secret is inlined in pipeline config

### The change is documentation or prose

Run the `writing-guidelines` skill rather than duplicating it here. Inside the `engineering-docs` repository, also run `node scripts/lint-docs.mjs`.

## Step 5: Report

Order findings by severity, most severe first. Use this shape:

```text
BLOCKING  path/to/file.ts:42
  What is wrong, in one sentence.
  Why it blocks: the rule or the failure it causes.
  Suggested fix.
```

Three severities, and nothing else:

- **Blocking.** Violates a rule from step 2, or is incorrect. Cannot merge.
- **Should fix.** A real problem that does not block. Maintainability, a missing test, a documentation gap.
- **Consider.** A judgment call the developer may reasonably decline.

Then close with:

- What the change does, in one sentence, to confirm you understood it
- Anything you could not verify from the diff, and what you would need
- Anything the developer should test by hand before merging

Rules for the report:

- Every finding names a file and a line. A finding with no location is not actionable
- Do not pad. No findings in a section means you say nothing about that section
- Do not report style the pipeline already catches
- Say "no blocking findings" plainly when that is true. A review that invents concerns to look thorough trains people to ignore reviews
- Never mark the review as an approval. A person approves

## Step 6: Verify before reporting

Before you show the developer anything, re-read each finding and delete any you cannot defend. For each one ask: can I name the input that breaks, or the rule it violates, with a line number? If not, it is a guess. A review of five real findings is worth more than one of twenty, most of which are wrong, because the developer stops reading after the second bad one.

## Related

- [Development workflow](https://github.com/Dotfusion/engineering-docs/blob/main/development/development-workflow.md), the reviewer's remit
- [engineering-standards](https://github.com/Dotfusion/engineering-docs/blob/main/agents/skills/engineering-standards/SKILL.md), the rules that block a merge
- [Documenting your work](https://github.com/Dotfusion/engineering-docs/blob/main/development/documenting-your-work.md)
- [Code standards](https://github.com/Dotfusion/engineering-docs/blob/main/development/code-standards.md)
- [Accessibility](https://github.com/Dotfusion/engineering-docs/blob/main/accessibility/accessibility.md) and the [manual testing checklist](https://github.com/Dotfusion/engineering-docs/blob/main/accessibility/manual-testing-checklist.md)
- `writing-guidelines` for prose, `project-docs` for the documentation the review asks for
