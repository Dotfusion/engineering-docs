# Boilerplates and templates

This document explains how a new Dotfusion project starts: which repositories it is cloned from, what each one carries, and which skills finish the setup. It is the map for the question "I am starting a project, where do I begin?"

A boilerplate exists so that the decisions in this handbook arrive already made. A project cloned from one inherits our stack, our conventions, and our documentation structure, which means the first week goes to the client's problem instead of to a pipeline we have already built before.

## Where a project comes from

| Repository | Visibility | What it carries |
| --- | --- | --- |
| `Dotfusion/engineering-docs` | Public | The standards in this handbook, and the Claude Code skills that enforce them. This repository. |
| `Dotfusion/template-project` | Private | The canonical `/docs` template every project copies. |
| Next.js and AgilityCMS boilerplate | Private | A configured Next.js front end wired to AgilityCMS. |
| Next.js and Storyblok boilerplate | Private | A configured Next.js front end wired to Storyblok. |

The two front-end boilerplates match the two headless content management systems (CMS) we build on. Which one a project uses is a content and client decision rather than an engineering preference, and it is normally settled before engineering is involved.

To confirm: the repository names of the two front-end boilerplates, their access requirements, and whether any additional boilerplate is in active use.

## Starting a project

1. **Clone the boilerplate that matches the CMS.** Do not start from an empty Next.js install, and do not copy a previous client project. A previous project carries that client's decisions mixed in with our defaults, and separating them later costs more than starting clean.
2. **Finish the install with the matching skill.** `finish-the-install-agility` or `finish-the-install-storyblok` completes the per-project setup: environment variables, brand colors, fonts, and site metadata, then verifies the result. Both skills are written to ask for the values they need rather than guess, and to leave secrets in 1Password.
3. **Set up the secrets.** Create the project's 1Password Developer environment, named exactly after the repository, and populate it. See [How to manage .env files](../security/how-to-manage-env.md). The `.env.sample` in the boilerplate is the list of what the project needs.
4. **Scaffold the documentation.** Run the `project-docs` skill to create `/docs` from `template-project`, and `project-readme` to write the root `README.md` from the actual codebase. Both are described in [Documentation standards](../agents/documentation-standards.md).
5. **Wire the pipeline.** Confirm the checks in [CI/CD](../delivery/ci-cd.md) run on a pull request, and set them as required branch-protection rules before the first real branch exists. Adding required checks to a repository with open pull requests is more disruptive than adding them on day one.
6. **Record what is different.** Anything about this project that departs from a global standard goes in the project's `/docs` as an override, with its reason, at the moment the decision is made rather than at the end.

## Changing a boilerplate

A boilerplate is shared infrastructure, so a change to one applies to every project cloned from it afterward. Two rules follow:

- **Improve the boilerplate, not only the project.** When you solve something in a client project that every project will hit, the fix belongs upstream. A fix that stays in one repository is a fix the next developer has to work out again, and their version will differ from yours.
- **A change that encodes a standard is a change to the standard.** When a boilerplate starts doing something this handbook does not describe, either the handbook is out of date or the boilerplate is wrong. Reconcile the two rather than letting them drift, because the boilerplate is the version developers actually experience.

Existing projects do not automatically inherit a boilerplate change. Bringing an existing project up to a new default is deliberate work, prioritized like any other, and worth doing for changes that affect security, accessibility, or the pipeline.

## Why the boilerplates are private

The boilerplates and `template-project` are private because they carry configuration, integration details, and infrastructure assumptions specific to how we operate. This handbook is public because publishing a standard costs nothing. That is the same split described in [what never goes in this repository](../README.md#what-never-goes-in-this-repository).

## Related

- [Engineering principles](engineering-principles.md)
- [Documentation standards](../agents/documentation-standards.md)
- [Claude Code plugins setup](../agents/PLUGIN-SETUP.md)
- [How to manage .env files](../security/how-to-manage-env.md)
- [CI/CD](../delivery/ci-cd.md)
- [Glossary](glossary.md)
