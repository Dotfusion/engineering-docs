# Engineering principles

These principles guide technical decisions across all projects.

## Build for maintainability

We prefer clear, simple, maintainable solutions over clever ones.

A future developer should be able to understand the system without needing the original author in the room.

## Make decisions visible

Important decisions must be recorded. The Product & Operations team invests real time and effort into building great business-decision documentation. We, the engineering team, should do the same: maintain living documentation that helps each of us do our jobs as well as we can.

A decision is important when it affects architecture, delivery, operations, security, cost, team workflow, or long-term maintainability.

Use an [Architecture Decision Record (ADR)](architecture-decision-records.md) when a decision changes how the system is built or operated.

## Keep project-specific complexity local

Global docs define the **default** way of working.

Project docs explain what is **different** for that project and why.

Do not copy global standards into project docs. Reference them and document only exceptions.

## Prefer small, reversible changes

Large changes are harder to review, harder to test, and harder to rollback.

When possible, break changes into small increments that can be shipped safely.

## Production is a product concern

Deployment, monitoring, error handling, rollback, and support are part of engineering work.

A feature is not complete if nobody knows how to operate it.

## Related

- [Architecture Decision Records](architecture-decision-records.md)
- [Code standards](../development/code-standards.md)
- [Development workflow](../development/development-workflow.md)
- [Documentation standards](../agents/documentation-standards.md)
