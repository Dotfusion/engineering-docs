# Playwright end-to-end testing

This document is the Dotfusion default for setting up and writing Playwright end-to-end tests. It covers the configuration, folder layout, locator strategy, authentication pattern, mocking approach, and CI setup we use across projects. For the reasoning behind what to test at this level, read [Testing strategy](../testing-strategy.md) first, then [Testing types](testing-types.md) to confirm end-to-end is the right level for the behavior in front of you.

The full reference library sits in the vendored [`playwright-best-practices`](../../ai/skills/playwright-best-practices/SKILL.md) skill, which covers cases this document does not.

Everything here is a default. The values a project actually uses (its `baseURL`, which browsers it runs, which flows it treats as critical, and which of these patterns it needs) belong in that project's own `/docs`, because they differ per project and this repository is public.

For AI assistance while writing or debugging tests, invoke the skill directly in Claude Code:

```text
/dotfusion-docs:playwright-best-practices
/dotfusion-docs:playwright-cli
```

## Set up Playwright in a new project

```bash
npm install --save-dev @playwright/test
npx playwright install
```

For CI, install only the browsers you need to keep setup fast:

```bash
npx playwright install chromium
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: '**/auth.setup.ts' },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

Key choices explained:

- `retries: process.env.CI ? 2 : 0`: retries only in CI. Retrying locally hides real flakiness during development.
- `trace: 'on-first-retry'`: captures a trace when a test retries so you can inspect failures without always paying the performance cost.
- `forbidOnly: !!process.env.CI`: fails the CI run if a `test.only` is accidentally committed.
- `webServer`: starts the dev server automatically if it is not already running.

> Reference: `core/configuration.md` in the `playwright-best-practices` skill.

## Folder structure and naming conventions

```text
e2e/
  auth/
    auth.setup.ts          # global auth setup: runs once, saves session
    login.spec.ts
    signup.spec.ts
  dashboard/
    dashboard.spec.ts
  onboarding/
    onboarding.spec.ts
  fixtures/
    index.ts               # custom test fixture extensions
    auth.ts                # auth-specific fixtures
  pages/
    LoginPage.ts           # Page Object Model classes
    DashboardPage.ts
  helpers/
    supabase.ts            # Supabase test utilities
playwright/
  .auth/
    user.json              # saved session state: gitignored
playwright.config.ts
```

**Naming conventions:**

| File type | Convention | Example |
|-----------|-----------|---------|
| Test files | `<feature>.spec.ts` | `dashboard.spec.ts` |
| Setup files | `<name>.setup.ts` | `auth.setup.ts` |
| Page Object classes | `<Name>Page.ts` (PascalCase) | `LoginPage.ts` |
| Fixture files | kebab-case noun | `auth.ts`, `seed-data.ts` |

Test names should describe what the user can do, not implementation details:

```typescript
// Good
test('user can delete a project from the dashboard')

// Avoid
test('DELETE /api/projects returns 200')
```

Add `playwright/.auth/` to `.gitignore`. Never commit session tokens.

> Reference: `core/test-suite-structure.md` in the `playwright-best-practices` skill.

## Write your first test

```typescript
// e2e/dashboard/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('shows user greeting after login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });

  test('navigates to settings from the nav', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('/settings');
  });
});
```

**Web-first assertions** auto-retry until the condition is met or the timeout expires:

```typescript
// Web-first: retries until visible or timeout
await expect(page.getByRole('heading')).toBeVisible();

// Not web-first: evaluates once, does not retry
expect(await page.getByRole('heading').isVisible()).toBe(true);
```

Always use web-first assertions. The second form will fail on elements that appear after a network request or animation.

**Auto-waiting:** Actions like `click()`, `fill()`, and `press()` automatically wait for the element to be visible, stable, and enabled. Do not add manual waits before actions.

```typescript
// Bad: the timeout is a guess, not a guarantee
await page.waitForTimeout(2000);
await page.getByRole('button', { name: 'Submit' }).click();

// Good: Playwright waits for the button automatically
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByRole('status')).toContainText('Saved');
```

> Reference: `core/assertions-waiting.md` in the `playwright-best-practices` skill.
> Use `/dotfusion-docs:playwright-best-practices` in Claude Code to get guidance on writing new tests.

## Locator strategy

Prefer locators that survive markup and styling refactors. Order of preference:

| Priority | Locator | When to use |
|----------|---------|-------------|
| 1 | `getByRole` | Interactive elements (buttons, links, inputs, headings) |
| 2 | `getByLabel` | Form inputs associated with a visible label |
| 3 | `getByPlaceholder` | Inputs without a label |
| 4 | `getByTestId` | Components without accessible semantics |
| 5 | `getByText` | Static display text unlikely to change |
| 6 | CSS / XPath | Last resort: avoid |

```typescript
// Preferred
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email address').fill('user@example.com');
await page.getByTestId('save-button').click();

// Avoid: brittle, breaks on style or markup changes
await page.locator('.btn.btn-primary.rounded-lg').click();
await page.locator('div:nth-child(3) > form > button:last-child').click();
```

For `getByTestId` to work, add `data-testid` attributes to components that lack accessible roles:

```jsx
// In your Next.js component
<button data-testid="save-button" onClick={handleSave}>Save</button>
```

> Reference: `core/locators.md` in the `playwright-best-practices` skill.

## Authentication: reusing a Supabase session

Logging in before every test is slow and fragile. Log in once in a global setup step, save the browser's `storageState` (cookies + localStorage), and inject it into every test automatically.

### Global auth setup

```typescript
// e2e/auth/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate via Supabase', async ({ page }) => {
  await page.goto('/login');

  // Fill the Supabase Auth UI form
  await page.getByLabel('Email address').fill(process.env.E2E_EMAIL!);
  await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Supabase stores the session in localStorage.
  // Wait for the redirect to confirm auth completed.
  await page.waitForURL('/dashboard');
  await expect(page.getByRole('navigation')).toBeVisible();

  // Persist cookies and localStorage to disk
  await page.context().storageState({ path: authFile });
});
```

The `playwright.config.ts` shown in [Set up Playwright in a new project](#set-up-playwright-in-a-new-project) wires the `setup` project as a dependency of `chromium`, so the saved session is injected automatically into every test. No extra imports needed in test files.

### Using the auth session in tests

```typescript
// e2e/dashboard/dashboard.spec.ts: runs already authenticated
import { test, expect } from '@playwright/test';

test('authenticated user sees their projects', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('list', { name: 'Projects' })).toBeVisible();
});
```

### Test account credentials

A test account is a real credential, so it follows the same rules as every other secret in [How to manage .env files](../../security/how-to-manage-env.md): it lives in the project's 1Password Developer environment, `.env.sample` carries the reference rather than the value, and nobody writes it into a file by hand.

Add `E2E_EMAIL` and `E2E_PASSWORD` as 1Password references in `.env.sample`, then run the suite through `op` so the values are injected at process start and never land on disk:

```bash
op run --env-file=".env.sample" -- npx playwright test
```

When a tool needs a real file on disk, generate it rather than typing it:

```bash
op inject -i .env.sample -o .env.local
```

In CI, pass them as GitHub Actions secrets, as the workflow in [Run tests locally and in CI](#run-tests-locally-and-in-ci) does. Never hard-code a credential in a test file, and never commit `.env.local`.

> Reference: `advanced/authentication.md` and `advanced/authentication-flows.md` in the `playwright-best-practices` skill for OAuth, magic link, and multi-role patterns.

## Page Object Model compared with fixtures

Both patterns eliminate repetition. The choice depends on what you are abstracting.

### Page Object Model (POM)

Best for: encapsulating a page's locators and interactions so that test files focus on behavior, not selectors.

```typescript
// e2e/pages/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Email address');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL('/dashboard');
  }
}
```

```typescript
// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('rejects invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('wrong@example.com', 'wrongpassword');
  await expect(page.getByRole('alert')).toContainText('Invalid credentials');
});
```

### Fixtures

Best for: cross-cutting setup and teardown, such as seeding test data, providing pre-built page objects, and injecting API clients.

```typescript
// e2e/fixtures/index.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
```

```typescript
// e2e/auth/login.spec.ts: using the fixture
import { test, expect } from '../fixtures';

test('rejects invalid credentials', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login('wrong@example.com', 'bad');
  await expect(page.getByRole('alert')).toContainText('Invalid credentials');
});
```

**Rule of thumb:** Use POM for a reusable abstraction over a page's interactions. Use fixtures for setup and teardown logic that is shared across many test files.

> Reference: `architecture/pom-vs-fixtures.md` and `core/page-object-model.md` in the `playwright-best-practices` skill.

## Mocking APIs and network traffic

Use `page.route()` to intercept requests and return controlled responses. This is the primary way to test error states, loading states, and edge cases that are hard to reproduce against a real backend.

### Mock a failing API endpoint

```typescript
test('shows error banner when profile API fails', async ({ page }) => {
  await page.route('/api/profile', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  await page.goto('/profile');
  await expect(page.getByRole('alert')).toContainText('Something went wrong');
});
```

### Mock Supabase REST API calls

Supabase client calls the REST API at `/rest/v1/`. Mock it to control what data the UI receives without touching the real database:

```typescript
test('dashboard shows empty state when user has no projects', async ({ page }) => {
  await page.route('**/rest/v1/projects*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.goto('/dashboard');
  await expect(page.getByText('No projects yet')).toBeVisible();
});
```

### Observe requests without mocking

```typescript
test('sends correct payload on form submit', async ({ page }) => {
  const requestPromise = page.waitForRequest('**/api/contact');

  await page.goto('/contact');
  await page.getByLabel('Message').fill('Hello team');
  await page.getByRole('button', { name: 'Send' }).click();

  const request = await requestPromise;
  expect(JSON.parse(request.postData()!)).toMatchObject({
    message: 'Hello team',
  });
});
```

> Reference: `testing-patterns/api-testing.md`, `testing-patterns/graphql-testing.md`, and `architecture/when-to-mock.md` in the `playwright-best-practices` skill.

## Run tests locally and in CI

### Local commands

```bash
# Run all tests
npx playwright test

# Interactive UI mode (recommended while writing tests)
npx playwright test --ui

# Run a specific folder
npx playwright test e2e/dashboard

# Run a single file
npx playwright test e2e/auth/login.spec.ts

# Headed mode: watch the browser
npx playwright test --headed

# Step-through debugger
npx playwright test --debug

# Show the last test report
npx playwright show-report
```

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npx playwright test
        env:
          BASE_URL: http://localhost:3000
          E2E_EMAIL: ${{ secrets.E2E_EMAIL }}
          E2E_PASSWORD: ${{ secrets.E2E_PASSWORD }}

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Parallelism and sharding

Shard the test suite across multiple CI machines to reduce wall-clock time for large suites:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - name: Run shard
        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
        env:
          E2E_EMAIL: ${{ secrets.E2E_EMAIL }}
          E2E_PASSWORD: ${{ secrets.E2E_PASSWORD }}
```

> Reference: `infrastructure-ci-cd/github-actions.md` and `infrastructure-ci-cd/parallel-sharding.md` in the `playwright-best-practices` skill for HTML report merging across shards and advanced CI patterns.

## Debug a flaky test

Flakiness almost always comes from: race conditions (waiting for arbitrary time instead of real conditions), shared state between tests, or non-deterministic data. The trace viewer is the fastest way to diagnose any of them.

### Capture and open a trace

```bash
# Capture traces for every test run
npx playwright test --trace on

# Trace only on retry (matches the production config)
npx playwright test --trace on-first-retry

# Open the HTML report with embedded trace viewer
npx playwright show-report
```

The trace viewer shows: a DOM snapshot at every action, network request/response pairs, console logs, and the full action timeline.

### Fix common causes

**Replace arbitrary sleeps with real conditions:**

```typescript
// Bad
await page.waitForTimeout(3000);
await page.click('#submit');

// Good
await page.getByRole('button', { name: 'Submit' }).waitFor({ state: 'visible' });
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByRole('status')).toContainText('Saved');
```

**Make tests independent: never rely on state from a previous test:**

```typescript
// Bad: assumes a previous test created the item
test('deletes the first item', async ({ page }) => {
  await page.getByTestId('item-0').getByRole('button', { name: 'Delete' }).click();
});

// Good: creates its own data
test('deletes an item', async ({ page }) => {
  await page.goto('/items/new');
  await page.getByLabel('Name').fill('Temp item');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByTestId('latest-item').getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Temp item')).not.toBeVisible();
});
```

> Reference: `debugging/flaky-tests.md` and `debugging/debugging.md` in the `playwright-best-practices` skill.
> Invoke `/dotfusion-docs:playwright-best-practices` with the error message from a failing test for step-by-step diagnosis.

## When to use playwright-cli instead of handwritten tests

The `playwright-cli` skill drives the `@playwright/cli` binary: an interactive browser automation tool. It is a **scratchpad tool for exploration and codegen**, not a replacement for the test runner.

| Use `/dotfusion-docs:playwright-cli` when... | Write tests by hand when... |
|----------------------------------------------|------------------------------|
| Exploring an unfamiliar page before writing tests | Tests need assertions, fixtures, or POM structure |
| Generating test scaffolding via codegen | Tests run in CI |
| Inspecting a selector in a live browser | Tests need `storageState` auth or API mocks |
| Checking a UI state ad hoc | You need retries, parallelism, and a test report |

### Install the CLI binary

Install it globally, since it is a developer tool rather than a project dependency:

```bash
npm install -g @playwright/cli@latest
```

Run it on the Node version the project pins in `.nvmrc`. The versions we build against are in [Code standards](../../development/code-standards.md#toolchain).

### Codegen workflow

```bash
# Start a codegen session against your local dev server
playwright-cli codegen http://localhost:3000
```

Playwright opens a browser and an inspector window. Click around in the browser and it generates Playwright test code as you interact. Copy the generated selectors and actions into your `.spec.ts` files as a starting point, then add assertions and fixtures.

> Invoke `/dotfusion-docs:playwright-cli` in Claude Code to get AI help driving the CLI interactively. Invoke `/dotfusion-docs:playwright-best-practices` to get guidance on writing, debugging, or refactoring the resulting tests.

## Add end-to-end tests to an existing project

Follow these steps to add Playwright to a project that already has unit or integration tests.

### Step 1: Install

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

### Step 2: Add playwright.config.ts at the project root

Copy the config from [Set up Playwright in a new project](#set-up-playwright-in-a-new-project). Update `baseURL` to match the project's dev server port and `command` in `webServer` to match the start script.

### Step 3: Create the directory structure

```bash
mkdir -p e2e/auth e2e/fixtures e2e/pages playwright/.auth
echo 'playwright/.auth/' >> .gitignore
```

### Step 4: Add the auth setup (projects using Supabase auth)

Copy `e2e/auth/auth.setup.ts` from [Authentication: reusing a Supabase session](#authentication-reusing-a-supabase-session) and update the label selectors to match the actual login UI. Add `E2E_EMAIL` and `E2E_PASSWORD` to `.env.local`.

### Step 5: Write one test for the highest-risk user flow

Identify the flow where a regression would be discovered latest or have the highest impact (e.g., checkout, sign-up, core feature activation). Write one test for the happy path. Start small.

### Step 6: Add CI

Add `.github/workflows/e2e.yml` from [Run tests locally and in CI](#run-tests-locally-and-in-ci). Add `E2E_EMAIL` and `E2E_PASSWORD` as repository secrets under Settings > Secrets and Variables > Actions.

### Step 7: Expand coverage incrementally

Add tests for the next highest-risk flow. Do not aim for coverage percentage: aim for catching the failures that matter most before they reach production.

> Invoke `/dotfusion-docs:playwright-best-practices` for project-specific test writing guidance.
> Use `/dotfusion-docs:playwright-cli` with the codegen command to generate initial test scaffolding from the live UI.

## Related

- [Testing strategy](../testing-strategy.md)
- [Testing types](./testing-types.md)
- [Accessibility](../../accessibility/accessibility.md)
- [CI/CD](../../delivery/ci-cd.md)
