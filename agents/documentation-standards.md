# Documentation standards

This document defines how documentation should be written and maintained.

## Core rule

Documentation should explain what someone needs to know to work safely and independently.

## Global vs project documentation

Global documentation describes standards used across our projects.

Project documentation describes the reality of one project.

Project documentation should not copy global standards. It should reference them and explain differences.

## Required sections for project docs

Each project should have:

- overview
- business and product context references
- architecture
- local setup
- deployment
- integrations
- runbooks
- decisions
- overrides to global standards

## Unknowns

If something is unknown, write it clearly.

Do not hide uncertainty.

Use:

```text
Unknown: The rollback process has not been confirmed yet.
```

## Keeping docs alive

Documentation should be updated when:

- behavior changes
- setup changes
- deployment changes
- architecture changes
- a new integration is added
- a decision is made
- a recurring issue is discovered
