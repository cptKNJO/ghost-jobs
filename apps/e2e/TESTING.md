# Plan: Testing Strategy for apps/web

This plan focuses on establishing a robust testing environment for `apps/web`, utilizing Vitest for unit/integration tests and a dedicated `apps/e2e` package for end-to-end flows.

## 1. Core Testing Stack
- **Vitest**: Unit and integration testing within `apps/web`.
- **React Testing Library (RTL)**: For testing web components and hooks.
- **Playwright**: Dedicated `apps/e2e` package targeting the web application.
- **Supabase Local Development**: Required for E2E auth flows.

## 2. Web App Tests (Vitest)
Tests will be co-located within `apps/web/src`.

### Key Scenarios:
- **Auth Components (`LoginForm`):**
  - Verify state changes (loading, success, error).
  - Test input validation and submission.
- **Server Actions (`signInWithMagicLink`):**
  - Mock Supabase auth responses to verify logic branches.

## 3. Dedicated E2E App (`apps/e2e`)
A separate package to manage Playwright and browser-based testing for `apps/web`.

### Sign-Up Journey (E2E):
1. **Initial State**: User navigates to the landing page.
2. **Action**: User enters email and submits the login form.
3. **Verification**: User receives success feedback.
4. **Auth Flow**: Capture the magic link from the local Supabase environment.
5. **Success**: Navigate to the link and verify redirection to `/dashboard`.

## 4. Implementation Steps

### Phase 1: Setup Vitest in `apps/web`
- Install dependencies: `vitest`, `@testing-library/react`, `jsdom`.
- Configure `vitest.config.ts`.
- Add `test` and `test:watch` scripts to `apps/web/package.json`.

### Phase 2: Scaffold `apps/e2e`
- Create `apps/e2e` directory.
- Initialize with `pnpm init`.
- Install `@playwright/test`.
- Configure `playwright.config.ts` to target `http://localhost:3000`.

### Phase 3: Implement Initial Tests
- Create a unit test for `LoginForm` in `apps/web`.
- Create a basic E2E test in `apps/e2e/tests/auth.spec.ts`.

## 5. Verification
- Run `pnpm --filter web test` for unit tests.
- Run `pnpm --filter e2e test` for E2E tests.
