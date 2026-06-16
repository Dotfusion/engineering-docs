# Code security scanning (SAST)

This repository is public. Keep this document high-level.

We use static application security testing (SAST) to catch web vulnerabilities in our code (injection, XSS, insecure patterns, hardcoded secrets) before they ship.

## Where it belongs

- SAST is a **CI/CD gate**, not a developer-assistant skill.
- It runs against committed code on every pull request, independent of who or what wrote the code.
- Do not bundle the scanner into our Claude Code plugin. Plugin skills shape how code is written; the scanner enforces what gets merged. Putting it in the plugin would only cover code written through the assistant, leaving a gap.

## Tooling

We standardise on Semgrep.

- **Open-source CLI (Semgrep CE).** Free, runs locally, no account required. The baseline for CI scanning.
- **Hosted platform.** Adds cross-file analysis, a larger rule library, supply-chain and secrets scanning, and a central dashboard. Free tier available for small teams.

Both run code locally by default; source is not sent anywhere unless the hosted platform is explicitly enabled.

## How we use it

- Run on every pull request.
- Fail the build on high/critical findings; report lower-severity findings without blocking.
- Use diff-aware scanning so new code is gated without forcing a fix of all pre-existing issues at once.
- Prefer established rulesets (e.g. OWASP Top 10) over hand-rolled rules; add custom rules only for patterns specific to our stack.
- Upload results to the repo's security view where the platform supports it.

## Licensing and cost

- The open-source CLI (Semgrep CE) is free with no account and no contributor limit. It is always available as a zero-cost CI baseline.
- The hosted platform's full feature set is free for organisations at or under 10 monthly contributors. Beyond that it moves to paid per-contributor licensing.
- The free threshold is **contributor-based, not per-repository**. A contributor is counted once across the whole organisation even when they commit to many repos, and adding more repositories does not raise the count.
- Practical consequence: a small team can enable scanning across **all** repositories at no cost, as long as the number of distinct people committing across everything stays within the free contributor limit.
- A "contributor" is anyone who commits to a scanned private repo within Semgrep's recent activity window (roughly the last 30 days per their billing docs). Watch for contractors and non-deduplicated CI bots, which can push the count up.

## Optional: edit-time scanning

A developer-side integration can scan code as it is written and nudge toward secure patterns. This is a convenience layer that shifts checks earlier. It complements, but does not replace, the CI gate.

## Project documentation

Scanner configuration, ignore rules, and any per-project exceptions belong in each project's private `/docs`, not here.

## Related

- [Security guidelines](security-guidelines.md)
- [How to manage .env files](how-to-manage-env.md)
- [CI/CD](../delivery/ci-cd.md)
- [Development workflow](../development/development-workflow.md)
