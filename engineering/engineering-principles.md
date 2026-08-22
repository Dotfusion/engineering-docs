# Engineering principles

These principles guide technical decisions across all projects.

## Build for maintainability

We prefer clear, maintainable solutions over clever ones.

A future developer should be able to understand the system without needing the original author in the room.

## Make decisions visible

Important decisions must be recorded. A decision that lives only in the memory of whoever made it is a decision the team will relitigate, usually while under pressure to ship something else.

A decision is important when it affects architecture, delivery, operations, security, cost, team workflow, or long-term maintainability.

Use an [Architecture Decision Record (ADR)](architecture-decision-records.md) when a decision changes how the system is built or operated.

## Keep project-specific complexity local

Global docs define the default way of working. Project docs explain what is different for that project, and why.

Do not copy global standards into project docs. Reference them and document only exceptions.

## Prefer small, reversible changes

Large changes are harder to review, harder to test, and harder to roll back.

When possible, break changes into small increments that can be shipped safely. [CI/CD](../delivery/ci-cd.md) describes the pipeline that makes a small change cheap to ship.

## Production is a product concern

Deployment, monitoring, error handling, rollback, and support are part of engineering work. See [CI/CD](../delivery/ci-cd.md), [Observability and monitoring](../observability/monitoring.md), and [Incident response](../delivery/incident-response.md).

A feature is not complete if nobody knows how to operate it.

## Related

- [Architecture Decision Records](architecture-decision-records.md)
- [Boilerplates and templates](boilerplates-and-templates.md)
- [Glossary](glossary.md)
- [Code standards](../development/code-standards.md)
- [Development workflow](../development/development-workflow.md)
- [Documentation standards](../agents/documentation-standards.md)
