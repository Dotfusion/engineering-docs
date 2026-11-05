---
name: finish-the-install-agility
description: Finish setting up an AgilityCMS project cloned from the Dotfusion Next.js and AgilityCMS boilerplate (package name boilerplate-nextjs-agilitycms, or a project already renamed from it). Use when the developer says "let's finish the install", "finish the setup", "set up this project", or right after cloning the template, AND the repository uses AgilityCMS. Check package.json first, and for boilerplate-nextjs-storyblok use finish-the-install-storyblok instead. Renames the project, sets up secrets in 1Password, then the Agility locale and sitemap, brand colors, fonts, site metadata, and the Agility content model, hands the template docs over to the project, then verifies the install and the pipeline.
---

# Finish the install (AgilityCMS)

This skill completes the per-project setup of a repository cloned from the Dotfusion Next.js and AgilityCMS boilerplate. Work through the steps in order. Ask the developer for the non-secret values you need in one batched set of questions before changing files. Never overwrite a value the developer did not ask you to change.

This skill never receives a secret value. The developer puts values into 1Password and this skill materializes the local file from the committed template with `op inject`. Asking a developer to paste an API key into chat is forbidden by [How to manage .env files](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md): chat is logged and is not access-controlled like a secrets manager.

1Password is the only source of secret values. This skill does not push secrets to GitHub, Vercel, or any other service. The developer copies each value from 1Password into those services, and the hand-off in Step 13 lists exactly which ones.

## Step 1: Confirm the project

Check that this is the boilerplate, or a project already renamed from it, before doing anything. All of these must be true:

- `package.json` lists `@agility/nextjs` as a dependency
- `src/components/agility/template-registry.ts` exists
- `.env.sample` exists at the root

Do not rely on the `package.json` name alone. Step 4 renames the package, so a second run of this skill would fail that check. If the repository does not match, stop and tell the developer. If `package.json` name is `boilerplate-nextjs-storyblok`, or it depends on `@storyblok/react` rather than `@agility/nextjs`, invoke `finish-the-install-storyblok` instead.

If the package is already renamed, this is a second run. Skip the steps whose result is already in place, and confirm with the developer before changing anything a previous run set.

## Step 2: Set up the secrets in 1Password

Read `.env.sample` so you know the exact variable names. Then tell the developer to do the following, and wait for them to confirm. Do not ask them to send you any of these values.

1. Create a 1Password Developer environment named exactly after the repository, if one does not exist.
2. Add an item for each secret: `AGILITY_GUID`, `AGILITY_API_FETCH_KEY`, `AGILITY_API_PREVIEW_KEY`, and `AGILITY_SECURITY_KEY`. All four are in the Agility dashboard under Settings then API Keys.
3. Confirm the 1Password CLI reaches the vault: `op --version` succeeds and `op vault list` shows the project's vault. Do not use `op whoami` as the check. It can report "account is not signed in" while `op vault list` works.

The fifth secret, `AGILITY_WEBHOOK_SECRET`, does not exist yet. Agility generates it when you create the revalidation webhook, and the webhook needs a deployed URL, so it is part of the hand-off in Step 13. Nothing breaks without it: the revalidate route rejects every call with 401, and the signed end-to-end tests skip themselves when it is unset.

## Step 3: Collect the non-secret values

Ask the developer for these in one message. None is a secret, so all are safe to discuss:

- The project name, used as the package name (usually the repository name), and a one-line description.
- The default locale (for example `en-us`) and the sitemap channel reference name (for example `website`).
- The public site URL (for example `https://www.example.com`).
- The brand colors as hex values: primary, secondary, accent, background, foreground, and muted. Tell the developer they can skip any and keep the default.
- The fonts: either Google Font family names or custom font files they will provide.
- The site name and the default meta description.

## Step 4: Rename the project

Set `name` and `description` in `package.json` to the values from Step 3. Then set the same `name` in `package-lock.json`, in both places it appears: the top-level `name` and `packages[""].name`. Edit those two fields by hand. Do not regenerate the lockfile to rename it, because a regenerated lockfile changes resolved versions as well as the name.

## Step 5: Write the environment template and the local file

`.env.sample` is the committed contract: variable names, 1Password references for secrets, and plain values for everything else. Edit it as follows:

- Replace each secret line from Step 2 with its 1Password secret reference (`op://<vault>/<item>/<field>`).
- Set `AGILITY_LOCALES`, `AGILITY_SITEMAP`, and `NEXT_PUBLIC_SITE_URL` to the values from Step 3. They are not secrets, so they live in the file as plain text. `NEXT_PUBLIC_SITE_URL` is embedded in the browser bundle because of its `NEXT_PUBLIC_` prefix, which is correct for a public site URL.
- Keep `AGILITY_FETCH_CACHE_DURATION=3600`. The revalidation webhook clears changed content right away, so this is only a fallback for a missed webhook. See ADR 0002 in `docs/decisions/`.
- Set `AGILITY_WEBHOOK_SECRET=` to an empty value until Step 13 adds its reference. A reference to an item that does not exist yet makes `op inject` fail.
- Replace the header comment that says to copy the file and fill in the values. The values now come from 1Password through `op inject` or `op run`.

Then generate `.env.local` from the template rather than writing values by hand:

```bash
op inject -i .env.sample -o .env.local
```

Confirm `.env.local` is in `.gitignore`. Never commit it, never print its contents, and never read it back. If the developer prefers not to keep secrets on disk at all, they can skip this file and wrap the dev command instead:

```bash
op run --env-file=".env.sample" -- npm run dev
```

If `op inject` reports an unresolved reference, a secret is missing from the 1Password environment. Report which one and stop. Do not fill it in from another source.

## Step 6: Install dependencies

Run `nvm use` to select the Node version pinned in `.nvmrc`, then `npm ci`. Use `npm ci`, not `npm install`. CI installs with `npm ci`, which fails when `package-lock.json` and `package.json` disagree, and `npm install` rewrites the lockfile, which is how a project ends up with lockfile-sync commits after its first pull request.

Do not pass `--force` or `--legacy-peer-deps`. If the install reports a peer conflict or an out-of-sync lockfile, stop and report it rather than working around it.

## Step 7: Set the brand colors

Update the color values in `src/styles/abstracts/_tokens.scss`. Change only the values the developer provided. The CSS custom properties in `src/styles/base/_root.scss` read from these tokens, so you do not edit them directly unless the developer wants a runtime override.

## Step 8: Wire the fonts

For Google Fonts, import the family with `next/font/google` in `src/app/layout.tsx`, apply its CSS variable on the `<html>` or `<body>` element, and point `--font-family-base` and `--font-family-heading` at that variable. For custom font files, place them under `public/fonts`, add the `@font-face` rules to `src/styles/base/_fonts.scss`, and update the font-family tokens in `src/styles/abstracts/_tokens.scss`. Keep the token and the applied font in sync.

## Step 9: Set the site metadata

The site name and default description live in two places, and they must match:

- **Agility.** The `siteSettings` item holds `siteName` and `defaultDescription`. The header, the footer, and `llms.txt` read them at runtime. Step 10 creates or updates this item.
- **The fallback in code.** `src/app/layout.tsx` exports a static `metadata` object that still carries the boilerplate's title and description. Each page replaces it with the Agility page title and SEO description, so the layout values show only where a page has none. Replace them with the site name and default description from Step 3.

Confirm `NEXT_PUBLIC_SITE_URL` in `.env.sample` matches the production URL so canonical links, the sitemap, and JSON-LD resolve correctly.

## Step 10: Set up the Agility instance

The code expects a content model in Agility. The site runs without it, because global data falls back to empty values, but it renders no real header, footer, or pages until the model exists.

Check the instance through the Agility MCP server, which is configured in `.mcp.json` and `.vscode/mcp.json`. On first use the editor prompts the developer to authorize it through OAuth. It is a content-modeling aid, separate from the runtime SDK that serves the site. Read first and report what is missing. Create something only with the developer's approval for each write. If the MCP server cannot create an item, or the developer has not authorized it, list what is missing for the developer to create in the dashboard.

The code expects:

| What               | Reference name             | Fields or contents                                                                           |
| ------------------ | -------------------------- | -------------------------------------------------------------------------------------------- |
| Page template      | `MainTemplate`             | One content zone, `main-content-zone`                                                        |
| Module             | `RichTextArea`             | `textblob` (HTML)                                                                            |
| Header item        | `globalHeader`             | `logo` (image), `navigation` (linked list of `headerNavLinks`)                               |
| Footer item        | `globalFooter`             | `navigation` (linked list of `footerNavLinks`), `socialLinks` (linked list of `socialLinks`) |
| Site settings item | `siteSettings`             | `siteName`, `defaultDescription`, set to the values from Step 3                              |
| Sitemap channel    | The `AGILITY_SITEMAP` name | A published home page at `/` on `MainTemplate`                                               |

Each navigation list item has one Link field, `link`. Each social links item has `platform` (text) and `link` (Link). The source of truth is `src/types/agility-global.ts` and the global data contract in `docs/architecture.md`. If they disagree with this table, the code wins.

The home page needs a `RichTextArea` in `main-content-zone` whose text includes a level-one heading. The page renderer does not output one, and the end-to-end home test fails without it.

Once the linked lists exist, read the reference names Agility gave them. If they differ from the `lists` in `GLOBAL_DATA` in `src/types/agility-global.ts`, update the registry to match and tell the developer. A mismatch does not break rendering, but publishing a navigation item then fails to clear the header or footer cache. Replace the `Unknown:` note about list reference names in `docs/architecture.md` with what you found.

## Step 11: Hand the docs over to the project

The boilerplate ships documentation about itself. Some of it describes the template as a product and is wrong for a client project. The rest describes code the project inherits and stays true. Do not delete `/docs` wholesale: that loses the inherited decisions and the launch blockers in `overrides.md`. Sort the files instead:

- **Delete the template's own story.** Remove `docs/overview.md`, `docs/context.md`, and `docs/implementation-plan.md`. They explain why the template exists and how it was planned. Remove the implementation plan link from the `Related` section of `docs/decisions/0001-boilerplate-stack.md`, since its target is gone.
- **Reset the README.** Replace `README.md` with the project name as a heading and the description from Step 3. The boilerplate README is written for someone choosing a template, and `project-readme` keeps the parts of an existing README that look accurate, so it would carry that framing forward.
- **Keep the docs that describe inherited code.** `architecture.md`, `integrations.md`, `setup.md`, `deployment.md`, and `runbooks.md` stay. `project-docs` audits them and rewrites wording such as "this template".
- **Keep `overrides.md` and `decisions/`.** The overrides, including the observability gap that must close before launch, and the ADRs apply to the project until someone changes them.

Then run `project-readme` to write the README, and `project-docs` to scaffold `overview.md` and `context.md` from the team template and audit the rest. If the developer prefers to run them later, list both in the hand-off: until they run, the README holds only a heading.

## Step 12: Verify

Run, in order, and fix anything that fails before reporting success:

- `npm run typecheck`
- `npm run lint`
- `npm run lint:styles`
- `npm run format:check`
- `npm test`

These are the checks the `Code check` and `Unit tests` CI jobs run. If `format:check` fails, run `npm run format` and check again.

If the Agility values resolve from 1Password and the home page from Step 10 is published, also run `npm run build` to confirm the site builds against the instance.

Semgrep Static Application Security Testing (SAST) is optional today: setting it up, and its licensing past the free tier, are both a cost that needs the client's agreement first. See [Code security scanning](https://github.com/Dotfusion/engineering-docs/blob/main/security/code-security-scanning.md) if the client wants it set up.

## Step 13: Report and hand off

Summarize what changed. Then list the remaining manual steps in this order. Every value comes from 1Password and never goes through chat:

1. **Connect the repository to Vercel** and add every variable in `.env.sample` to the Preview and Production environments. Include `AGILITY_FETCH_CACHE_DURATION`: when it is unset the SDK falls back to 60 seconds.
2. **Add the GitHub repository secrets** the `e2e` and `lighthouse` jobs read: `AGILITY_GUID`, `AGILITY_API_FETCH_KEY`, `AGILITY_API_PREVIEW_KEY`, `AGILITY_SECURITY_KEY`, `AGILITY_LOCALES`, `AGILITY_SITEMAP`, and `NEXT_PUBLIC_SITE_URL`. The last three are not secret, but `ci.yml` reads them from `secrets`, so they go there too.
3. **Protect `main`** with the `Code check` and `Unit tests` jobs as required checks, before the first feature branch exists. Adding them to a repository with open pull requests is more disruptive than adding them now.
4. **Turn on end-to-end tests once the home page is published.** Set the `RUN_E2E` repository variable to `true`, then add the `E2E, accessibility, SEO` job to the required checks. [CI/CD](https://github.com/Dotfusion/engineering-docs/blob/main/delivery/ci-cd.md) requires end-to-end tests on every pull request, so this is part of the install, not an optional extra. Do it only after the home page exists: against an empty instance the home test fails on every pull request.
5. **Create the revalidation webhook after the first production deploy.** In Agility under Settings then Webhooks, set the URL to `https://<site>/api/revalidate`, enable Content Publish Events, tick Enable secure delivery, and save. Store the `whsec_` signing secret in 1Password. Replace the empty `AGILITY_WEBHOOK_SECRET=` line in `.env.sample` with its reference, regenerate `.env.local`, and add the value to both Vercel environments and to the GitHub repository secrets.
6. **Set the preview URL in Agility** to the site's base URL, the production URL or a Vercel preview deployment URL. See the preview section of `docs/integrations.md`.
7. **Document the project** if Step 11 left it for later: `project-readme`, then `project-docs`. A project is not set up until it is documented.
8. **Start working** with `op run --env-file=".env.sample" -- npm run dev`.

Name every variable you left unresolved, every value the developer still has to add to 1Password, and every content model item from Step 10 that does not exist yet.

## Related

- [Boilerplates and templates](https://github.com/Dotfusion/engineering-docs/blob/main/engineering/boilerplates-and-templates.md)
- [How to manage .env files](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md)
- [CI/CD](https://github.com/Dotfusion/engineering-docs/blob/main/delivery/ci-cd.md)
- `project-readme` and `project-docs`, which write the documentation in Step 11
- `finish-the-install-storyblok` for a Storyblok project
