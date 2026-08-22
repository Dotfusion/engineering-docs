---
name: finish-the-install-agility
description: Finish setting up an AgilityCMS project cloned from the Dotfusion Next.js and AgilityCMS boilerplate (package name boilerplate-nextjs-agilitycms). Use when the developer says "let's finish the install", "finish the setup", "set up this project", or right after cloning the template, AND the repository uses AgilityCMS. Check package.json first: for boilerplate-nextjs-storyblok use finish-the-install-storyblok instead. Sets up secrets in 1Password, then the Agility region and locale, brand colors, fonts, and site metadata, then verifies the install and the pipeline.
---

# Finish the install (AgilityCMS)

This skill completes the per-project setup of a repository cloned from the Dotfusion Next.js and AgilityCMS boilerplate. Work through the steps in order. Ask the developer for the non-secret values you need in one batched set of questions before changing files. Never overwrite a value the developer did not ask you to change.

This skill never receives a secret value. The developer puts values into 1Password and this skill materializes the local file from the committed template with `op inject`. Asking a developer to paste an API key into chat is forbidden by [How to manage .env files](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md): chat is logged and is not access-controlled like a secrets manager.

## Step 1: Confirm the project

Check that this is the boilerplate before doing anything: `package.json` name is `boilerplate-nextjs-agilitycms` (or a renamed fork of it) and an `.env.sample` exists at the root. If it does not look like the boilerplate, stop and tell the developer. If `package.json` name is `boilerplate-nextjs-storyblok`, invoke `finish-the-install-storyblok` instead.

## Step 2: Set up the secrets in 1Password

Read `.env.sample` so you know the exact variable names. Then tell the developer to do the following, and wait for them to confirm. Do not ask them to send you any of these values.

1. Create a 1Password Developer environment named exactly after the repository, if one does not exist.
2. Add an item for each secret variable in `.env.sample`. For AgilityCMS that is the instance GUID, the live fetch API key, the preview API key, and the security key, all found in the Agility dashboard under Settings then API Keys.
3. Confirm `op` is installed and signed in: `op --version` and `op whoami` both succeed.

Then replace each secret line in `.env.sample` with a 1Password secret reference (`op://<vault>/<item>/<field>`) and commit it. `.env.sample` is the committed contract: names and references, never values.

## Step 3: Collect the non-secret values

Ask the developer for these in one message. None is a secret, so all are safe to discuss:

- The default locale (for example `en-us`) and the sitemap channel reference name (for example `website`).
- The public site URL (for example `https://www.example.com`).
- The brand colors as hex values: primary, secondary, accent, background, foreground, and muted. Tell the developer they can skip any and keep the default.
- The fonts: either Google Font family names or custom font files they will provide.
- The site name and the default meta description.

## Step 4: Materialize the local environment file

Generate `.env.local` from the committed template rather than writing values by hand:

```bash
op inject -i .env.sample -o .env.local
```

Confirm `.env.local` is in `.gitignore`. Never commit it, never print its contents, and never read it back. If the developer prefers not to keep secrets on disk at all, they can skip this file and wrap the dev command instead:

```bash
op run --env-file=".env.sample" -- npm run dev
```

If `op inject` reports an unresolved reference, a secret is missing from the 1Password environment. Report which one and stop. Do not fill it in from another source.

## Step 5: Install dependencies

Run `npm install`. Do not pass `--force` or `--legacy-peer-deps`. If the install reports a peer conflict, stop and report it rather than working around it.

## Step 6: Set the brand colors

Update the color values in `src/styles/abstracts/_tokens.scss`. Change only the values the developer provided. The CSS custom properties in `src/styles/base/_root.scss` read from these tokens, so you do not edit them directly unless the developer wants a runtime override.

## Step 7: Wire the fonts

For Google Fonts, import the family with `next/font/google` in `src/app/layout.tsx`, apply its CSS variable on the `<html>` or `<body>` element, and point `--font-family-base` and `--font-family-heading` at that variable. For custom font files, place them under `public/fonts`, add the `@font-face` rules to `src/styles/base/_fonts.scss`, and update the font-family tokens in `src/styles/abstracts/_tokens.scss`. Keep the token and the applied font in sync.

## Step 8: Set the site metadata

In `src/app/layout.tsx`, set the site name and default description in the `metadata` export. Confirm `NEXT_PUBLIC_SITE_URL` in `.env.local` matches the production URL so canonical links, the sitemap, and JSON-LD resolve correctly.

## Step 9: Note the AgilityCMS MCP server

The Agility MCP server is already configured in `.mcp.json` and `.vscode/mcp.json`. Tell the developer that on first use their editor will prompt them to authorize it through OAuth, and that it is a content-modeling aid separate from the runtime SDK.

## Step 10: Verify

Run, in order, and fix anything that fails before reporting success:

- `npm run typecheck`
- `npm run lint`
- `npm run lint:styles`
- `npm test`

If the Agility values resolve from 1Password, also run `npm run build` to confirm the site builds against the instance.

Then confirm the pipeline matches [CI/CD](https://github.com/Dotfusion/engineering-docs/blob/main/delivery/ci-cd.md), which requires end-to-end tests and Semgrep on every pull request:

- Set the `RUN_E2E` repository variable to `true`. It gates the end-to-end and Lighthouse jobs, and a project that merges without them does not meet the delivery standard. This is part of the install, not an optional extra.
- Confirm the Semgrep job runs on a pull request.
- Set the required checks as branch-protection rules before the first feature branch exists. Adding them to a repository with open pull requests is more disruptive than adding them now.

## Step 11: Report and hand off

Summarize what changed, then list the remaining manual steps:

- Connect the repository to Vercel.
- Add the Agility environment variables to Vercel and to GitHub repository secrets, taking each value from 1Password. Do not send them through chat.
- Scaffold the documentation: run `project-readme` for the root `README.md`, then `project-docs` for `/docs`. A project is not set up until it is documented.
- Run `op run --env-file=".env.sample" -- npm run dev` to start working.

Name every variable you left unresolved, and every value the developer still has to add to 1Password.

## Related

- [Boilerplates and templates](https://github.com/Dotfusion/engineering-docs/blob/main/engineering/boilerplates-and-templates.md)
- [How to manage .env files](https://github.com/Dotfusion/engineering-docs/blob/main/security/how-to-manage-env.md)
- [CI/CD](https://github.com/Dotfusion/engineering-docs/blob/main/delivery/ci-cd.md)
- `project-readme` and `project-docs`, which scaffold the documentation after this skill finishes
- `finish-the-install-storyblok` for a Storyblok project
