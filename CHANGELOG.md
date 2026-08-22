# Changelog

Notable changes to the standards in this handbook and to the skills in the `dotfusion-docs` plugin.

Every commit to `main` counts as a new plugin version, so a change here reaches the team on their next Claude Code startup. Add an entry for anything a developer would want to know changed: a new or changed rule, a new document, a skill that now behaves differently. A typo fix does not need one.

Newest first. Date format is `YYYY-MM-DD`.

## Unreleased

### Added

- `start-here.md`, routing a reader by what they are trying to do rather than by folder.
- `CONTRIBUTING.md`, covering how to propose a change to a standard.
- `engineering/glossary.md`, defining every term and acronym used across the handbook.
- `engineering/boilerplates-and-templates.md`, explaining how a new project starts and which repository it is cloned from.
- `quality/performance.md`, setting Core Web Vitals targets as a standard.
- `security/data-and-privacy.md`, covering personal data handling as an engineering concern.
- `delivery/incident-response.md`, covering severity levels, roles, the order of operations, and the postmortem.
- `process/design-handoff.md`, covering what engineering needs from a design before build starts.
- `development/documenting-your-work.md`, mapping each moment in a developer's work to the file it affects and the skill that writes it. Fills the gap between the documentation model and the developer's actual workflow.
- `scripts/lint-docs.mjs` and a `Docs check` workflow, enforcing the mechanical rules in `agents/AGENTS.md` and verifying every internal link on each pull request.
- Pull request and issue templates, and a `CODEOWNERS` file.
- `.gitbook.yaml` and `SUMMARY.md`, so the GitBook navigation is deliberate rather than inferred.

### Fixed

- `project-docs` skill contradicted the ADR standard: it named decision records `YYYY-MM-DD-title.md` where the standard specifies a zero-padded sequence number, listed three of the four statuses, omitted `Alternatives considered`, and did not state that an accepted ADR is immutable. The skill now matches `engineering/architecture-decision-records.md` and links to it.

### Changed

- `README.md` rewritten for two audiences, leading with the Claude Code marketplace and organizing the handbook by reader task rather than by folder.
- License changed from GPL-3.0 to MIT. Vendored third-party skills keep their own licenses, now listed in `LICENSE`.
- `quality/testing/e2e-testing.md` brought into house style: sentence case headings, no numbered headings, no horizontal rules, language tags on every code block.
- `agents/AGENTS.md` gained rules for spelling, horizontal rules, hard wrapping, and link text, so the linter has a standard to enforce.
- Fixed uses of "easy", "simple", and "quick" across the handbook, which the writing standard already forbade. <!-- lint-ignore -->
- Standardized on American spelling.

## Earlier

This changelog starts with the changes above. For history before it, read `git log`.
