---
name: writing-guidelines
description: Review docs/prose for Writing Guidelines compliance. Use when asked to "review my docs", "check writing style", "audit prose", "review docs voice and tone", or "check this page against the writing handbook".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Writing Guidelines

Review files for compliance with Writing Guidelines.

## How It Works

1. Read the specified files (or prompt user for files/pattern)
2. Check against all rules in `command.md` (co-located with this skill)
3. Output findings in the terse `file:line` format

## Usage

When a user provides a file or pattern argument:
1. Read the rules from `command.md` in this skill's directory
2. Read the specified files
3. Apply all rules from `command.md`
4. Output findings using the format specified there

If no files specified, ask the user which files to review.