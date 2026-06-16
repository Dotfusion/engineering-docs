# Architecture Decision Records (ADRs)

This document defines how we record significant technical decisions. It is the standard referenced by [Make decisions visible](engineering-principles.md) and by the "decisions" section required in [Documentation standards](../agents/documentation-standards.md).

An Architecture Decision Record captures one decision: what we chose, why, and what it rules out. The point is that a future developer can understand why the system is the way it is without finding the person who decided it.

## When to write an ADR

Write an ADR when a decision changes how the system is built or operated and would be expensive or confusing to reverse without context. A decision qualifies when it affects architecture, delivery, operations, security, cost, team workflow, or long-term maintainability.

Typical triggers:

- choosing a framework, database, hosting platform, or major library
- adopting or replacing an integration or external service
- a structural pattern that the rest of the codebase will follow
- a deliberate deviation from these global standards
- a tradeoff where the rejected option was reasonable and someone will later ask why it was not chosen

Do not write an ADR for routine, easily reversible choices. The test is whether the reasoning will be missed later. If yes, record it.

## Where ADRs live

ADRs are project-specific, so they live in the project repository under `/docs/decisions/`, not in this global repository. Name them with a zero-padded sequence number and a short slug:

```text
docs/decisions/0001-use-supabase-for-auth.md
docs/decisions/0002-move-image-processing-to-a-queue.md
```

A decision that changes a global standard for everyone (not only one project) is proposed as a change to this repository instead, so the standard and its reasoning stay together.

## Status lifecycle

Each ADR has a status:

- **Proposed.** Under discussion, not yet decided.
- **Accepted.** The decision is in effect.
- **Superseded.** Replaced by a later ADR. Link to the one that replaces it.
- **Deprecated.** No longer applies, but kept for the historical record.

ADRs are immutable once accepted. Do not rewrite history. When a decision changes, write a new ADR that supersedes the old one and update the old one's status and link. This preserves the record of what was true and when.

## Template

Copy this into a new file under `docs/decisions/`. Keep it short. An ADR that takes more than a page usually contains more than one decision.

```markdown
# NNNN. Short title of the decision

- Status: Proposed | Accepted | Superseded by [NNNN](NNNN-title-slug.md) | Deprecated
- Date: YYYY-MM-DD
- Deciders: names or roles

## Context

What is the situation and the forces at play? What problem are we solving, and
what constraints (technical, business, time, cost) apply? State facts, not the
decision yet.

## Decision

What we are doing, stated plainly in the active voice. "We will use X."

## Alternatives considered

The other options and why each was not chosen. This is the most valuable part:
it answers "why not X?" before anyone asks.

## Consequences

What becomes easier and what becomes harder as a result. Include follow-up work,
new constraints, and anything this decision commits us to.
```

## Related

- [Engineering principles](engineering-principles.md)
- [Documentation standards](../agents/documentation-standards.md)
- [Development workflow](../development/development-workflow.md)
