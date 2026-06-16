# Accessibility (a11y)

This document defines how Dotfusion approaches web accessibility. It explains the legislation we follow, the standard we build to, the tools we use to validate code, and how we test manually.

Accessibility is part of quality. A feature that some people cannot use is not finished. This document sits alongside the [Testing strategy](../quality/testing-strategy.md) and applies to all client-facing web work unless a project documents a different requirement.

The hands-on test steps live in a separate [Manual testing checklist](manual-testing-checklist.md) so it can be used on its own during reviews.

## Why we follow AODA

Dotfusion operates in Ontario, Canada. The Accessibility for Ontarians with Disabilities Act (AODA) is provincial legislation whose goal is an accessible Ontario by 2025. Its Integrated Accessibility Standards Regulation requires that public websites and web content meet a recognized technical standard for accessibility.

We follow AODA for three reasons:

1. Legal obligation. Many of our clients are organizations that fall under AODA and must publish accessible web content. When we build for them, our work has to meet the same bar.
2. Reach. Accessible products work for more people, including users with permanent, temporary, or situational limitations (low vision, motor difficulty, a broken arm, bright sunlight, a noisy room).
3. Quality. The practices that make a site accessible (clear structure, real semantics, keyboard support, sufficient contrast) also make it more robust, more testable, and better for search and performance.

AODA points to WCAG as its technical standard. That is why the rest of this document is written around WCAG rather than the legislation itself.

## What is WCAG

WCAG stands for Web Content Accessibility Guidelines. It is the international standard published by the W3C that defines, in testable terms, what makes web content accessible.

WCAG is organized around four principles. Content must be:

- Perceivable. Users can perceive the information (for example, images have text alternatives and text has enough contrast).
- Operable. Users can operate the interface (for example, everything works with a keyboard, not only a mouse).
- Understandable. Content and behavior are predictable and clear.
- Robust. Content works with current and future tools, including assistive technology such as screen readers.

These four principles are often shortened to POUR. Under them sit specific success criteria, and each criterion is assigned a conformance level: A, AA, or AAA.

- Level A is the minimum. Failing it blocks some users entirely.
- Level AA is the common legal and industry target. It covers the issues that affect the largest number of users.
- Level AAA is the highest level. It is not expected for whole sites and some criteria cannot be met by all content types.

## The level we build to: WCAG 2.1 AA

Our standard is WCAG 2.1 Level AA.

This is the level required by AODA and by most accessibility commitments our clients make. We adopt version 2.1 (rather than the older 2.0 that AODA strictly mandates) because 2.1 adds criteria that matter for modern usage, including mobile, touch, and low-vision needs, while remaining fully backward compatible with 2.0.

Meeting AA means, among other things:

- Text and interactive elements have sufficient color contrast.
- Every function is available from the keyboard, and focus is always visible.
- Content has a correct heading structure and meaningful landmarks.
- Images, icons, and controls have appropriate text alternatives and accessible names.
- Forms have associated labels and clear, programmatically linked error messages.
- Content reflows and stays usable when zoomed and on small screens.
- Motion and auto-playing content can be paused or reduced.

When a project must meet a different level (for example AAA for a specific public-sector contract, or a documented partial exception), that requirement and its reason belong in the project documentation, not here.

## Tools we use to validate code

Accessibility cannot be proven by tools alone. Automated checks typically catch only a portion of WCAG issues. They are good at finding contrast, missing alternatives, invalid ARIA, and structural problems, and they are useless at judging whether the experience actually makes sense. We therefore combine automated tooling in the pipeline with manual testing.

This is the default toolchain for Dotfusion web projects. Each project should confirm in its own `/docs` which of these it has configured and how to run them.

### Automated checks (CI and local)

- axe-core, the engine behind most accessibility testing, run two ways: directly for component and page checks, and through our Playwright end-to-end suite so accessibility assertions live with the rest of the tests. See the [Playwright best practices](../agents/skills/playwright-best-practices/SKILL.md) skill, which documents accessibility testing with axe-core.
- pa11y for command-line and CI checks against URLs, useful for crawling and asserting against a set of pages.
- Lighthouse (including the accessibility category) for page-level scoring, runnable locally and in CI.

We run more than one engine on purpose. pa11y, axe, and Lighthouse overlap but do not report identically, so using them together widens automated coverage.

### Manual and assistive tooling (review time)

- axe DevTools or the equivalent browser extension for on-page inspection during review.
- WAVE devtools 
- A screen reader for real verification: VoiceOver 
- Keyboard-only navigation, which needs no tooling beyond the Tab, Shift+Tab, Enter, Space, and arrow keys.
- Browser zoom and the device toolbar to check reflow and small-screen behavior.

Treat automated results as a floor, not a pass. A green axe run with no manual testing does not mean the page is accessible.

## Manual testing

Automated tools cannot judge whether the experience makes sense, so every accessibility-relevant change also goes through a manual pass. The steps are maintained as a standalone [Manual testing checklist](manual-testing-checklist.md). Run it before marking work as done and record the result in the pull request, as described in the [Testing strategy](../quality/testing-strategy.md).

## Supporting excellence

Validation catches problems late. The following practices prevent them and raise the baseline of everything we ship.

- Build accessibility in from design. Ask for contrast, focus states, error states, and keyboard interaction in design handoff, not after build. Fixing accessibility at the end is far more expensive than designing it in.
- Start from semantic HTML. Most accessibility comes for free when the right element is used. Reach for ARIA only when a native element cannot do the job.
- Add accessibility checks to the definition of done. The [Manual testing checklist](manual-testing-checklist.md) and at least one automated check should be part of completing a feature, not an optional extra.
- Run axe-core in CI so regressions fail the build instead of reaching production. Make accessibility tests part of the normal end-to-end suite rather than a separate effort.
- Test with a real screen reader periodically, not only with automated tools. Half a day with VoiceOver or NVDA teaches more than any score.
- Build a small library of accessible, reviewed components and reuse it. Solving focus management or a combobox once, correctly, is better than solving it badly many times.
- Include people with disabilities in testing when a project allows it. Real users find issues that no checklist predicts.
- Keep learning from primary sources. The W3C WCAG quick reference and the ARIA Authoring Practices Guide are the references to trust over generic blog posts.

## Documentation

Each project should document, in its own `/docs`:

- the accessibility level it commits to, if it differs from WCAG 2.1 AA
- which accessibility tools are actually configured and how to run them
- any documented exceptions, with the reason
- known accessibility gaps and the plan to close them
