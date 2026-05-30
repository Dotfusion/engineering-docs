---
name: project-docs
description: Create and maintain a project's `/docs` folder following Dotfusion's documentation standards. Use this skill whenever a developer wants to set up project documentation, document a project, fill in or refresh `/docs`, record an architecture decision (ADR), or check whether the docs still match the code — even when phrased loosely ("the docs are stale", "document this project", "set up docs", "write a runbook", "we decided to switch to X"). It scaffolds `/docs` from the team's template-project repo, fills docs from the actual codebase, audits docs against the code for drift, and records ADRs. Prefer this over writing project docs from memory.
---

# Project documentation (`/docs`)

Keep a project's `/docs` folder present, complete, and accurate, following
Dotfusion's standards. The root `README.md` is owned by the `project-readme`
skill — this skill owns everything under `/docs`. Never invent facts: derive
what you can from the codebase, ask the developer for the rest, write in one
pass, then hand off for verification.

Global standards live in `Dotfusion/engineering-docs`. Project docs describe the
*reality of this one project* and reference the global docs instead of
duplicating them. Document only project-specific detail and exceptions.

## The `/docs` structure

The canonical template is the `docs/` folder of the `Dotfusion/template-project`
repo. It contains:

- `overview.md` — what the project does, its responsibilities, and boundaries
- `context.md` — business/product context, source-doc links, key flows, business rules
- `architecture.md` — structure, mermaid diagram, components, data flow, constraints
- `integrations.md` — external services/APIs and how they're configured
- `setup.md` — local setup and troubleshooting
- `deployment.md` — hosting, deploy flow, env vars, rollback, checklist
- `runbooks.md` — operational procedures
- `overrides.md` — differences from global standards
- `decisions/` — ADRs (architecture decision records)
- `AGENTS.md` — pointer to global standards

## Step 1 — Identify what's needed

Determine which of these the developer needs (often more than one):

- **Scaffold** — `/docs` is missing or incomplete → create it from the template.
- **Fill / update** — populate or refresh specific docs from the codebase.
- **Audit** — check existing docs against the code and report drift and gaps.
- **Record a decision** — add an ADR.

## Step 2 — Scaffold from the template

When `/docs` (or a specific file) is missing, copy the canonical structure from
the template repo rather than inventing it. Shallow-clone into a temp directory,
copy only the files that don't already exist, and clean up:

```bash
tmp="$(mktemp -d)"
git clone --depth 1 https://github.com/Dotfusion/template-project "$tmp"
mkdir -p ./docs
rsync -a --ignore-existing "$tmp/docs/" ./docs/   # never overwrites existing docs
rm -rf "$tmp"
```

`--ignore-existing` means an established project only gets its missing pieces
filled in; nothing already written is clobbered. (If `template-project` is
private, the developer's existing git credentials handle authentication.) If
`rsync` is unavailable, copy missing files individually instead of `cp -R`,
which would overwrite.

## Step 3 — Analyze the repository

Before filling or auditing anything, derive as much as possible from the code:

- **Manifests** (`package.json`, `pyproject.toml`, etc.) → stack, scripts, versions → `overview.md`, `setup.md`
- **`.env.sample` / `.env.template`** → required env vars → `setup.md`, `deployment.md`
- **CI/CD** (`.github/workflows/`, etc.) and **deploy config** (`vercel.json`, `netlify.toml`, `Dockerfile`, …) → `deployment.md`, `runbooks.md`
- **Entry points and folder layout** → `architecture.md`, the project-structure section of `setup.md`
- **External SDKs/clients in dependencies** → `integrations.md`
- **Existing `/docs`** → reconcile: keep accurate parts, fix stale ones

Anything visible in the code, you read — never ask about it.

## Step 4 — Ask the developer (don't assume)

Batch a single set of questions covering only what the code can't tell you:

- business/product context and source-doc links (Google Drive, NotebookLM, Jira) → `context.md`
- production/staging URLs, who can deploy → `deployment.md`
- business rules that affect engineering decisions → `context.md`
- known operational risks, rollback specifics not in config → `runbooks.md`, `deployment.md`
- anything genuinely ambiguous

Keep it tight. Don't ask about anything the repo already answers.

## Step 5 — Write (one pass)

Fill the relevant docs from the template structure + derived facts + answers:

- Be specific to this project; no boilerplate or generic filler.
- Use real names from the codebase (scripts, env vars, paths, routes).
- Reference global docs rather than restating them; record genuine differences in `overrides.md`.
- Mark anything unconfirmed as `Unknown:` or `To confirm:` — never paper over uncertainty.
- Tables for structured data; fenced code blocks with a language; `text` for directory trees; spaced pipes (`| --- | --- |`); no emojis.
- Update the `architecture.md` mermaid diagram if the structure changed.

## Step 6 — Audit (keeping docs alive)

When asked to check or refresh docs, compare them against the repo and **report
drift before changing anything**:

- env vars in `setup.md` / `deployment.md` vs `.env.sample`
- scripts in `setup.md` vs `package.json`
- stack and versions vs the manifests
- deployment details vs CI / deploy config
- integrations vs the actual dependencies
- the set of files in `/docs` vs the standard set above (flag missing ones)

List the findings, then offer to fix them. Do not silently rewrite docs.

## Recording a decision (ADR)

When a developer makes or records an architecture decision:

1. Create `docs/decisions/YYYY-MM-DD-short-title.md` from the ADR template in `docs/decisions/`.
2. Fill in: Date, Status (proposed / accepted / superseded), Context, Decision, Consequences.
3. Keep it short and factual — capture *why*, not a tutorial.

Use an ADR when a decision changes how the system is built or operated, or
introduces an exception to a global standard (also note the exception in
`overrides.md`).

## Step 7 — Hand off for verification

End with a short note to the developer in chat (not in the docs):

- What you scaffolded vs filled, and every `Unknown:` / `To confirm:` you left.
- A reminder to verify commands, env vars, deployment steps, and business rules.
- If the root `README.md` also needs updating, point them to the `project-readme` skill.
