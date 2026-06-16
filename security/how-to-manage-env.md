# How to manage .env files

## Environment variables are secrets

`.env` files contain API keys, database credentials, and service tokens that grant access to real systems. Committing them to git, even briefly, can expose those credentials permanently. Git history is hard to scrub and repos can be cloned or cached at any moment.

Key rules:

- Never commit a `.env`, `.env.local`, or similar file containing real values.
- Never share secrets over Slack, email, or any chat tool. Messages are logged and not access-controlled like a secrets manager.
- `.env.template` (or `.env.example`) files are safe to commit. They contain variable names with no values, or 1Password references.

## 1Password to rule them all

We use [1Password](https://1password.com) as the single source of truth for all secrets: passwords, API keys, tokens, and environment files. The developer tooling integrates 1Password directly into your local workflow so you never need to copy-paste secrets into a file.

Each project has a **1Password Developer environment** named exactly after its repository. All secrets for that project live there.

## Install

### 1. 1Password app

Install the [1Password desktop app](https://1password.com/downloads/) and sign in to the team account. The CLI depends on the desktop app being running and unlocked.

### 2. 1Password CLI (`op`)

```bash
brew install 1password-cli
```

Verify:

```bash
op --version
```

Then connect the CLI to the desktop app by enabling **Connect with 1Password app** in *Settings → Developer* inside the 1Password app.

### 3. VS Code extension (optional)

The [1Password VS Code extension](https://marketplace.visualstudio.com/items?itemName=1Password.op-vscode) lets you reference secrets directly in editor configs without materializing them to disk.

### 4. Get added to environments

Ask an admin or team lead to add you to the relevant 1Password vaults. You won't be able to pull secrets for a project until you have vault access.

## How to use

Never create a `.env` file by hand. Pull secrets from 1Password instead.

### Option A: Inject at runtime (preferred)

Wrap your dev command with `op run`. Secrets are injected as environment variables at process start and never written to disk:

```bash
op run --env-file=".env.template" -- npm run dev
```

### Option B: Materialize a local file

When a tool requires a real `.env` file on disk (some ORMs, Docker Compose, etc.):

```bash
op inject -i .env.template -o .env.local
```

Add `.env.local` (and any real `.env*` file) to `.gitignore`. Regenerate it from 1Password whenever secrets rotate rather than editing it manually.

### Adding a new secret

1. Add the secret to the 1Password Developer environment for the project.
2. Add the corresponding reference to `.env.template`, never the value.
3. Tell the team so everyone can re-pull.

## Public vs private environment variables

Not all environment variables are equal. Understanding the difference is important before writing any Next.js configuration.

### Private variables (server-side only)

A variable without the `NEXT_PUBLIC_` prefix is only available on the server. Next.js never includes it in the JavaScript bundle sent to the browser. It exists at build time and runtime on the server, and nowhere else.

```env
DATABASE_URL=postgres://...
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG...
```

These are the variables that must be kept in 1Password. They never reach the user's device.

### Public variables (exposed to the browser)

A variable prefixed with `NEXT_PUBLIC_` is embedded directly into the JavaScript bundle at build time. Every user who loads the page can read it. It appears in the compiled JS files, in browser DevTools, and in any cached or CDN-distributed copy of the build.

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXX
NEXT_PUBLIC_API_URL=https://api.example.com
```

There is no mechanism to hide a `NEXT_PUBLIC_` variable after it has been bundled. The name is a contract: you are explicitly declaring that this value is public.

### Why `NEXT_PUBLIC_` requires caution

The risk is accidentally exposing a secret by giving it the wrong prefix.

A common mistake is seeing that a variable "doesn't work" on the client and adding `NEXT_PUBLIC_` to fix it, without considering whether that variable should ever reach the client at all.

Before adding `NEXT_PUBLIC_` to any variable, ask:

- Would it be acceptable for any user, anywhere, to read this value from the browser source?
- If this value were posted publicly, would it cause a security or cost issue?

If the answer to either question is no, the variable must stay server-side. The correct fix is to expose the data through a server-side API route, not to move the secret to the client.

### What belongs in each category

| Use `NEXT_PUBLIC_` | Keep server-side only |
| --- | --- |
| Analytics tracking IDs | Database credentials |
| Public API base URLs | Secret API keys (Stripe, SendGrid, etc.) |
| Stripe publishable key | Auth secrets and signing keys |
| Feature flag client keys | Internal service URLs |
| CDN or asset base URLs | Webhook secrets |

When in doubt, keep the variable private and expose only what the client needs through an API route.

## Incident process

If a secret is leaked (committed to git, pasted in chat, included in a log), treat it as compromised regardless of whether anyone saw it.

1. **Rotate immediately.** Revoke the exposed credential and generate a new one in the relevant service. Do not wait to assess impact first.
2. **Update 1Password.** Replace the old value in the project's Developer environment.
3. **Scrub history if possible.** Use `git filter-repo` or ask GitHub Support to remove it from the repo history, then force-push.
4. **Notify the team.** Let the team know which secret was affected so everyone re-pulls from 1Password.
5. **Review access logs.** Check the affected service for unauthorized activity during the exposure window.

The key principle: assume the worst and rotate fast. A few minutes of downtime from a key rotation is far cheaper than a breach.

## Related

- [Security guidelines](security-guidelines.md)
- [Code security scanning](code-security-scanning.md)
- [Code standards](../development/code-standards.md)
- [CI/CD](../delivery/ci-cd.md)
