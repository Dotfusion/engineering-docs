# Code standards

This document defines general code standards across projects.

Project-specific coding standards belong in the project repository when a project uses a different framework, language, or architecture.

## General standards

Code should be:

- readable
- consistent
- easy to test
- easy to delete or replace
- explicit about error handling
- structured around business meaning, not only technical layers
- respect Dotfusion philosophy for a composable architecture 

## Naming

Names should describe intent. Avoid names that only describe implementation details when the concept has business meaning.

Prefer:

```text
calculateInvoiceTotal
```

Over:

```text
processData
```

## Comments

Use comments to explain why something exists, not to restate what the code does.

Good comments explain:

- business rules
- edge cases
- external constraints
- temporary decisions
- unusual tradeoffs

## Configuration

Secrets and environment-specific values **must not be committed**.

Project documentation must explain required environment variables without exposing actual values.

An `.env.sample` file must exist in every project using environment variables. 
Project documentation should also explain how to get specific env vars.

## Dependency usage

Prefer adding dependencies only when they provide clear value.

Before adding a dependency, consider:

- can this be implemented simply in-house?
- is the dependency actively maintained?
- does it introduce unnecessary complexity?

Avoid:

- adding dependencies for trivial functionality
- using large libraries when a small utility is sufficient
- depending on unstable or poorly maintained packages

## Dependency management

Dependencies must be actively maintained and compatible with the project stack.

Do not add or update dependencies without checking:

- framework compatibility
- React version compatibility, when applicable
- peer dependency requirements
- maintenance status
- security risks
- bundle size impact
- whether the dependency is still necessary

Avoid installing packages with:

```bash
npm install --force
```

or:

```bash
npm install --legacy-peer-deps
```
These flags hide dependency conflicts instead of solving them.

If one of these flags is temporarily required, the reason must be documented in the project documentation, including:

- which package causes the conflict
- why the conflict exists
- why the workaround is acceptable for now
- what the proper fix should be
- when the workaround should be revisited

Package versions should not drift indefinitely. Each project should define a lightweight dependency maintenance routine, such as reviewing outdated and vulnerable packages regularly.

Before major framework upgrades, especially React, Next.js, Astro, or CMS SDK upgrades, review breaking changes and test the affected flows.

Dependency updates should be treated like code changes. They must be **reviewed, tested, and documented** when they affect architecture, build behavior, deployment, or runtime behavior.


Errors must be handled explicitly.

Do not silently swallow errors.

- Always log or surface errors appropriately
- Provide meaningful error messages (for developers, not just users)
- Avoid generic catch blocks without context

Prefer:

```js
try {
  await processPayment()
} catch (error) {
  logger.error("Payment failed", { error })
  throw new Error("Unable to process payment")
}
```
Over:
```js
try {
  await processPayment()
} catch (e) {}
```

Error handling should distinguish between expected errors (validation, user input) and unexpected errors (system failures, bugs)

