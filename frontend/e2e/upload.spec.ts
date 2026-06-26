import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

const SAMPLE_PDF = path.join(__dirname, "./fixtures/sample_contract.pdf");
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || "SecurePass123!";

test.describe("File upload", () => {
  test("user can upload a PDF file", async ({ page }) => {
    const timestamp = Date.now();
    const email = `upload_${timestamp}@example.com`;

    // Register and login
    await page.goto("/auth/register");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[autocomplete="new-password"]').first().fill(TEST_PASSWORD);
    await page.locator('input[autocomplete="new-password"]').nth(1).fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("/dashboard");

    // Go to upload page
    await page.goto("/upload");
    await expect(page.locator("h1")).toContainText("Upload contract");

    // Upload file using file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(SAMPLE_PDF);

    // The file should be selected and shown
    await expect(page.locator("text=sample_contract.pdf")).toBeVisible();

    // Submit upload
    await page.locator('button[type="submit"]').click();

    // Should show uploading status
    await expect(page.locator("text=Uploading contract...")).toBeVisible();
  });

  test("upload rejects non-PDF file", async ({ page }) => {
    const timestamp = Date.now();
    const email = `upload_reject_${timestamp}@example.com`;

    // Register and login
    await page.goto("/auth/register");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[autocomplete="new-password"]').first().fill(TEST_PASSWORD);
    await page.locator('input[autocomplete="new-password"]').nth(1).fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("/dashboard");

    // Create a temporary text file to upload
    const txtFilePath = path.join(__dirname, "./fixtures/not_a_contract.txt");
    fs.writeFileSync(txtFilePath, "This is not a PDF file.");

    // Go to upload page
    await page.goto("/upload");

    // Upload non-PDF file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(txtFilePath);

    // Should show error message about file type
    await expect(page.locator("text=Only PDF and DOCX files are supported.")).toBeVisible();

    // Clean up temp file
    fs.unlinkSync(txtFilePath);
  });
});
