# Observability and monitoring

This document defines the default observability standard. For any live system, the team should be able to answer "is it healthy?" and "what went wrong?" without guessing.

These are global defaults. The concrete tools, dashboards, and alert routing for a given system belong in that project's documentation, not here, because this repository is public.

## What observability gives us

A system is observable when its behavior can be understood from the outside, using the signals it emits. We care about three kinds of signal:

- **Logs.** A timestamped record of discrete events. Used to reconstruct what happened during a specific request or failure.
- **Metrics.** Numeric measurements over time (request rate, error rate, latency, resource use). Used to see trends and trigger alerts.
- **Errors.** Captured exceptions with stack traces and context. Used to find and fix bugs that reach production.

Most of our projects are web applications on managed platforms, so full distributed tracing is often unnecessary. Logs, error tracking, and a few key metrics cover the majority of cases. Add tracing only when a system is distributed enough that a single request crosses several services and you cannot otherwise follow it.

## The baseline every live project needs

A project that serves real users should have, at minimum:

- **Error tracking** that captures unhandled exceptions on both the server and the client, with enough context (release, environment, user action) to reproduce them. Sentry is the common choice for our stack.
- **Access to platform logs** for the runtime (for example Vercel, Netlify, or AWS) and for the build and deployment pipeline.
- **Uptime checking** on the primary user-facing URL and on any critical API, so an outage is detected before a user reports it.
- **A definition of healthy.** Each project states what "working" means in observable terms (for example: home page returns 200, login succeeds, the primary flow completes).

If a project is live and any of these is missing, that is an operational gap worth recording and closing.

## Alerting

Alerts exist to prompt action, not to create noise.

- Alert on symptoms users feel (the site is down, errors are spiking, latency is high), not on every internal fluctuation.
- Every alert should have a clear owner and a known first response. An alert nobody acts on should be removed or fixed.
- Route alerts to a channel the responsible people actually watch. Document where alerts go and who is on the receiving end.
- Tune aggressively. Alert fatigue is a failure mode: when alerts are noisy, real ones get ignored.

## Connecting errors to releases

Errors are far easier to diagnose when they are tied to a specific release. Where the error tracking tool supports it, projects should:

- tag captured errors with the deployed version or commit, and
- upload source maps so client stack traces are readable.

This makes "this broke in the last deploy" answerable in seconds and supports the rollback steps in the [CI/CD](../delivery/ci-cd.md) standard.

## Operational ownership

If a system is live, someone must be able to:

- confirm it is working,
- investigate an error from a report or an alert,
- roll back a bad deployment (see [CI/CD](../delivery/ci-cd.md)),
- and reach the right people when support is needed.

This knowledge must live in documentation, not only in one person's head. See the [Team working model](../process/team-working-model.md) on reducing dependency on individual memory.

## Minimum project documentation

Each project should document, in its own `/docs`:

- where production logs are available
- where build and deployment logs are available
- how errors are reported and where they surface
- what analytics or monitoring tools are configured and how to reach them
- what "healthy" means for this system
- which alerts exist, what they mean, and who receives them
- known operational risks and their current mitigations

## Related

- [CI/CD](../delivery/ci-cd.md)
- [Testing strategy](../quality/testing-strategy.md)
- [Engineering principles](../engineering/engineering-principles.md)
- [Team working model](../process/team-working-model.md)
