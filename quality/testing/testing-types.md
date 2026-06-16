# Testing types

This document defines the testing types used across Dotfusion projects and explains when to use each one.

For overall testing philosophy, see [testing-strategy.md](../testing-strategy.md).
For E2E setup and examples, see [e2e-testing.md](./e2e-testing.md).

---

## Quick reference

| Type | Scope | Speed | Confidence | Primary tool |
|------|-------|-------|------------|--------------|
| Unit | One function or module | Very fast | Logic only | Vitest / Jest |
| Integration | Multiple modules together | Fast | Wiring between parts | Vitest + Testing Library |
| Component | One UI component in isolation | Fast | Rendering and interaction | Testing Library / Playwright CT |
| Snapshot | Rendered output | Very fast | Prevents unintended changes | Vitest / Jest |
| End-to-end (E2E) | Full app in a real browser | Slow | Full user flow | Playwright |
| Smoke | Critical paths only | Medium | App is not broken at deploy | Playwright (subset) |
| Regression | Previously broken behavior | Varies | A specific bug stays fixed | Any |
| Visual regression | Pixel-level UI rendering | Medium | Layout and style | Playwright |
| Accessibility | WCAG compliance | Fast to medium | Screen reader and keyboard use | axe-core / Playwright |
| Performance | Response time and load | Slow | Speed under real conditions | k6 / Lighthouse |
| Contract | API shape between services | Fast | Provider and consumer agree | Pact |
| Acceptance (UAT) | Complete feature or workflow | Slow | Meets business requirements | Manual or Playwright |

---

## Unit tests

A unit test verifies a single function, class, or module in complete isolation. Dependencies are replaced with mocks or stubs.

**When to write them.** Pure logic, utility functions, business rules, data transformations, and anything with clear inputs and outputs.

**When not to.** Do not write unit tests for code whose behavior is entirely defined by how parts work together. Testing the integration is more valuable than testing each part in isolation.

```js
// utils/currency.js
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
```

```js
// utils/currency.test.js
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('formats EUR when specified', () => {
    expect(formatCurrency(50, 'EUR')).toBe('€50.00');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
```

**Speed.** Milliseconds. Run on every file save.

---

## Integration tests

An integration test verifies that two or more modules work together correctly. Dependencies are real, not mocked (or mocked only at the outer boundary, such as an external API or database).

**When to write them.** Data fetching hooks, API route handlers, Supabase queries, server actions, or any flow where the interaction between parts is the thing being tested.

```js
// app/api/projects/route.test.js
import { GET } from './route';
import { createTestSupabaseClient } from '@/test/helpers/supabase';

it('returns projects for the authenticated user', async () => {
  const request = new Request('http://localhost/api/projects');
  const response = await GET(request);
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(data)).toBe(true);
});
```

**Speed.** Fast to medium. Run on every commit.

---

## Component tests

A component test renders a single UI component and verifies how it behaves when the user interacts with it. The test uses the DOM, not a real browser.

**When to write them.** Forms, interactive widgets, components with non-trivial state, or components with multiple conditional rendering paths.

```jsx
// components/SearchInput.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

it('calls onChange when the user types', async () => {
  const handleChange = vi.fn();
  render(<SearchInput onChange={handleChange} />);

  await userEvent.type(screen.getByRole('searchbox'), 'Next.js');

  expect(handleChange).toHaveBeenCalledWith('Next.js');
});
```

**Speed.** Fast. Run on every commit.

---

## Snapshot tests

A snapshot test captures the rendered output of a component (HTML, JSON, or any serializable value) and fails if the output changes unexpectedly.

**When to write them.** Stable, low-churn components where an unintended markup change would be a bug. Not useful for highly dynamic content.

**Caution.** Snapshots that are updated automatically and without review add no value. When a snapshot test fails, read the diff before updating it.

```jsx
import { render } from '@testing-library/react';
import { Badge } from './Badge';

it('renders a warning badge', () => {
  const { container } = render(<Badge variant="warning">Pending</Badge>);
  expect(container.firstChild).toMatchSnapshot();
});
```

**Speed.** Very fast. Run on every commit.

---

## End-to-end (E2E) tests

An E2E test drives a real browser through a real application from start to finish, the same way a user would. The full stack is running: frontend, backend, database, and third-party services (or controlled mocks of them).

**When to write them.** Critical user flows where a regression would be caught late or have high business impact. Examples: authentication, onboarding, checkout, core feature activation.

**When not to.** Do not write E2E tests for every page or every edge case. They are slow and more fragile than unit or integration tests. Use them intentionally.

See [e2e-testing.md](./e2e-testing.md) for setup, Supabase auth patterns, and CI configuration.

```ts
// e2e/onboarding/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test('new user completes onboarding', async ({ page }) => {
  await page.goto('/onboarding');
  await page.getByLabel('Project name').fill('My first project');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'My first project' })).toBeVisible();
});
```

**Speed.** Slow (seconds per test). Run on pull request and on main branch.

---

## Smoke tests

A smoke test is a small subset of E2E tests that checks whether the application starts and its most critical paths are working. The name comes from hardware testing: power on the device and check that nothing catches fire.

**When to run them.** Immediately after a deployment, before running the full E2E suite, or as a quick health check in staging.

A smoke test does not test every feature. It verifies that the app loads, the user can log in, and the primary flow works.

```ts
// e2e/smoke/smoke.spec.ts
import { test, expect } from '@playwright/test';

test('app loads and login page is reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page).not.toHaveTitle(/error/i);
  await page.getByRole('link', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/login');
});

test('authenticated user can reach the dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('navigation')).toBeVisible();
});
```

Use Playwright tags to mark smoke tests so they can run independently:

```ts
test('app loads', { tag: '@smoke' }, async ({ page }) => { ... });
```

```bash
npx playwright test --grep @smoke
```

**Speed.** Medium (a few seconds). Runs immediately after deploy.

---

## Regression tests

A regression test verifies that a specific bug, once fixed, does not come back. The term describes the intent, not a separate tool or syntax. A regression test is a unit test, integration test, or E2E test written specifically in response to a known bug.

**When to write them.** Every time a bug is fixed. Write the test first, confirm it fails (reproduces the bug), fix the bug, confirm the test passes.

```js
// Regression test for issue #412
// Bug: formatCurrency crashed on negative values
it('handles negative amounts without throwing', () => {
  expect(() => formatCurrency(-99.99)).not.toThrow();
  expect(formatCurrency(-99.99)).toBe('-$99.99');
});
```

Add a comment referencing the issue or PR so future readers understand why the test exists.

---

## Visual regression tests

A visual regression test captures a screenshot of a page or component and fails if the rendered pixels change beyond a threshold. It catches layout shifts, broken styles, and unintended design changes that a DOM assertion would miss.

**When to write them.** Design-critical pages, component libraries, or anywhere a visual change that does not break functionality would still be a problem.

Playwright has built-in screenshot comparison:

```ts
test('dashboard matches visual baseline', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

On first run, Playwright creates the baseline screenshot. On subsequent runs, it diffs against it.

**Caution.** Visual baselines need to be updated intentionally when designs change. Treat them the same as snapshot tests: read the diff before approving.

**Speed.** Medium. Run on pull request.

---

## Accessibility tests

An accessibility test checks whether the application is usable by people who rely on assistive technologies such as screen readers and keyboards. It also checks conformance with WCAG guidelines.

**Automated checks** catch about 30 to 40 percent of accessibility issues. They are fast and should run on every pull request.

```ts
// Using axe-core via @axe-core/playwright
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('login page has no accessibility violations', async ({ page }) => {
  await page.goto('/login');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

**Manual checks** are required for anything involving focus order, screen reader announcements, and keyboard navigation. Automated tools cannot replace a real screen reader test.

---

## Performance tests

A performance test measures how fast the application responds under a defined workload. There are two main types:

**Load tests** simulate a realistic number of concurrent users and verify that response times and error rates stay within acceptable limits.

**Stress tests** push the system past its expected capacity to find the breaking point.

Performance tests are typically run against a staging environment, not in the standard CI pipeline, because they require infrastructure that matches production.

```js
// k6 load test example
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,        // 50 virtual users
  duration: '30s',
};

export default function () {
  const res = http.get('https://staging.example.com/api/projects');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

For frontend performance, use Lighthouse or Playwright's `page.goto()` with `waitUntil: 'networkidle'` and measure Core Web Vitals.

---

## Contract tests

A contract test verifies that two services agree on the shape of the data they exchange: the API request format, response structure, and status codes. One side defines the contract (usually the consumer), and both sides run tests to confirm they honour it.

**When to write them.** Projects that consume or provide APIs shared with other services or teams. Not necessary for projects that own both sides of the API.

A common tool is [Pact](https://docs.pact.io/).

---

## Acceptance tests (UAT)

User acceptance testing (UAT) verifies that a feature meets the agreed business requirements from the perspective of the product owner or client. It is the last check before release.

UAT can be manual or automated. When it is automated, the tests are usually written in plain language using a tool like Cucumber, or they are Playwright tests that map directly to acceptance criteria.

**When to do it.** Before releasing a feature that has specific acceptance criteria agreed on with a client or product owner. Include UAT notes in the pull request when relevant.

---

## How to choose

Start with the layer closest to the code. Move up only when the behavior cannot be verified at a lower level.

1. Can I verify this with a unit test? If yes, use a unit test.
2. Does the behavior depend on how multiple parts interact? Use an integration test.
3. Does the behavior require a real browser or a full user flow? Use an E2E test.
4. Is this a known bug I am fixing? Add a regression test at the lowest appropriate level.
5. Does the feature need client sign-off? Include a UAT step in the pull request.

Each test added at a higher level should replace several tests at a lower level, not add to them.

## Related

- [Testing strategy](../testing-strategy.md)
- [Playwright E2E testing](./e2e-testing.md)
- [Accessibility](../../accessibility/accessibility.md)
- [CI/CD](../../delivery/ci-cd.md)
