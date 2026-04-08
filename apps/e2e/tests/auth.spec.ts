import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to the login page', async ({ page }) => {
    await page.goto('/');

    // Check for the "Get Started" button or "Login" link
    const loginLink = page.getByRole('link', { name: /login/i });
    await expect(loginLink).toBeVisible();

    await loginLink.click();

    // Expect to be on the login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });

  test('should show success message after submitting email', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('test@example.com');

    const submitButton = page.getByRole('button', { name: /send magic link/i });
    await submitButton.click();

    // Check for success message (Check your email)
    await expect(page.getByText(/check your email/i)).toBeVisible();
  });
});
