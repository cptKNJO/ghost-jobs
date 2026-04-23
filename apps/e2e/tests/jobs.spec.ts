import { test, expect } from "@playwright/test";
import { getLatestMagicLink } from "./utils";

async function login(page, email: string) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByRole("button", { name: /send magic link/i }).click();
  await expect(page.getByText(/check your email/i)).toBeVisible();

  const magicLink = await getLatestMagicLink(email);
  await page.goto(magicLink);
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Job Applications", () => {
  test.beforeEach(async ({ page }) => {
    const testEmail = `jobs-test-${Date.now()}@example.com`;
    await login(page, testEmail);
  });

  test("should allow adding a new job application", async ({ page }) => {
    // 1. Open the dialog
    await page
      .getByRole("button", { name: /new application/i })
      .first()
      .click();
    await expect(page.getByText(/add new application/i)).toBeVisible();

    // 2. Fill the form
    await page.getByLabel(/role/i).fill("Senior Software Engineer");
    await page.getByLabel(/link to post/i).fill("https://example.com/jobs/123");

    // 3. Select Company (using combobox)
    await page.getByLabel(/company/i).fill("Banana Land");

    // Check if there are items, if not, we might need to add one.
    // For this test, let's assume we need to add a company if it's empty.
    const emptyAddCompany = page.getByRole("button", { name: /add company/i });
    if (await emptyAddCompany.isVisible()) {
      await emptyAddCompany.click();
      await page.getByLabel(/company name/i).fill("Banana Land");
      // await page.getByLabel(/website/i).fill("https://testcompany.com");
      await page.getByRole("button", { name: /save company/i }).click();
      await expect(page.getByText(/add new company/i)).not.toBeVisible();
      await expect(page.getByText(/add new application/i)).toBeVisible();

      await page.getByLabel(/company/i).fill("Banana Land");
      await page.getByRole("option").first().click();
    } else {
      await page.getByLabel(/company/i).fill("Banana Land");
      await page.getByRole("option").first().click();
    }

    // 4. Select Source
    // const sourceCombobox = page
    //   .locator('button[data-slot="combobox-trigger"]')
    //   .nth(1);
    // await sourceCombobox.click();
    // const emptyAddSource = page.getByRole("button", { name: /add source/i });
    // if (await emptyAddSource.isVisible()) {
    //   await emptyAddSource.click();
    //   await page.getByLabel(/name/i).fill("LinkedIn");
    //   await page.getByRole("button", { name: /save source/i }).click();
    //   await expect(page.getByText(/add new application/i)).toBeVisible();
    // } else {
    //   await page.getByRole("option").first().click();
    // }

    // 5. Select Status
    await page.getByLabel(/status/i).click();
    await page.getByRole("option", { name: /applied/i }).click();

    // 8. Save the application
    await page.getByRole("button", { name: /save application/i }).click();

    await expect(page.getByText(/successfully saved/i)).toBeVisible();
    await page
      .getByRole("button", { name: /save application/i })
      .press("Escape");

    // 9. Verify it appears in the table
    await expect(page.getByText(/senior software engineer/i)).toBeVisible();
    await expect(page.getByText(/banana land/i)).toBeVisible();
  });
});
