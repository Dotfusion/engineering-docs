---
name: project-readme
description: Generate a thorough, project-specific README for a software repository, following our team's documentation standards. Use this skill whenever a developer wants to create, rewrite, or update a README, document a repo for onboarding, or asks for setup/deployment docs — even when they phrase it loosely ("document this repo", "the README is stale", "write setup instructions"). It analyzes the actual codebase, asks the developer about anything it cannot determine from the code rather than guessing, and bakes in team conventions like 1Password-based secret management. Prefer this over writing a README from memory.
---

# Project README

Write a README that gets a developer joining the team productive on day one. The target reader is a new teammate cloning the repo for the first time — not a generic open-source visitor. Every fact in the README must be true for *this* repository, drawn from the code or confirmed by the developer.

This skill never invents facts. It derives everything it can from the repository, asks the developer about the rest, and only then writes. The output file is always `README.md` at the repository root.

## Step 1 — Analyze the repository

Read enough to understand the project before asking anything. At minimum:

- **Dependency + script manifests**: `package.json`, `requirements.txt` / `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, etc. — stack, scripts, entry points.
- **Secret/config templates**: `.env.example`, `.env.template`, `.env.local`, `config/` — environment variables and how secrets are managed.
- **CI/CD**: `.github/workflows/` (GitHub Actions), plus `.gitlab-ci.yml`, `circleci/`, etc. — what runs on push/PR (lint, test, build, deploy), and what triggers deploys.
- **Deployment config**: `vercel.json`, `netlify.toml`, `Dockerfile`, `docker-compose.yml`, `fly.toml`, `render.yaml`, etc. — where and how it ships.
- **Structure**: the top-level layout and the `src/` or `app/` directory.
- **Existing docs**: any current `README`, a `docs/` folder, or inline docs — reuse accurate parts, fix stale parts.
- **Entry points + routing**: enough to understand what the app actually does.

Derive as much as possible here. Anything visible in the code — stack, scripts, routes, CI steps, structure — you must read, never ask about.

## Step 2 — Ask the developer (don't assume)

After analyzing, list the things the README needs that the code does not tell you, and ask the developer in a **single batched set of questions**. Do not write the README until you have answers (or the developer explicitly says to proceed without them).

Ask only about what is genuinely not derivable from the repo. Common examples:

- **Purpose & audience** — what real problem the project solves and who uses it. The code shows *what*, rarely *why* or *for whom*.
- **Deployment specifics not in config** — production URL, staging vs prod environments, manual deploy steps, who can deploy.
- **Ambiguous secret management** — if you can't tell how secrets are handled (see below).
- **Anything else you would otherwise have had to guess.**

Keep the list tight. If something is obvious from the code, don't ask — that wastes the developer's time and signals you didn't read the repo.

## Step 3 — Write the README

Write to `README.md` at the repository root. If a README already exists, reconcile against reality: keep the accurate parts, fix the stale parts, don't blank-slate work that's still correct.

Always include the mandatory sections. Add optional sections only when the repo warrants them — if there are migrations, include the database section; if there are no tests, skip testing. Don't pad with empty headings.

### Mandatory sections

1. **Introduction** — What the project is, what problem it solves, who uses it. Specific to this repo, never generic.
2. **Stack** — Full technology breakdown as a table (framework, language, database, auth, key integrations, monitoring, etc.).
3. **Running locally** — Step-by-step from a clean machine: prerequisites, secret/environment setup, install, start. Include the non-obvious steps; assume nothing is already installed. See the secret-management note below.
4. **Deployment** — Where the app is deployed, how deploys are triggered (push to `main`, manual, CI workflow), and where environment variables are configured.
5. **Documentation** — A short pointer block. Always link the team's global standards repo (coding style, commit conventions, workflow): https://github.com/Dotfusion/engineering-docs. If the repo has a `docs/` folder, also link it as the project's detailed docs.

### Optional sections (include when the repo warrants it)

- **Environment variables reference** — a table of variable name, visibility (public/secret), purpose, and where to obtain it. Lead with the secret-management note (below) *before* the table. This is a reference, not a setup walkthrough.
- **CI/CD pipeline** — what the workflows run on push/PR (lint, test, build) and how deploys are triggered, when this is non-trivial.
- **Project structure** — annotated folder map with a short data-flow explanation.
- **Key API routes or CLI commands**.
- **Database setup or migrations**.
- **Testing** — how to run tests and what's covered.
- **Feature flags or configuration options**.
- **Background jobs / cron / re-indexing tasks**.
- **Branching / contributing strategy** — only if there's explicit evidence of one in the repo.

## Secret management (team convention)

Most of our projects use **1Password Developer environments** for secrets, with one rule: **the 1Password environment name matches the repo name exactly.** When this applies, document it and show how to pull secrets:

```bash
op run --env-file=".env.template" -- npm run dev
# or, to materialize a local file:
op inject -i .env.template -o .env.local
```

Adjust the command to the repo's actual scripts and template filename.

**Detect before documenting.** Check whether this repo actually uses 1Password — signals include `op run` / `op inject` in scripts, a `.op/` directory, or mentions in existing docs.

- If you see those signals → document the 1Password convention as above.
- If the repo clearly uses something else (plain `.env`, Doppler, Vault, platform-managed env vars) → document *that* approach accurately, and flag the migration recommendation below in the hand-off.
- If it's ambiguous → ask the developer in Step 2 rather than guessing.

### When a repo is not on 1Password — recommend migrating (don't do it)

If the project doesn't use 1Password, recommend standardizing it in the hand-off message. **Never import or handle the actual secret values yourself** — that's the developer's job. Give them the steps to do it:

1. Create a 1Password Developer environment named **exactly** after the repo.
2. Import the existing `.env` / `.env.local` values into that environment (developer does this).
3. Replace committed secrets with a reference `.env.template` (1Password references, no real values).
4. Update the dev script to wrap with `op`, e.g. `op run --env-file=.env.template -- npm run dev`.

## Writing rules

- **Be specific to this project.** Never write boilerplate like "this project was bootstrapped with…" or "to learn more, visit…".
- **Use real names** from the codebase — actual script names, env var names, file paths, route names.
- **Be concise.** One sentence beats a paragraph when one sentence is enough.
- **Use tables** for structured data (stack, env vars, API routes).
- **Use fenced code blocks with a language identifier** for every shell command and file tree. Use `text` as the language for directory trees.
- **Table separator rows use spaced pipes**: `| --- | --- |`, not `|---|---|`.
- **No emojis.**
- **No "Contributing" or "License" section** unless there's explicit evidence of one in the repo.

## Step 4 — Hand off for verification

After writing, end with a short note to the developer (in chat, not in the README):

- Remind them to **read the result and verify every fact** — especially commands, env var names, and deployment details, which are easy to get subtly wrong.
- If the project is **not on 1Password**, surface the migration recommendation and its steps.
- Note anything the developer should double-check based on the answers they gave in Step 2.
