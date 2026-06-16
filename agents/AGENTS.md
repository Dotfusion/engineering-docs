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

- Do not use "easy", "simple", or "quick" to describe an action. They pressure the reader and read as marketing. Describe the action concretely instead ("one command", "the default settings").
- Cut filler: "very", "just", "really".
- Replace a vague qualifier with a specific claim when a number exists. Where no figure exists because a standard spans many projects, a hedge like "most projects" or "often" is acceptable. Do not invent a number.

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
- Spell out an acronym on first use, then use the short form.

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

> This project leverages a robust and scalable deployment strategy designed to empower seamless delivery.

## When generating docs from code

For project READMEs specifically, use the `project-readme` skill
(`agents/skills/project-readme/`). It is the canonical, executable version of
the steps below and stays in sync with our standards. The principles here apply
to any documentation generated from a codebase:

1. Inspect package files, framework configuration, deployment configuration, and environment examples.
2. Identify the actual stack before writing.
3. Prefer facts from the repository over assumptions.
4. Create a short `Unknowns` section when something cannot be confirmed.
5. Do not describe unused tools as active.
