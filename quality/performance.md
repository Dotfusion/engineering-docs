# Performance

This document defines the default performance standard for Dotfusion web projects: which metrics we hold ourselves to, where the thresholds sit, how we measure them, and what a project must document about its own performance.

Performance is part of quality, in the same way accessibility and security are. A page that renders correctly but is not usable for several seconds has failed the person waiting for it.

Most of our work is content-driven marketing and commerce sites, where a visitor typically arrives from search or an ad, on a phone, on a connection we do not control. That reader has no reason to wait, so front-end performance decides whether the page is read at all.

These are global defaults. Per-project budgets, the actual measured numbers, and any documented exception belong in that project's `/docs`, because this repository is public.

## The metrics we hold ourselves to

We hold ourselves to Core Web Vitals. They measure what a visitor experiences rather than what a server does, and they are the metrics that both search ranking and client reporting already refer to, so there is no second scorecard to maintain.

| Metric | What it measures | Our target | Poor above |
| --- | --- | --- | --- |
| Largest Contentful Paint (LCP) | How long until the main content has rendered | 2.5s or faster | 4.0s |
| Interaction to Next Paint (INP) | How long the page takes to respond to an interaction | 200 ms or faster | 500 ms |
| Cumulative Layout Shift (CLS) | How much visible content moves during load | 0.1 or lower | 0.25 |

Two supporting metrics help diagnose a failing target rather than define one:

- **Time to First Byte (TTFB).** 800 ms or faster. A slow TTFB puts a ceiling on LCP that no front-end work can lift.
- **First Contentful Paint (FCP).** 1.8s or faster. Useful for separating "the server is slow" from "the render is slow".

Measure these at the 75th percentile of page loads, which is the convention Google uses. Read the percentile rather than the average, because an average hides the slowest quarter of your visitors entirely. Measure mobile and desktop separately, and hold the mobile number to the same target: mobile is the harder case, so a target met only on desktop is not met.

## Where the budget applies

A target checked once before launch drifts, because nobody is told when it moves. So performance belongs on the pull request:

- **Lab measurement on every pull request.** Lighthouse runs against the preview deployment as part of the pipeline described in [CI/CD](../delivery/ci-cd.md), and reports a metric that has crossed its target.
- **Field measurement in production.** Data from real visitors is the number that counts. A lab score is a proxy, useful because it arrives before merge rather than because it is more accurate.
- **A budget, not a score.** Report each metric against its threshold. A single composite score hides which metric moved, and gives nobody an action.

To confirm: whether Lighthouse in the pipeline and a field-data source are configured on our projects today, or whether this is the target state. Until that is settled, treat the three bullets above as where we are going.

## Practices that keep the targets met

On our stack, a small number of decisions account for most of the result, and each is cheapest to make before the code exists. These are the defaults. Departing from one is a project decision worth recording.

- **Render on the server by default.** Ship a server-rendered or statically generated page and add client JavaScript deliberately. A React Server Component that sends no JavaScript is the cheapest component there is.
- **Budget the JavaScript.** Every dependency is bytes on a phone. Apply the dependency rules in [Code standards](../development/code-standards.md), and check the bundle impact of a package before adding it, not after.
- **Treat images as the main payload.** On a content site, images usually outweigh everything else combined. Use the framework's image component, serve modern formats, size to the layout rather than the original, and set explicit dimensions so the layout does not shift.
- **Reserve space for anything that loads late.** Most CLS comes from images, ads, embeds, and fonts that arrive after first paint and push content down. Give them dimensions up front.
- **Load fonts without a flash.** Self-host or preload, subset to the characters used, and set a fallback that matches metrics closely enough that the swap does not reflow the page.
- **Defer third-party scripts.** Analytics, chat widgets, tag managers, and consent tools block the main thread, which is what a failing INP usually measures, and they are the code we control least. Load them after the page is interactive, and review the list at least once a release cycle against what anyone still uses.
- **Cache deliberately.** Static generation and incremental regeneration on a headless CMS project mean a visitor rarely waits for the CMS. Know what is cached, for how long, and what invalidates it.

The [`react-best-practices`](../ai/skills/react-best-practices/) skill states the component-level rules behind these practices, as checks a reviewer can apply. Invoke it when writing or refactoring components rather than working from memory. Its skill name is `vercel-react-best-practices`, because it is vendored from Vercel.

## Performance and accessibility overlap

The practices that make a page fast overlap heavily with the ones that make it accessible: semantic HTML, less JavaScript, no layout shift, real text instead of images of text, and motion that respects a reduced-motion preference. Treat a finding in one as a hint to check the other. See [Accessibility](../accessibility/accessibility.md).

## Minimum project documentation

Each project should document, in its own `/docs`:

- the performance budget it commits to, and any target that differs from the defaults above
- how performance is measured, in the pipeline and in production, and where to read the results
- the current measured numbers and the date they were taken
- known performance constraints, such as a heavy third-party integration the client requires
- any documented exception, with its reason

## Related

- [Testing strategy](testing-strategy.md)
- [Testing types](testing/testing-types.md)
- [Accessibility](../accessibility/accessibility.md)
- [Code standards](../development/code-standards.md)
- [CI/CD](../delivery/ci-cd.md)
- [Observability and monitoring](../observability/monitoring.md)
