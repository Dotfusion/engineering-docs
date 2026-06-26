---
name: finish-the-install-agility
description: Finish setting up a project cloned from the Dotfusion Next.js and AgilityCMS boilerplate. Use when the developer says "let's finish the install", "finish the setup", "set up this project", or right after cloning the template. Configures AgilityCMS environment variables, brand colors, fonts, and site metadata, then verifies the install.
---

# Finish the install (AgilityCMS)

This skill completes the per-project setup of a repository cloned from the Dotfusion Next.js and AgilityCMS boilerplate. Work through the steps in order. Ask the developer for the values you need in one batched set of questions before changing files. Never commit secrets, and never overwrite a value the developer did not ask you to change.

## Step 1: Confirm the project

Check that this is the boilerplate before doing anything: `package.json` name is `boilerplate-nextjs-agilitycms` (or a renamed fork of it) and an `.env.sample` exists at the root. If it does not look like the boilerplate, stop and tell the developer. If `package.json` name is `boilerplate-nextjs-storyblok`, invoke `finish-the-install-storyblok` instead.

## Step 2: Collect the values

Read `.env.sample` so you know the exact variable names, then ask the developer for, in one message:

- The AgilityCMS instance GUID, live fetch API key, preview API key, and security key (from the Agility dashboard under Settings then API Keys).
- The default locale (for example `en-us`) and the sitemap channel reference name (for example `website`).
- The public site URL (for example `https://www.example.com`).
- The brand colors as hex values: primary, secondary, accent, background, foreground, and muted. Tell the developer they can skip any and keep the default.
- The fonts: either Google Font family names or custom font files they will provide.
- The site name and the default meta description.

## Step 3: Write the local environment file

Create `.env.local` from `.env.sample` with the values from Step 2. Do not commit it: it is already in `.gitignore`. Leave any value the developer skipped as the placeholder and tell them it still needs a real value.

## Step 4: Install dependencies

Run `npm install`. Do not pass `--force` or `--legacy-peer-deps`. If the install reports a peer conflict, stop and report it rather than working around it.

## Step 5: Set the brand colors

Update the color values in `src/styles/abstracts/_tokens.scss`. Change only the values the developer provided. The CSS custom properties in `src/styles/base/_root.scss` read from these tokens, so you do not edit them directly unless the developer wants a runtime override.

## Step 6: Wire the fonts

For Google Fonts, import the family with `next/font/google` in `src/app/layout.tsx`, apply its CSS variable on the `<html>` or `<body>` element, and point `--font-family-base` and `--font-family-heading` at that variable. For custom font files, place them under `public/fonts`, add the `@font-face` rules to `src/styles/base/_fonts.scss`, and update the font-family tokens in `src/styles/abstracts/_tokens.scss`. Keep the token and the applied font in sync.

## Step 7: Set the site metadata

In `src/app/layout.tsx`, set the site name and default description in the `metadata` export. Confirm `NEXT_PUBLIC_SITE_URL` in `.env.local` matches the production URL so canonical links, the sitemap, and JSON-LD resolve correctly.

## Step 8: Note the AgilityCMS MCP server

The Agility MCP server is already configured in `.mcp.json` and `.vscode/mcp.json`. Tell the developer that on first use their editor will prompt them to authorize it through OAuth, and that it is a content-modeling aid separate from the runtime SDK.

## Step 9: Verify

Run, in order, and fix anything that fails before reporting success:

- `npm run typecheck`
- `npm run lint`
- `npm run lint:styles`
- `npm test`

If the Agility values are real, also run `npm run build` to confirm the site builds against the instance.

## Step 10: Report and hand off

Summarize what changed and list the remaining manual steps: connect the repository to Vercel, add the Agility environment variables as Vercel and GitHub secrets, set the `RUN_E2E` repository variable to `true` to enable the end-to-end and Lighthouse jobs, and run `npm run dev` to start working.
