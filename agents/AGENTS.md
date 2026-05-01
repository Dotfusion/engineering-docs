# AGENTS.md

These instructions apply to AI agents writing or editing engineering documentation for Dotfusion team.

## Purpose

The goal is to create documentation that helps developers, project managers, product owners, and future team members understand how systems work and how the team operates.

Documentation should reduce dependency on individual memory.

## Writing style

Write clearly and directly.

Use plain technical language.

Avoid hype, filler, and vague statements.

Prefer concrete instructions over abstract advice.

Do not write marketing copy.

Do not overuse bullet lists. Use them when they make scanning easier.

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

When reading a codebase to generate documentation:

1. Inspect package files, framework configuration, deployment configuration, and environment examples.
2. Identify the actual stack before writing.
3. Prefer facts from the repository over assumptions.
4. Create a short `Unknowns` section when something cannot be confirmed.
5. Do not describe unused tools as active.
