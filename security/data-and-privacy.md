# Data handling and privacy

This document defines the default standard for handling personal data in the systems we build. It is the privacy counterpart to [Security guidelines](security-guidelines.md): security is about keeping people out of data they should not reach, and privacy is about not collecting or keeping data we have no reason to hold.

This repository is public, so this document stays at the level of principle and practice. What personal data a given project actually processes, where it is stored, and under which agreement belongs in that project's private `/docs`.

This is not legal advice. Where a project has a real compliance obligation, the client's counsel or privacy officer decides what it requires, and we build to that.

## Why this is an engineering standard

We decide privacy in code, long before anyone writes a policy. Adding a field to a form, a parameter to an analytics event, or a request body to a log line decides what data exists and how long it lives. Those decisions are ours to make, they are difficult to reverse, and they are what a client has to account for if a regulator or a customer ever asks.

We work with Canadian clients and, through them, with data belonging to people in Canada, the United States, and the European Union. The legislation that most often applies to our work:

- **PIPEDA.** The Personal Information Protection and Electronic Documents Act, Canada's federal private-sector privacy law, which governs commercial collection, use, and disclosure of personal information.
- **Quebec Law 25.** Quebec's private-sector regime, stricter than the federal baseline on consent, transparency, and breach reporting. Consent must be sought separately for each purpose rather than bundled.
- **GDPR.** The General Data Protection Regulation, the European Union regime. It applies when a client offers goods or services to people in the EU or monitors their behavior, wherever the servers are.
The Accessibility for Ontarians with Disabilities Act (AODA) is not privacy legislation, but it follows the same pattern: a client obligation that becomes our build requirement. See [Accessibility](../accessibility/accessibility.md).

The rules below are what these regimes have in common, and they are worth following whether or not a specific law is in scope on a given project.

## Rules that apply to every project

These hold unless a project's documentation states a justified exception.

- **Collect the minimum.** Every field on a form and every property on an analytics event needs a reason someone can state out loud. A field collected in case it proves useful later is pure liability: it carries every obligation of data we need, and none of the value. When a client asks for a field with no stated use, ask what it is for before building it.
- **Know what counts as personal data.** A name and an email are obvious. An IP address, a device identifier, a session recording, a support ticket, an uploaded file, and a free-text comment field are all personal data too, and they are the ones that get forgotten.
- **Keep personal data out of logs.** Do not log request bodies, form submissions, tokens, or full user records. Log an identifier you can join against, not the data itself. Logging is how personal data most often ends up somewhere nobody intended, in a system with a different retention period and a wider audience than the one it was collected into.
- **Keep personal data out of error reports.** Configure the error tracker to scrub request bodies, headers, and cookies before they leave the application. An unscrubbed stack trace is a copy of whatever the user typed. See [Observability and monitoring](../observability/monitoring.md).
- **Never use production personal data in a non-production environment.** Seed development and test environments with synthetic data. A copy of the production database on a developer laptop or in a preview environment is a breach waiting for an audience.
- **Decide retention when you build the feature.** Data with no deletion path accumulates forever. Ask how long a record needs to exist and build the mechanism that removes it, rather than leaving it as a future task.
- **Make consent real where it is required.** When a client's obligations require consent for analytics or marketing, the scripts must not load until consent is given. A consent banner that appears after the tracker has already fired is worse than none, because it documents the failure.
- **Treat a third party as part of the system.** A form that posts to a marketing platform, an embedded booking flow, and a session recording tool all send personal data outside our client's control. Know where each one sends it, and write that list down. This mirrors how we handle [third-party and embedded content](../accessibility/accessibility.md#third-party-and-embedded-content) for accessibility: we state what is ours and what is the vendor's rather than claiming the whole thing.
- **Support the rights that apply.** Where a project is in scope for a regime granting access, correction, deletion, or portability rights, someone has to be able to act on a request. If fulfilling one would require a developer to write a one-off query under time pressure, that is a gap to close before it is needed.

## Data in transit and at rest

Four defaults apply to every project, whatever data it handles:

- Serve everything over HTTPS, with no mixed-content exceptions.
- Prefer the managed platform's encryption at rest over anything hand-rolled, and confirm it is on rather than assuming.
- Set cookies with `Secure`, with `HttpOnly` wherever client-side JavaScript has no need to read them, and with an appropriate `SameSite` value.
- Apply the least-privilege rule from [Security guidelines](security-guidelines.md) to database roles and service accounts, so an application component cannot read a table it has no reason to touch.

## When personal data is exposed

Treat this as an incident, not a code fix. Follow [Incident response](../delivery/incident-response.md), and note two things specific to a privacy incident:

1. **The clock may be legal, not operational.** Reporting deadlines run from the moment of awareness rather than from the moment you finish investigating. GDPR sets 72 hours. Escalate to the team lead and the client immediately, and investigate in parallel.
2. **Notification is the client's decision to make, with counsel.** Our job is to establish the facts accurately: what data, how many records, over what window, and reachable by whom. We do not decide who gets told.

A leaked credential is a different case, handled by the rotation process in [How to manage .env files](how-to-manage-env.md).

## Minimum project documentation

Each project should document privately, in its own `/docs`:

- what personal data the system collects, and the reason for each category
- where that data is stored, and which third parties receive it
- the retention period for each category, and the mechanism that enforces it
- how a data subject request would be fulfilled, and by whom
- what scrubbing is configured in logging and error tracking
- which privacy regimes the client has told us apply
- the data processing agreement or client requirement this is built against, if any
- any documented exception to these rules, with its reason

## Related

- [Security guidelines](security-guidelines.md)
- [How to manage .env files](how-to-manage-env.md)
- [Code security scanning](code-security-scanning.md)
- [Incident response](../delivery/incident-response.md)
- [Observability and monitoring](../observability/monitoring.md)
