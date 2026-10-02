import { test, expect } from '@playwright/test';
test('relevant guide leads to real first-aquarium workflow', async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', route => route.abort());
  await page.goto('/blog/new-tank-syndrome-nitrogen-cycle');
  await page.getByRole('link', { name: 'Start your first aquarium logbook' }).click();
  await expect(page).toHaveTitle('Start your first aquarium logbook | Reef Keeper');
  await expect(page.getByRole('heading', { name: 'Record a test you measured' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/first-aquarium$/);
  await page.reload(); await expect(page.getByRole('main')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
