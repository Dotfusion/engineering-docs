# Dotfusion Engineering docs

This repository contains the global engineering documentation for the team. 

It defines how we work across projects: engineering principles, development workflow, code standards, review expectations, testing strategy, delivery practices, documentation standards, and AI-agent instructions to help developers writing documentation.

Project-specific documentation belongs inside each project repository under `/docs`.

## Table of contents

<div style="display:flex; gap:1rem">
<div style="flex:1">
### Engineering

- [Engineering principles](engineering/engineering-principles.md)
- [Code standards](development/code-standards.md)

### Process

- [Team working model](process/team-working-model.md)

### Development

- [Development workflow](development/development-workflow.md)

### Quality

- [Testing strategy](quality/testing-strategy.md)
</div>
<div style="flex:1">

### Delivery

- [CI/CD](delivery/ci-cd.md)

### Observability

- [Monitoring](observability/monitoring.md)

### Security

- [Security guidelines](security/security-guidelines.md)

### Documentation & AI

- [Documentation standards](agents/documentation-standards.md)
- [AGENTS.md](agents/AGENTS.md)
</div></div>

## Visibility rule

This repository is intended to be **public**.

### Do not include:

- client-specific information
- private architecture details
- credentials, secrets, tokens, or environment values
- internal infrastructure identifiers
- incident details that expose vulnerabilities
- contractual or commercial information

If a document only applies to one client or one project, it belongs in that project's private repository.

## Documentation model

We use two documentation levels:

1. **Global documentation**  
   Shared engineering standards, principles, workflows, and conventions.

2. **Project documentation**  
   Project-specific architecture, setup, integrations, deployment details, runbooks, decisions, and exceptions to global standards.

Project docs should reference global docs instead of duplicating them.

Gitbook will collect all these documents and organize them in a "wiki-style" way for our team. 
