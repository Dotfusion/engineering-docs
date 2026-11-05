# Contributing

This repository holds the standards every Dotfusion project follows. A change here changes how the whole team works, and the `dotfusion-docs` plugin carries it into every developer's editor the next time Claude Code starts. So changes go through a pull request and a review, for the same reason we require that of project code.

## Who this is for

**Dotfusion developers.** You have write access. Open a pull request rather than pushing to `main`.

**Everyone else.** Corrections are welcome. [Open an issue](https://github.com/Dotfusion/engineering-docs/issues/new/choose) rather than a pull request, so we can talk about it first. For anything commercial, or to report a security concern privately, reach us through [dotfusion.com](https://www.dotfusion.com) instead of a public issue.

## Does your change belong here?

This repository holds global standards: the way we work across every project. It is the wrong place for anything that applies to one project.

| Your change | Where it belongs |
| --- | --- |
| A standard that should apply to every project | Here |
| A correction, clarification, or broken link | Here |
| How one project works, or an exception it needs | That project's repository, under `/docs` |
| A decision affecting one project's architecture | That project's `/docs/decisions/`, as an architecture decision record |
| Anything client-specific, private, or secret | Not here, ever. See [what never goes in this repository](README.md#what-never-goes-in-this-repository) |

Recording an exception in a project's `/docs` is the normal outcome, not a sign that the global standard should have changed. Change the standard once the same exception has come up on several projects, because at that point it is the standard that is wrong.

## Making a change

1. **Open an issue first for anything substantive.** A new standard, or a change to an existing one, is worth discussing before it is written. Use [Propose a change to a standard](https://github.com/Dotfusion/engineering-docs/issues/new/choose). A typo or a broken link needs no issue.
2. **Branch from `main`.** Use the naming convention in [Development workflow](development/development-workflow.md).
3. **Write to the standard.** [AGENTS.md](ai/AGENTS.md) is the canonical writing standard and wins over any other style guidance, including the `writing-guidelines` skill. The rules the linter rejects most often: sentence case headings, no em dash, straight quotes, American spelling, a language tag on every code block, and no use of "easy", "simple", or "quick" to describe an action. <!-- lint-ignore -->
4. **Run the checks locally.** `node scripts/lint-docs.mjs` enforces the mechanical rules and verifies every internal link and anchor. It runs on every pull request, so running it first saves a round trip.
5. **Run the writing skill.** `/dotfusion-docs:writing-guidelines` on the files you changed catches what the linter cannot: passive voice, vague qualifiers, paragraphs covering two ideas.
6. **Update the skill in the same pull request.** A standard and the skill that encodes it change together. If you change a rule that [`engineering-standards`](ai/skills/engineering-standards/) states, or a convention that [`project-readme`](ai/skills/project-readme/) or [`project-docs`](ai/skills/project-docs/) bakes in, change both. A skill that contradicts a standard is worse than no skill, because developers trust it.
7. **Open the pull request** and fill in the template. Say what changed, why, and which skills it affects.

## What a reviewer checks

- **Is it true?** Do not describe a tool we do not use or a process we do not follow. Aspiration belongs in an issue, not in a standard. Mark anything unconfirmed as `Unknown:` or `To confirm` rather than guessing.
- **Is it global?** Would this be right for every project, or is it one project's reality?
- **Is it safe to publish?** Nothing client-specific, private, or secret. The automated check cannot catch this, so the reviewer has to.
- **Does it fit the shape?** Purpose, then the standard, then the global and project boundary, then a `Related` section. See [How our documentation is organized](README.md#how-our-documentation-is-organized).
- **Does it duplicate something?** Reference the neighboring document instead of restating it. Duplicated standards drift apart.
- **Do the skills still match it?** A skill that states a rule this pull request changed has to change too.

## Writing a new document

Before adding one, check whether it belongs as a section in an existing document. A reader navigates a handbook of complete documents more readily than one of fragments, and a fragment is likelier to be missed when a related standard changes.

A new document needs, at minimum:

- a one-paragraph statement of what it covers, at the top
- the standard, described concretely enough to act on
- a statement of what belongs in project documentation instead
- a `Related` section
- an entry in the [handbook index](README.md#the-handbook), and in [SUMMARY.md](SUMMARY.md) so GitBook picks it up
- a route in [start-here.md](start-here.md), if a reader would arrive looking for it

## Changing a skill

Skills live in [`ai/skills/`](ai/skills/) and are the executable form of these standards. To iterate without publishing, point Claude Code at your local checkout:

```text
claude --plugin-dir /path/to/engineering-docs
```

Edit the `SKILL.md`, run `/reload-plugins`, and confirm the skill triggers on the phrasing a developer would use. See [Claude Code plugins setup](ai/PLUGIN-SETUP.md).

Four skills under `ai/skills/` are third-party work vendored under their own licenses, listed in [LICENSE](LICENSE): `playwright-best-practices`, `react-best-practices`, `accessibility`, and `writing-guidelines`. Avoid editing those in place, because pulling a later version from upstream would overwrite the change. Where our conventions differ from a vendored skill, state the difference in one of our own documents and let ours win, which is what [AGENTS.md](ai/AGENTS.md) already does for `writing-guidelines`.

## After merging

Every commit to `main` counts as a new plugin version, so each developer picks the change up the next time Claude Code starts. Add a line to [CHANGELOG.md](CHANGELOG.md) for anything a developer would want to know changed. A typo fix does not need one. A changed rule does.

## Related

- [AGENTS.md](ai/AGENTS.md)
- [Documentation standards](ai/documentation-standards.md)
- [Development workflow](development/development-workflow.md)
- [Claude Code plugins setup](ai/PLUGIN-SETUP.md)
