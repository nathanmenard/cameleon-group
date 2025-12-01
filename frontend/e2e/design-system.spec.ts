import { expect, test } from "@playwright/test";

test.describe("Design System Page", () => {
  test("should load and display main elements", async ({ page }) => {
    await page.goto("http://localhost:3000/design-system");
    await expect(page).toHaveTitle(/Design System/);
    await expect(page.getByText(/Drakkar Design System/)).toBeVisible();
  });
});
