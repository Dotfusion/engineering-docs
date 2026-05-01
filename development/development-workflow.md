# Development workflow

This document defines the default development workflow.

Project repositories may override this workflow when needed. Overrides must be documented in the project documentation.

## Source control

GitHub is the preferred source control platform.

Some legacy or client projects may use Bitbucket. When a project uses Bitbucket, the project documentation must explain where the repository lives and how the workflow differs from the global standard.

## Branching strategy

Default branch:

```text
main
```

Feature branches should use clear names:

```text
feature/add-contact-form
fix/repair-vercel-build
chore/update-dependencies
docs/add-deployment-runbook
```

## Pull requests

A pull request should be small enough to review with confidence.

Each pull request should include:

- a clear title
- a short description of the change
- testing notes
- screenshots or recordings for UI changes when useful
- documentation updates when behavior, architecture, setup, deployment, or operations change

## Code review

Code review is used to improve quality, share knowledge, and reduce risk.

Reviewers should look for:

- correctness
- maintainability
- readability
- security concerns
- test coverage where relevant
- unnecessary complexity
- documentation gaps

## Documentation expectation

If a change affects how the system works, how it is deployed, how it is configured, or how it is supported, documentation must be updated in the same pull request.
