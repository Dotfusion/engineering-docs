# Accessibility manual testing checklist

This is the hands-on checklist for web accessibility. It supports the [Accessibility](accessibility.md) standard, which explains why we follow AODA and why our target is WCAG 2.1 AA.

Run this checklist before marking accessibility-relevant work as done. Record the result in the pull request, as described in the [Testing strategy](../quality/testing-strategy.md). Each item maps to one or more WCAG 2.1 AA success criteria. Not every item applies to every change. Skip what is genuinely not relevant and note why.

Automated tools (axe, pa11y, Lighthouse) catch only part of this list. Treat a green automated run as a floor, not a pass.

## Keyboard

- [ ] Every interactive element can be reached with Tab and operated with Enter or Space.
- [ ] The focus order follows the visual and logical reading order.
- [ ] Focus is always visible. No element removes the focus outline without replacing it.
- [ ] No keyboard trap. Focus can always move away from any element or dialog.
- [ ] Custom widgets (menus, tabs, comboboxes, sliders) support the expected arrow-key behavior.
- [ ] A skip link or equivalent lets keyboard users bypass repeated navigation, and it becomes visible when focused.
- [ ] There are no invisible or off-screen elements that still receive focus.
- [ ] Moving focus to an element does not, on its own, trigger an unexpected change of context.

## Structure and semantics

- [ ] There is exactly one main heading, and heading levels descend without skipping.
- [ ] Native HTML elements are used where they exist (`button`, `a`, `nav`, `label`) rather than styled `div` elements.
- [ ] Landmarks (header, nav, main, footer) are present and used once where expected.
- [ ] The page has a `lang` attribute and a unique, descriptive title.
- [ ] Data tables use `th` with a correct `scope`, and a `caption` where a title helps.
- [ ] Navigation and repeated components appear in a consistent order and are labeled consistently across pages.
- [ ] ARIA is used only to fill real gaps, and no ARIA is better than wrong ARIA.

## Content and media

- [ ] Images convey meaning through alt text, and decorative images have empty alt text.
- [ ] Icon-only buttons and links have an accessible name.
- [ ] Link text describes its destination. There is no bare "read more" or "click here" without context.
- [ ] Links are distinguishable from text by more than color, and links that open a new tab or window say so.
- [ ] Information is never conveyed by color, shape, size, position, or sound alone.
- [ ] Text and meaningful UI meet AA contrast (normal text 4.5:1, large text and non-text UI such as icons, borders, and focus indicators 3:1).
- [ ] Video has captions and audio has a transcript where applicable.

## Forms

- [ ] Every input has a visible, associated label.
- [ ] The visible label text is part of each control's accessible name.
- [ ] Inputs that collect known user data use an appropriate `autocomplete` value.
- [ ] Required fields and formats are communicated in text, not by color or placeholder alone.
- [ ] Errors are announced, linked to their field, and explain how to fix the problem.
- [ ] On a failed submission, focus moves to the first error or to an error summary.
- [ ] Related controls (radio groups, checkbox groups) are grouped with a clear group label.
- [ ] Submissions involving legal, financial, or data changes can be reversed, checked, or confirmed before they take effect.

## Dynamic behavior

- [ ] Important status updates are announced to assistive technology without moving focus (for example with a live region).
- [ ] Modals move focus in on open, trap focus while open, and return focus to the trigger on close.
- [ ] Content shown on hover or focus (tooltips, popovers) is dismissible, can be hovered without disappearing, and stays until dismissed.
- [ ] Content that moves, blinks, or auto-plays can be paused, stopped, or hidden, and nothing flashes more than three times per second.
- [ ] The interface respects the `prefers-reduced-motion` setting.

## Responsive, zoom, and spacing

- [ ] The page is usable and does not lose content at 200 percent zoom.
- [ ] Content reflows to a single column at 320 CSS pixels wide without horizontal scrolling.
- [ ] Content survives increased text spacing (line, paragraph, word, and letter spacing) without clipping or overlap.
- [ ] The page works in both portrait and landscape orientation.
- [ ] Touch targets are large enough (at least 24 by 24 CSS pixels, ideally larger) and not crowded.

## Display modes

- [ ] Content remains visible and usable in forced-colors mode (Windows High Contrast) and in dark mode where supported.

## Screen reader pass

- [ ] A pass through the main flow with a screen reader makes sense: names, roles, states, and order are all understandable.
