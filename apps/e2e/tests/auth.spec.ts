import { test, expect } from "@playwright/test";
import { getLatestMagicLink } from "./utils";

test.describe("Authentication Flow", () => {
  test("should navigate to the login page", async ({ page }) => {
    await page.goto("/");

    // Check for the "Get Started" button or "Login" link
    const loginLink = page.getByRole("link", { name: /login/i });
    await expect(loginLink).toBeVisible();

    await loginLink.click();

    // Expect to be on the login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
  });

  test("should complete full magic link sign-in flow", async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`;

    // 1. Request Magic Link
    await page.goto("/login");
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill(testEmail);

    const submitButton = page.getByRole("button", { name: /send magic link/i });
    await submitButton.click();

    // 2. Wait for success message
    await expect(page.getByText(/check your email/i)).toBeVisible();

    // 3. Fetch Magic Link from Mailpit
    // Note: This requires the local Supabase stack and its Mailpit instance to be running.
    let magicLink: string;
    try {
      magicLink = await getLatestMagicLink(testEmail);
    } catch (error) {
      console.error(
        "Mailpit retrieval failed. Is Supabase local stack running?",
      );
      throw error;
    }

    // 4. Follow Magic Link
    await page.goto(magicLink);

    // 5. Verify redirection to Dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/you are logged in!/i)).toBeVisible();
  });

  test("should allow a signed-in user to log out", async ({ page }) => {
    const testEmail = `logout-${Date.now()}@example.com`;

    // 1. Request Magic Link
    await page.goto("/login");
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill(testEmail);

    const submitButton = page.getByRole("button", { name: /send magic link/i });
    await submitButton.click();
    await expect(page.getByText(/check your email/i)).toBeVisible();

    // 2. Fetch Magic Link from Mailpit
    let magicLink: string;
    try {
      magicLink = await getLatestMagicLink(testEmail);
    } catch (error) {
      console.error(
        "Mailpit retrieval failed. Is Supabase local stack running?",
      );
      throw error;
    }

    // 3. Follow Magic Link to log in
    await page.goto(magicLink);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/you are logged in!/i)).toBeVisible();

    // 4. Click Logout button
    const logoutButton = page.getByRole("button", { name: /logout/i });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // 5. Verify redirection to login page and "Login" button visibility
    await expect(page).toHaveURL(/\/login/);
    const loginButton = page.getByRole("button", { name: /login/i });
    await expect(loginButton).toBeVisible();
  });

  test("should redirect unauthenticated user from dashboard to login page", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Expect to be redirected to the login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
  });
});
