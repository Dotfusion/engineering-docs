# Security guidelines

This document defines the default security standard and acts as the entry point for the security section. Security is part of quality: a feature that leaks data or credentials is not finished.

This repository is public, so this document stays high-level. Project-specific security details (the authentication model, sensitive integrations, the list of required secrets) must stay in private project documentation.

## Security section

| Document | What it covers |
| --- | --- |
| Security guidelines (this document) | The baseline principles every project follows |
| [How to manage .env files](how-to-manage-env.md) | Secret handling with 1Password, public vs private env vars, and the leak incident process |
| [Code security scanning](code-security-scanning.md) | Static application security testing (SAST) as a CI gate, using Semgrep |

## Principles

- **Least privilege.** Grant the minimum access needed to do the job, and no more. This applies to people, service accounts, API tokens, and database roles.
- **Defense in depth.** Do not rely on a single control. Validate on the server even when the client already validates; protect an admin route even when it is unlinked.
- **Secure by default.** New endpoints, buckets, and resources start closed and are opened deliberately, not the other way around.
- **Keep the attack surface small.** Every dependency, exposed endpoint, and public variable is something that can go wrong. Add them deliberately.

## Baseline rules

These apply to every project unless its documentation states a justified exception.

- **Never commit secrets.** No credentials, tokens, or environment values in git, ever. Manage secrets through 1Password (see [How to manage .env files](how-to-manage-env.md)).
- **Never expose secrets in public docs or logs.** This includes private infrastructure identifiers and internal URLs.
- **Validate and sanitize all untrusted input.** Treat anything from a user, a webhook, or a third party as untrusted. Use parameterized queries; never build queries by string concatenation.
- **Be deliberate about what reaches the browser.** Understand the difference between server-only and public environment variables before shipping (see [How to manage .env files](how-to-manage-env.md)).
- **Protect privileged actions.** Authenticate and authorize every admin interface and every action that changes or exposes data. Do not depend on a route being hidden.
- **Keep dependencies current and scanned.** Maintain dependencies (see [Code standards](../development/code-standards.md)) and run SAST on every pull request (see [Code security scanning](code-security-scanning.md)).
- **Manage access over its full lifecycle.** Grant access when someone joins a project and remove it when they leave or no longer need it. Stale access is a common and avoidable risk.
- **Prefer established, audited libraries for security primitives.** Do not hand-roll authentication, session handling, password hashing, or cryptography.

## When a secret is exposed

If a credential is committed to git, pasted in chat, or written to a log, treat it as compromised and rotate it immediately. The full incident process is documented in [How to manage .env files](how-to-manage-env.md#incident-process). The principle: assume the worst and rotate fast.

## Reporting a concern

If you discover a vulnerability or a leaked secret, raise it with the team lead promptly and privately. Do not describe an exploitable vulnerability in a public channel, a public issue, or this repository.

## Minimum project documentation

Each project should document privately, in its own `/docs`:

- the authentication model
- the authorization model (roles, permissions, how access is enforced)
- sensitive integrations and the data they touch
- required secrets and where they live in 1Password
- deployment and production access requirements
- data handling, retention, and privacy concerns
- backup and recovery expectations, where applicable
- any documented exception to these guidelines, with its reason

## Related

- [How to manage .env files](how-to-manage-env.md)
- [Code security scanning](code-security-scanning.md)
- [Code standards](../development/code-standards.md)
- [CI/CD](../delivery/ci-cd.md)
