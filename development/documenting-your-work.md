# Documenting your work

This document tells you what to do about documentation, and when. [Documentation standards](../agents/documentation-standards.md) defines what documentation has to exist and why it is structured the way it is. This document is the part you do, during the work, in the pull request in front of you.

It also says which Claude Code skill to reach for at each point, so you are not writing project documentation from memory when a skill already knows our conventions.

## The rule underneath everything else

Documentation changes in the same pull request as the change that made it wrong.

There is no second pass. A documentation task carried to the end of a sprint is written from memory, and by then the memory has gaps in the places that mattered. If your pull request changes how the system behaves, how it is set up, how it deploys, or how it is supported, then `/docs` and `README.md` change in that same pull request. A reviewer treats a missing documentation update the same way as a missing test: not done yet.

## When to document what

Find the moment you are in. The skill column is the one to invoke, not a suggestion to read it:

| When this happens | Write | Where | Skill |
| --- | --- | --- | --- |
| You clone a new project from a boilerplate | The README and the full `/docs` set | Repository root and `/docs` | `project-readme`, then `project-docs` |
| You join a project and the docs are missing or stale | An audit first, then the fixes | `/docs` | `project-docs` |
| You add or rename an environment variable | The variable, what it is for, and where its value comes from | `setup.md`, `deployment.md`, and `.env.template` | `project-docs` |
| You add or change an integration | What the service does, how it is configured, what breaks when it is down | `integrations.md` | `project-docs` |
| You change the build, the deploy trigger, or rollback | The new flow, and any migration constraint on rolling back | `deployment.md` | `project-docs` |
| You change local setup or a script | The command a new developer actually runs | `README.md` and `setup.md` | `project-readme`, `project-docs` |
| You change the structure of the code | The architecture description and its diagram | `architecture.md` | `project-docs` |
| You make a decision someone will later question | An architecture decision record | `docs/decisions/` | `project-docs` |
| You deviate from a global standard | The exception and its reason | `overrides.md`, plus a decision record | `project-docs` |
| You fix something operational that will recur | The steps, written so someone else can follow them under pressure | `runbooks.md` | `project-docs` |
| You resolve an incident | The postmortem | `/docs`, per [Incident response](../delivery/incident-response.md) | `project-docs` |
| You answer the same question twice | The answer, then send the link instead of the answer | Wherever it belongs | `project-docs` |
| You find a global standard is wrong | A pull request against this handbook | `Dotfusion/engineering-docs` | See [Contributing](../CONTRIBUTING.md) |

The last row matters more than its position suggests. When you work around a global standard twice, the standard is the defect. Fixing it in this handbook fixes it for every project at once, which is the whole reason the handbook exists.

## How to use the skills

A skill does the work, and you are accountable for the result. The loop is always the same:

1. **Invoke it.** Either describe what you need in your own words, or call it directly: `/dotfusion-docs:project-docs`, `/dotfusion-docs:project-readme`. Both trigger on loose phrasing, so "the docs are stale" or "document this repo" reaches the right one.
2. **Answer its questions.** Both skills read the repository first and then ask only about what the code cannot tell them: business context, production URLs, who can deploy, business rules, known operational risks. Answer in one pass rather than letting the skill guess.
3. **Read what it wrote.** All of it. A skill derives from the code accurately and cannot know what you decided in a meeting. Every `Unknown:` and `To confirm:` it leaves is a question addressed to you.
4. **Verify the commands.** Run the setup steps it documented. A setup section nobody has executed is the most common stale documentation there is, and the one that costs a new developer their first day.
5. **Commit it with your change.**

Which skill owns what: `project-readme` owns the root `README.md`. `project-docs` owns everything under `/docs`, including decision records. They do not overlap, so a change to setup instructions usually needs both.

When you disagree with what a skill produced, and the disagreement is about our conventions rather than about this project, the skill is wrong and it should be fixed. See [Contributing](../CONTRIBUTING.md).

## Recording a decision

Write an architecture decision record when a decision changes how the system is built or operated and someone will later ask why. [Architecture Decision Records](../engineering/architecture-decision-records.md) covers when a decision qualifies, the naming convention, the status lifecycle, and the template. `project-docs` writes one for you when you say what you decided.

Two rules people get wrong:

- **Record the alternatives, not only the choice.** The value of a decision record is the answer to "why not the other option", because that is the question that comes back. A record with an empty alternatives section has documented the outcome and lost the reasoning.
- **A decision record is immutable once accepted.** When the decision changes, write a new record that supersedes the old one and update the old one's status. Do not edit history.

## How much is enough

The test is not length. The test is whether a developer who has never seen this project can do the thing without finding you.

Concretely, a project is documented well enough when someone else can set it up locally, deploy it, tell whether the deploy worked, roll it back, and find out why the architecture is the way it is. Anything beyond that is worth writing when a person actually needs it, not in advance.

## What not to document

Effort spent on the wrong documentation is the reason people stop trusting documentation at all:

- **Do not restate a global standard.** Link to it. A copied standard stops tracking the original the moment either one changes.
- **Do not narrate the code.** The code says what it does. Documentation says why, what it connects to, and what breaks.
- **Do not document a tool nobody uses.** An aspirational toolchain in `/docs` sends the next developer looking for something that does not exist.
- **Do not hide uncertainty.** Write `Unknown:` followed by what is not confirmed. An honest gap is useful, and a confident guess is a trap.

## Where this stops

This document covers the practice for every project. What goes in each file, and the shape of the `/docs` folder itself, is defined by [Documentation standards](../agents/documentation-standards.md) and by the `project-docs` skill, which scaffolds from `Dotfusion/template-project`. Anything true of only one project belongs in that project's own `/docs`.

## Related

- [Documentation standards](../agents/documentation-standards.md)
- [AGENTS.md](../agents/AGENTS.md)
- [Development workflow](development-workflow.md)
- [Architecture Decision Records](../engineering/architecture-decision-records.md)
- [Boilerplates and templates](../engineering/boilerplates-and-templates.md)
- [Team working model](../process/team-working-model.md)
- [Claude Code plugins setup](../agents/PLUGIN-SETUP.md)
