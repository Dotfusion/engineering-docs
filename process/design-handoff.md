# Design handoff

This document defines what engineering needs from a design before build starts, and what design can expect from engineering in return. It exists because a gap agreed in a design review and discovered in a browser costs far more to close than the same gap raised at handoff.

Handoff is not a meeting where files change hands. It is the point at which a design becomes buildable, and the point at which a question still costs nothing to ask.

These are global defaults. The tools, file structure, and review cadence for a given project belong in that project's documentation.

To confirm: the design tool we standardize on, and whether any current project exports design tokens from design into code, or whether values are transcribed by hand.

## What engineering needs before build

A design is ready to build when a developer can answer these without asking. Anything missing is a question to raise at handoff, not an assumption to make in code.

- **Every state, not only the default.** Empty, loading, error, success, disabled, hover, and focus. A design covering only the populated happy path leaves a developer to invent the other seven, and an invented state is one nobody reviews.
- **Focus states, drawn.** The Web Content Accessibility Guidelines (WCAG) treat a visible focus indicator as a requirement, which makes it a design decision. An undesigned focus state gets either removed or left as the browser default, and both fail the accessibility checklist. See [Accessibility](../accessibility/accessibility.md).
- **Contrast that passes.** Text at 4.5:1, large text and meaningful non-text elements such as icons, borders, and focus indicators at 3:1. Check this in the design tool, where the fix is one value. After build, the same fix means reopening an approved palette.
- **Responsive intent, not only breakpoints.** What happens between the designed sizes: which elements reflow, which reorder, which drop. A design at 1440 and 375 CSS pixels with nothing in between leaves every tablet and small laptop to the developer's judgement.
- **Real content, or the extremes of it.** The longest plausible product name, the shortest, the missing image, the eleven-item menu. Layouts fail on content, and content is what the client will put in.
- **Type and spacing as a system.** A scale the code can encode. A design where each heading is a bespoke size produces a stylesheet nobody can maintain.
- **Interaction and motion described.** What triggers it, how long it takes, and what happens when a visitor has reduced motion enabled.
- **Assets in the right form.** Vector as SVG, photography at the sizes the layout needs. See [Performance](../quality/performance.md) on why the original resolution is rarely the right one.
- **Anything the content management system (CMS) controls.** On a headless CMS project, much of the page is editable. Which parts are fixed and which an editor can change determines the component structure, so it has to be settled before components are built.

## What design can expect from engineering

- **Questions early, in one batch.** Read the whole design, then ask everything at once. A drip of questions across a sprint is worse for everyone than one uncomfortable list on day one.
- **A named deviation, not a silent one.** When something cannot be built as drawn, or would carry a performance or accessibility cost that is not worth paying, say so and propose the alternative. Do not build it differently and hope nobody looks.
- **A review against the design, before it is called done.** Compare the built page with the design at more than one width, and share what does not match rather than waiting to be told.
- **A constraint stated accurately.** "This costs us client-side JavaScript on an otherwise static page" gives design something to work with. "This is not possible" is rarely true, and it ends the conversation instead of continuing it.

## Where accessibility belongs

Designing accessibility in is the cheapest way to get it, which is why [Accessibility](../accessibility/accessibility.md) lists it first among the practices that raise our baseline. Contrast, focus states, error states, touch target size, heading hierarchy, and the reading order of a layout are all design decisions. A developer can implement them well or badly, but cannot add one afterward without changing the design.

So run the [Manual testing checklist](../accessibility/manual-testing-checklist.md) at design review, not only at code review. Its structure, content, and forms sections can each be checked against a static design, before any of it is built.

## Handling a change after build starts

Designs change, and the standard is not to prevent that. It is to make the cost visible before the change is agreed. When a change arrives mid-build, say what it affects: one component, or the layout system every page uses. That is a question only engineering can answer, and it is what lets a project manager decide whether the change is worth its price.

A change that alters how the system is built, rather than how it looks, is a decision worth recording. See [Architecture Decision Records](../engineering/architecture-decision-records.md).

## Minimum project documentation

Design handoff produces decisions, not only files. Each project should document, in its own `/docs`:

- where the current design lives, and which version the build was based on
- the type scale, spacing scale, and color values the code uses, and whether they are exported or transcribed
- any place the build deliberately departs from the design, and why
- which parts of each page an editor controls through the CMS
- accessibility decisions taken at design, such as a focus treatment or a contrast exception

## Related

- [Accessibility](../accessibility/accessibility.md)
- [Manual testing checklist](../accessibility/manual-testing-checklist.md)
- [Performance](../quality/performance.md)
- [Team working model](team-working-model.md)
- [Development workflow](../development/development-workflow.md)
