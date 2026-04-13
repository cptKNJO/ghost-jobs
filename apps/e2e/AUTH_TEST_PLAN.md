# Plan: End-to-End Magic Link Authentication Test (Mailpit)

This plan details the implementation of a full end-to-end test for the magic link authentication flow, specifically targeting the modern Supabase local development stack which uses **Mailpit** for email testing.

## 1. Prerequisites
- **Supabase CLI**: Running locally (`pnpm --filter @repo/supabase dev`).
- **Web App**: Running on `http://localhost:3000`.
- **Mailpit Web Interface**: Accessible at `http://localhost:54324` (Note: Even if `config.toml` says `[inbucket]`, modern Supabase uses Mailpit on the same port).
- **Mailpit API**: Accessible at `http://localhost:54324/api/v1`.

## 2. Test Flow
The test is implemented in `apps/e2e/tests/auth.spec.ts`.

### Step 1: Request Magic Link
1.  Navigate to `http://localhost:3000/login`.
2.  Fill in the email field with a unique test email (e.g., `test-user@example.com`).
3.  Click "Send Magic Link".
4.  Wait for the success message: "Check your email".

### Step 2: Retrieve Magic Link from Mailpit
1.  **Search for Messages**: `GET http://localhost:54324/api/v1/search?query=to:test-user@example.com`.
2.  **Identify Message**: Select the most recent message from the `messages` array in the JSON response.
3.  **Fetch Content**: `GET http://localhost:54324/api/v1/message/{ID}` (where `{ID}` is the `ID` from the search result).
4.  **Extract URL**: Parse the `HTML` body of the message for the confirmation link.
    - Pattern: `http://localhost:3000/auth/confirm\?token_hash=[^"&\s]+&type=magiclink` (or similar depending on your Supabase config).

### Step 3: Complete Authentication
1.  Use `page.goto(extractedUrl)` in Playwright.
2.  This should trigger the server-side verification and set the auth session.

### Step 4: Verify Dashboard Access
1.  Assert that the current URL matches `http://localhost:3000/dashboard`.
2.  Assert that the text "You are logged in!" is visible on the page.

## 3. Implementation Utility
A helper function `getLatestMagicLink(email: string)` in `apps/e2e/tests/utils.ts` encapsulates the Mailpit API logic.

## 4. Verification
Run the test using:
```bash
pnpm --filter e2e test
```
Expected result: Both the login request and the token verification pass seamlessly.
