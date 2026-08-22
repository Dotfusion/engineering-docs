# Incident response

This document defines what happens when a live system breaks. [Observability and monitoring](../observability/monitoring.md) covers detecting a problem and [CI/CD](ci-cd.md) covers reversing a bad release. This document covers the part in between: who does what, in which order, and what we write down afterward.

The purpose is to settle these questions in advance. During an incident nobody should be working out who to tell, or whether they have permission to roll back.

These are global defaults. The contacts, escalation path, and client notification terms for a given project belong in that project's private `/docs`, because this repository is public.

## What counts as an incident

An incident is an unplanned event that degrades or interrupts a live system for the people using it. A failing build is not an incident, and neither is a bug behind a feature flag nobody has enabled. A checkout that intermittently returns an error to real customers is an incident, even if it succeeds most of the time.

We use three levels. More than three means arguing about classification while the site is down:

| Level | Meaning | Response |
| --- | --- | --- |
| Critical | The system is down, a primary flow such as checkout or sign-in fails, or data loss or exposure is suspected. | Drop other work and respond immediately. Notify the client. |
| Major | A feature is broken or badly degraded and there is no workaround, but the primary flows still work. | Respond the same working day. Notify the client if users can see it. |
| Minor | Something is wrong and there is a workaround, or the effect is cosmetic. | Handle as prioritized work. Record it, do not escalate it. |

Suspected exposure of credentials or personal data is Critical regardless of how few records are involved. See [How to manage .env files](../security/how-to-manage-env.md) and [Data handling and privacy](../security/data-and-privacy.md).

When the level is unclear, treat it as the higher one until you know otherwise. Downgrading is cheap and upgrading late is not.

## Roles during an incident

One person often holds more than one of these roles, and on a small incident all three. Naming them is still worth doing, because it makes visible which job nobody is currently doing.

- **Incident lead.** Owns the response and decides what happens next, including whether to roll back. The first responder holds this role until someone else takes it. Always exactly one person, and whoever takes over says so explicitly rather than assuming it.
- **Investigator.** Works the technical problem. On a larger incident this is not the incident lead, because diagnosing and coordinating at the same time means doing both badly.
- **Communicator.** Keeps the client and the internal team informed. Matters most when the incident runs long enough that silence becomes its own problem.

## The order of operations

The order matters more than the individual steps: restore service first, understand the cause afterward.

1. **Confirm and classify.** Reproduce the failure and establish its reach: which users, which flow, since when. Assign a level. Say in the team channel what is happening and that you are on it, so nobody duplicates the work.
2. **Stop the harm.** Restore service by the fastest reliable route, which is usually reverting rather than fixing forward. Prefer the platform rollback described in [CI/CD](ci-cd.md). If the cause is a recent deploy, roll it back before diagnosing it. A rollback is reversible and an outage is not.
3. **Communicate.** Tell the client what is affected, what you are doing, and when you will next update them. Give a next-update time rather than an estimated fix time, and then honor it. On a long incident, update on that cadence even when there is nothing new, because silence reads as nobody looking.
4. **Contain the secondary damage.** Rotate anything that may have been exposed. Disable the failing integration or feature if it is still causing harm. Save the evidence you will want for the postmortem now, because logs, error reports, and traces are all retained for a limited window and the useful ones expire first.
5. **Verify recovery.** Check the system against the definition of healthy in the project's documentation. Loading the home page is not that check. Run smoke tests against the deployed environment where they exist. Tell the client it is resolved, and say what caused it if you know.
6. **Write it up.** Within three working days, while the detail is still accurate.

Roll back by default. Fix forward only when a rollback would itself be unsafe, most often because a database migration is not backward compatible. A project's rollback documentation exists to tell you which case you are in before you have to decide.

## The postmortem

Every Critical incident gets a written postmortem. Major incidents get one when the cause is not already understood. The document is blameless: it examines the system that allowed a person to make a reasonable mistake, not the person.

Keep it short and cover:

- **What happened.** The user-visible impact, and its duration.
- **Timeline.** When it started, when we noticed, when we responded, when it was resolved. The gap between started and noticed is usually the most useful number in the document.
- **Cause.** What went wrong, including the contributing conditions rather than one root cause. Real incidents have several, and stopping at the first one hides the rest.
- **What worked.** Which alert, test, or piece of documentation helped. Worth knowing, so it is not removed later.
- **What did not.** The missing alert, the stale runbook, the check that would have caught this.
- **Actions.** Specific changes, each with an owner. An action item with no owner is a wish.

Postmortems live in the project repository under `/docs`, kept general enough that they do not become a vulnerability disclosure. When an incident reveals a gap in a global standard, the fix belongs in this repository as a change to the relevant document, so every project gets it.

The test of a postmortem is whether it produced a change. When the same incident happens twice, the first postmortem was filed and never acted on.

## When the answer is an alert, not a fix

Read the timeline before writing the action items. When the answer to "when did we notice?" is "when the client called", the gap is detection rather than code, and the action item is an alert. A fix shipped without that alert leaves the next incident of the same class equally invisible. See [Observability and monitoring](../observability/monitoring.md).

## Minimum project documentation

Each project should document, in its own `/docs`:

- who to contact, on our side and the client's, and how, outside working hours if that applies
- what the client's agreement requires in terms of response and notification, if anything
- the rollback procedure, and any migration constraint that makes rollback unsafe
- what "healthy" means for this system, in observable terms
- where logs, error reports, and alerts are found
- which third-party outages would take this system down with them
- past postmortems

The severity levels above are our own default. To confirm: whether any client agreement commits us to a specific response time, availability target, or out-of-hours coverage, which would override those defaults for that project.

## Related

- [CI/CD](ci-cd.md)
- [Observability and monitoring](../observability/monitoring.md)
- [Security guidelines](../security/security-guidelines.md)
- [How to manage .env files](../security/how-to-manage-env.md)
- [Data handling and privacy](../security/data-and-privacy.md)
- [Team working model](../process/team-working-model.md)
