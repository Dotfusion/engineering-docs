---
name: finish-the-install-storyblok
description: Finish setting up a project cloned from the Dotfusion Next.js and Storyblok boilerplate. Use when the developer says "let's finish the install", "finish the setup", "set up this project", or right after cloning the template. Configures the Storyblok region, tokens, secrets, brand colors, fonts, and site metadata, then verifies the install.
---

# Finish the install (Storyblok)

This skill completes the per-project setup of a repository cloned from the Dotfusion Next.js and Storyblok boilerplate. Work through the steps in order. Ask the developer for the values you need in one batched set of questions before changing files. Never commit secrets, and never overwrite a value the developer did not ask you to change.

## Step 1: Confirm the project

Check that this is the boilerplate before doing anything: `package.json` name is `boilerplate-nextjs-storyblok` (or a renamed fork of it) and an `.env.sample` exists at the root. If it does not look like the boilerplate, stop and tell the developer. If `package.json` name is `boilerplate-nextjs-agilitycms`, invoke `finish-the-install-agility` instead.

## Step 2: Collect the values

Read `.env.sample` so you know the exact variable names, then ask the developer for, in one message:

- The Storyblok API region: `us` or `eu`.
- The Storyblok server preview token and public token (from the Storyblok dashboard under Settings then Access Tokens).
- The Storyblok preview secret and webhook secret. Tell the developer to generate random strings; the same values get pasted back into the Storyblok space's preview URL and webhook config later.
- The public site URL (for example `https://www.example.com`).
- The brand colors as hex values: primary, secondary, accent, background, foreground, and muted. Tell the developer they can skip any and keep the default.
- The fonts: either Google Font family names or custom font files they will provide.
- The site name and the default meta description.

## Step 3: Write the local environment file

Create `.env.local` from `.env.sample` with the values from Step 2. Do not commit it: it is already in `.gitignore`. Leave any value the developer skipped as the placeholder and tell them it still needs a real value. Set `NEXT_PUBLIC_STORYBLOK_IS_PREVIEW=true` for local development.

## Step 4: Install dependencies

Run `nvm use` to select the pinned Node version, then `npm install`. Do not pass `--force` or `--legacy-peer-deps`. If the install reports a peer conflict, stop and report it rather than working around it. A handful of `EBADENGINE` warnings on `lint-staged` are harmless if Node is older than the pinned `.nvmrc`; advise the developer to `nvm install` the exact version.

## Step 5: Set the brand colors

Update the color values in `src/styles/abstracts/_tokens.scss`. Change only the values the developer provided. The CSS custom properties in `src/styles/base/_root.scss` read from these tokens, so you do not edit them directly unless the developer wants a runtime override.

## Step 6: Wire the fonts

For Google Fonts, import the family with `next/font/google` in `src/app/layout.tsx`, apply its CSS variable on the `<html>` or `<body>` element, and point `--font-family-base` and `--font-family-heading` at that variable. For custom font files, place them under `public/fonts`, add the `@font-face` rules to `src/styles/base/_fonts.scss`, and update the font-family tokens in `src/styles/abstracts/_tokens.scss`. Keep the token and the applied font in sync.

## Step 7: Set the site metadata

In `src/app/layout.tsx`, set the site name and default description in the `metadata` export. Confirm `NEXT_PUBLIC_SITE_URL` in `.env.local` matches the production URL so canonical links, the sitemap, and JSON-LD resolve correctly.

## Step 8: Note the Storyblok MCP server

The Storyblok MCP server is already configured in `.mcp.json` and `.vscode/mcp.json` at `https://mcp.labs.storyblok.com/`. Tell the developer:

- On first use their editor will prompt them to authorize it.
- The server is in "Innovation phase" at the time of writing, so the surface may change.
- It is a content-modeling aid, separate from the runtime `@storyblok/react` SDK that serves the site.

## Step 9: Set up the Storyblok space

Tell the developer that for the site chrome to render real content, four global stories need to exist in their Storyblok space, one per content type:

- `global/site-settings` (content type `site-settings`): siteName, defaultDescription, logo.
- `global/primary-navigation` (content type `primary-navigation`): links list (label, url, openInNewTab).
- `global/footer-navigation` (content type `footer-navigation`): links list (label, url, openInNewTab).
- `global/social-links` (content type `social-links`): links list (platform, url).

The site runs without them (the chrome falls back to safe empty values) but cannot render real navigation until they exist. See `docs/architecture.md` shared-content contract for the field shapes.

Also tell the developer to set the space's Visual Editor preview URL to `http://localhost:3000/api/preview?secret=<STORYBLOK_PREVIEW_SECRET>&slug=`. Storyblok appends the slug per story.

## Step 10: Verify

Run, in order, and fix anything that fails before reporting success:

- `npm run typecheck`
- `npm run lint`
- `npm run lint:styles`
- `npm run format:check`
- `npm test`

If the Storyblok values are real and at least one story exists in the space, also run `npm run build` to confirm the site builds against the space.

## Step 11: Report and hand off

Summarize what changed and list the remaining manual steps:

- Connect the repository to Vercel.
- Add the Storyblok environment variables as Vercel secrets (production and preview). Set `NEXT_PUBLIC_STORYBLOK_IS_PREVIEW` to `false` on production and `true` on preview.
- After the first production deploy, add the Storyblok webhook at `https://<your-domain>/api/revalidate?secret=<STORYBLOK_WEBHOOK_SECRET>` (Storyblok dashboard, Settings then Webhooks), enabling story published, unpublished, deleted, and moved.
- Add the same variables as GitHub repository secrets and set the `RUN_E2E` repository variable to `true` to enable the end-to-end and Lighthouse jobs.
- Run `npm run dev` to start working. The Visual Editor in the Storyblok dashboard renders the local site live.
