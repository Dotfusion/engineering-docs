# AGENTS.md

These instructions apply to AI agents writing or editing engineering documentation for Dotfusion team.

## Purpose

The goal is to create documentation that helps developers, project managers, product owners, and future team members understand how systems work and how the team operates.

Documentation should reduce dependency on individual memory.

## Writing style

This section is the canonical writing standard for this repository. The `writing-guidelines` skill applies a broader prose checklist on top of it, but where the two disagree, the rules here win. The skill is told to defer to this document.

### Voice

Write clearly and directly. Use plain technical language. Prefer concrete instructions over abstract advice. Do not write marketing copy.

Use active voice and address the reader directly with "you". First-person plural ("we", "our") is the correct voice for a team handbook: use it for shared standards and team decisions ("we use 1Password", "our standard is WCAG 2.1 AA"). This is intentional and is not a writing error.

Keep paragraphs to a few sentences. Each paragraph covers one idea.

### Words to avoid

- Do not use "easy", "simple", or "quick" to describe an action. <!-- lint-ignore --> They pressure the reader and read as marketing. Describe the action concretely instead ("one command", "the default settings").
- Cut filler: "very", "just", "really". <!-- lint-ignore -->
- Replace a vague qualifier with a specific claim when a number exists. Where no figure exists because a standard spans many projects, a hedge like "most projects" or "often" is acceptable. Do not invent a number.

### Spelling

Use American spelling: "standardize", "organization", "color", "behavior", "honor", "analyze", "license" as both noun and verb. This is a convention, not a judgment about which is correct. Picking one keeps the handbook consistent and lets the linter enforce it.

### Lists

- Do not overuse bullet lists. Use them when they make scanning easier.
- Introduce every list with a colon.
- For a term-and-description list, lead with a bold lead-in followed by a period, then the explanation: `- **Lead-in.** Explanation.` This matches the existing strong docs (for example the testing docs) and is the house style.
- Do not put a period at the end of a list item unless it is a full sentence.

### Headings

- Use sentence case for headings: "Configure environment variables", not "Configure Environment Variables".
- Make subheadings descriptive enough to guess the section from the heading alone. Avoid bare generic headings like "Overview" or "Notes".

### Code

- Every code block has a language tag.
- Explain in prose what a code block does. Do not drop a block without context.

### Punctuation

- Never use an em dash. Use a colon, comma, period, or rephrase.
- Use straight quotes (`"` and `'`), not curly quotes. This keeps prose consistent with code blocks and safe to copy and paste. This is the repository convention and overrides any external guideline that prefers curly quotes.
- Spell out an acronym on first use, then use the short form. Terms used across several documents are defined once in the [Glossary](../engineering/glossary.md).

### Structure and source formatting

- Do not use a horizontal rule (`---`) to separate sections. A heading does the same job and appears in the navigation.
- Do not hard-wrap a paragraph, and never use trailing spaces as a line break. Keep each paragraph on one line in the source and let the editor wrap it.
- Anchor text names its destination. No "here", "this", "link", or a bare URL.
- Every document ends with a `Related` section linking its neighboring documents.

### Enforcement

`scripts/lint-docs.mjs` enforces the rules on this page that can be checked mechanically, and verifies every internal link and anchor. It runs on every pull request. Run it before committing:

```bash
node scripts/lint-docs.mjs
```

Two escape hatches exist for the case where a rule is being quoted rather than broken. End a line with `<!-- lint-ignore -->` to skip that line, or put `<!-- lint-disable: rule-id, rule-id -->` anywhere in a file to skip those rules in it. Use them for quotations, not for prose you would rather not fix.

The rules that need human judgment stay on the pull request checklist: title case, active voice, paragraph length, and whether a claim is true.

Dotfusion's own skills under `ai/skills/` are checked by the same linter, in a second job, because a skill is the executable form of a standard and is held to it. The vendored third-party skills are not, since they carry their own licenses and conventions.

## Documentation rules

When writing documentation:

1. State the purpose of the document.
2. Describe the current standard or current reality.
3. Separate global standards from project-specific exceptions.
4. Document why important decisions were made.
5. Include links to related docs when useful.
6. Avoid duplicating information that already exists in global docs.
7. Do not invent tools, processes, or architecture details.
8. Mark unknowns clearly as `Unknown` or `To confirm`.

## Public repository rule

This repository may be public.

Never include:

- client-specific private information
- secrets
- tokens
- environment values
- private URLs
- private infrastructure details
- incident details that expose vulnerabilities
- personal information
- commercial or contractual details

## Project documentation rule

Project documentation should live in the project repository under `/docs`.

Project docs should reference global documentation and document only:

- project-specific architecture
- setup instructions
- deployment details
- integrations
- runbooks
- decisions
- exceptions to global standards

## Required tone

Use a professional engineering tone.

Good:

> This project follows the global pull request process. The only exception is that production deployments require manual approval in Vercel because the client reviews each release before launch.

Bad:

> This project leverages a robust and scalable deployment strategy designed to empower seamless delivery. <!-- lint-ignore -->

## When generating docs from code

For project READMEs specifically, use the `project-readme` skill (`ai/skills/project-readme/`). It is the canonical, executable version of the steps below and stays in sync with our standards. The principles here apply to any documentation generated from a codebase:

1. Inspect package files, framework configuration, deployment configuration, and environment examples.
2. Identify the actual stack before writing.
3. Prefer facts from the repository over assumptions.
4. Create a short `Unknowns` section when something cannot be confirmed.
5. Do not describe unused tools as active.

## Related

- [Documentation standards](documentation-standards.md)
- [Documenting your work](../development/documenting-your-work.md)
- [Contributing](../CONTRIBUTING.md)
- [Glossary](../engineering/glossary.md)
- [Claude Code plugins setup](PLUGIN-SETUP.md)
