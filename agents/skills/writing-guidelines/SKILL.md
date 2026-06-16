---
name: writing-guidelines
description: Review docs/prose for Dotfusion writing guidelines compliance. Use when asked to "review my docs", "check writing style", "audit prose", "review docs voice and tone", or "check this page against the writing handbook". Applies the Vercel writing checklist layered on top of the repository's canonical standard in agents/AGENTS.md, which wins on any conflict.
metadata:
  author: vercel (adapted by Dotfusion)
  version: "1.1.0"
  argument-hint: <file-or-pattern>
---

# Writing Guidelines

Review files for compliance with Writing Guidelines.

## How It Works

1. Read the specified files (or prompt user for files/pattern)
2. Read `agents/AGENTS.md` for the repository's canonical writing standard, which overrides any conflicting rule
3. Check against the rules in `command.md` (co-located with this skill), honoring the "Repository context" deferrals at the top
4. Output findings in the terse `file:line` format

## Usage

When a user provides a file or pattern argument:
1. Read the rules from `command.md` in this skill's directory
2. Read the specified files
3. Apply all rules from `command.md`
4. Output findings using the format specified there

If no files specified, ask the user which files to review.