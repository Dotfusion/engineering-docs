# Changelog

Notable changes to the standards in this handbook and to the skills in the `dotfusion-docs` plugin.

Every commit to `main` counts as a new plugin version, so a change here reaches the team on their next Claude Code startup. Add an entry for anything a developer would want to know changed: a new or changed rule, a new document, a skill that now behaves differently. A typo fix does not need one.

Newest first. Date format is `YYYY-MM-DD`.

## Unreleased

### Changed, Agility install skill

- `agents/skills/finish-the-install-agility/SKILL.md` caught up with the boilerplate's signed-webhook revalidation, global data, and preview proxy. It now handles `AGILITY_WEBHOOK_SECRET` and `AGILITY_FETCH_CACHE_DURATION`, and leaves the webhook secret for after the first deploy because the webhook needs a deployed URL. It checks 1Password access with `op vault list` instead of `op whoami`, installs with `nvm use` and `npm ci` so the lockfile stays in sync with CI, and adds `format:check` to the verification.
- New steps: rename the package, check the Agility content model through the MCP server (page template, module, global items, list reference names, home page), and hand the template's docs over to the project. The template's own overview, context, and implementation plan are deleted and the README is reset before `project-readme` and `project-docs` run. The docs that describe inherited code, `overrides.md`, and the ADRs are kept.
- The hand-off now lists the exact GitHub secrets CI reads, turns on `RUN_E2E` only once a home page is published, and covers the webhook and preview URL setup in Agility. The skill pushes no secrets itself: every value goes from 1Password to GitHub and Vercel by the developer.

### Changed, SAST correction

- The handbook stated Semgrep SAST as a required, blocking CI gate on every pull request. That was not true: most projects do not have it wired in, because adoption is optional, and setting it up, plus its licensing past the free contributor tier, are both a cost the client has to agree to. Corrected in the non-negotiable rules, `delivery/ci-cd.md`, `security/security-guidelines.md`, `security/code-security-scanning.md`, `agents/skills/pr-review/SKILL.md`, `agents/skills/finish-the-install-agility/SKILL.md`, `agents/skills/finish-the-install-storyblok/SKILL.md`, and the glossary to describe it as the target state rather than current practice.

### Changed, onboarding and plugin setup

- The onboarding documents told a new developer to add the marketplace and install `dotfusion-docs` by hand. Dotfusion's Claude organization already installs it through server-managed settings when a developer signs in with their Dotfusion account, so the manual install is now a fallback. `process/developer-onboarding.md` adds the Claude organization account as a fifth account, fixes the command line client step, which pointed at a terminal inside the desktop app that does not exist, and adds sign-in, the restart the organization's settings need before the plugin installs, a check that the plugin installed itself, and a `claude plugin details` check that all twelve skills loaded. The manual fallback uses the one-step `/plugin install dotfusion-docs --marketplace Dotfusion/engineering-docs`.
- `agents/PLUGIN-SETUP.md` documents the organization install as current practice, and adds the list of twelve skills to check against, how to find and remove a stale copy of a team skill in `~/.claude/skills` or uploaded to claude.ai, and troubleshooting for both.
- `agents/skills/onboarding/SKILL.md` now checks the Claude organization account in phase 1, and Claude Code, the plugin, every team skill, stale copies, and auto-update in phase 2. `start-here.md` and `README.md` match.

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

### Added, second pass

- `agents/skills/pr-review/`, a skill that reviews a diff against the handbook: the rules that block a merge, correctness, accessibility, secrets, tests, privacy, performance, and whether documentation changed with behavior. Registered in the README table, the `engineering-standards` router, `start-here.md`, and `development-workflow.md`.
- CI now lints Dotfusion's own skills under `agents/skills/` in a second job. They had never been checked, and were the worst-offending files in the repository.
- `scripts/lint-docs.mjs` gained a `Related`-section rule, real hard-wrap detection, a marketing-phrase rule, and a British-spelling list widened from 8 patterns to 22.
- `agents/PLUGIN-SETUP.md` gained a troubleshooting section.
- `Related` sections added to `agents/AGENTS.md`, `agents/PLUGIN-SETUP.md`, the root `AGENTS.md`, and five skills that lacked one.

### Fixed, onboarding pass

- Five skills had frontmatter that is not valid YAML. Their `description` was an unquoted value containing `": "`, which YAML reads as a nested mapping, so the block failed to parse and the skill did not load. `onboarding`, `project-docs`, `project-readme`, `finish-the-install-agility`, and `finish-the-install-storyblok` were affected, four of them since they were written. Descriptions rephrased with a comma or a period.
- `docs-check.yml` now parses every skill's frontmatter and fails on that pattern, because a skill that does not load is silently absent rather than reported. It also lints our own skills by excluding the vendored ones by name instead of listing ours, so a new Dotfusion skill is checked from its first commit.
- `agents/skills/onboarding/SKILL.md` had two checks that did not verify what they claimed. `gh auth status` never lists organization membership, so it could not confirm the `Dotfusion` org appeared; phase 1 now uses `gh api user/orgs --jq '.[].login'`. `op whoami` can report "account is not signed in" while `op vault list` and `op account list` both succeed, so it was demoted from a pass condition to a secondary signal; `op vault list` is now the check for secrets access in phases 1 and 3.
- `agents/skills/onboarding/SKILL.md` phase 4 now allows more than one question per document, adds "I don't know" as an explicit answer choice, and reframes a wrong or unknown answer as a gap found rather than a failure, offering the developer the passage and a retry instead of the correct answer alone.

### Added, onboarding pass

- `process/developer-onboarding.md`, covering a new developer's first week: the four accounts and the role that grants each, the day zero tool install for a machine with nothing on it, the required reading, and the finish line. Registered in `README.md`, `SUMMARY.md`, and `start-here.md`.
- `agents/skills/onboarding/`, a skill that runs the first week rather than describing it. It verifies accounts and toolchain instead of asking, keeps state in `~/.dotfusion/onboarding.md` so it resumes across days, holds the required reading behind a soft gate that records a skip rather than dropping it, works from the assigned project's own documentation in phase 5, and finishes at the developer's first merged pull request. It never handles a secret value.

### Changed, onboarding pass

- `development/code-standards.md` gained a `Toolchain` section stating that `.nvmrc` is the answer for Node, that Node 20 is the floor, and that npm is the package manager. None of this had been written down, and `quality/testing/e2e-testing.md` now points here instead of carrying the Node rule at the end of a Playwright document.
- `agents/skills/engineering-standards/SKILL.md` gained a `Where to read the handbook` section. The plugin is the whole repository, so every handbook document is already on each developer's machine; the skill now reads from the working directory, then `${CLAUDE_PLUGIN_ROOT}`, and treats the GitHub URL as a fallback. Answers no longer need the network, and the local copy is greppable.
- `start-here.md` now routes a new engineer to `process/developer-onboarding.md` rather than listing the four reads itself.

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
