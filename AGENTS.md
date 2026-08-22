# AGENTS.md

The canonical instructions for AI agents working in this repository live in
[`agents/AGENTS.md`](agents/AGENTS.md). Read that file before writing or editing
any document here.

This root file exists because agent tooling looks for `AGENTS.md` at the
repository root. It is a pointer, not a second standard. When the two would
disagree, `agents/AGENTS.md` is correct and this file is stale.

Summary of what that file requires, so a shallow read still gets the rules right:

- Write in plain, direct language. Active voice. Address the reader as "you", and
  use "we" for shared team standards.
- Sentence case headings. Never an em dash. Straight quotes, not curly.
- Do not use "easy", "simple", or "quick" to describe an action. Cut "very", <!-- lint-ignore -->
  "just", and "really". <!-- lint-ignore -->
- American spelling.
- Every code block carries a language tag, and prose explains what it does.
- Never invent a fact. Derive it from the repository, ask the developer, or mark
  it `Unknown:` or `To confirm`.
- This repository is public. Nothing client-specific, private, or secret.

Run `node scripts/lint-docs.mjs` before committing. It enforces the mechanical
rules and verifies every internal link. See [CONTRIBUTING.md](CONTRIBUTING.md).
