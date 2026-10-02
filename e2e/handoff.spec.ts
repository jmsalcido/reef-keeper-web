import { test, expect } from '@playwright/test';
test('desktop handoff is keyboard accessible and retains a direct link', async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', route => route.abort());
  await page.goto('/');
  await page.getByText('Reading on a computer? Open on your iPhone').click();
  await expect(page.getByAltText('QR code opening Reef Keeper on the App Store')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the App Store link instead' })).toHaveAttribute('href', /id6780324072/);
});
