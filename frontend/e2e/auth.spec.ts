import { test, expect } from "@playwright/test";
import * as path from "path";

const SAMPLE_PDF = path.join(__dirname, "./fixtures/sample_contract.pdf");
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || "SecurePass123!";

test.describe("Authentication flows", () => {
  test("user can register a new account", async ({ page }) => {
    const timestamp = Date.now();
    const email = `test_${timestamp}@example.com`;

    await page.goto("/auth/register");

    // Verify page heading
    await expect(page.locator("h1")).toContainText("Create account");

    // Fill registration form
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[autocomplete="new-password"]').first().fill(TEST_PASSWORD);
    await page.locator('input[autocomplete="new-password"]').nth(1).fill(TEST_PASSWORD);

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Should redirect to dashboard after successful registration
    await page.waitForURL("/dashboard");
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("user can login and logout", async ({ page }) => {
    const timestamp = Date.now();
    const email = `test_${timestamp}@example.com`;

    // First register a user
    await page.goto("/auth/register");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[autocomplete="new-password"]').first().fill(TEST_PASSWORD);
    await page.locator('input[autocomplete="new-password"]').nth(1).fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("/dashboard");

    // Logout by clearing cookies and navigating to login
    const cookies = await page.context().cookies();
    await page.context().clearCookies();

    // Go to login page
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toContainText("Login");

    // Login
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();

    // Should redirect to dashboard
    await page.waitForURL("/dashboard");
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("login fails with wrong password", async ({ page }) => {
    const timestamp = Date.now();
    const email = `test_${timestamp}@example.com`;

    // Register a user first
    await page.goto("/auth/register");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[autocomplete="new-password"]').first().fill(TEST_PASSWORD);
    await page.locator('input[autocomplete="new-password"]').nth(1).fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("/dashboard");

    // Clear cookies to simulate logout
    await page.context().clearCookies();

    // Go to login page
    await page.goto("/auth/login");

    // Try to login with wrong password
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill("WrongPassword123!");
    await page.locator('button[type="submit"]').click();

    // Should show an error message
    await expect(page.locator("text=Invalid email or password")).toBeVisible();
    // Should stay on login page
    await expect(page).toHaveURL("/auth/login");
  });
});
