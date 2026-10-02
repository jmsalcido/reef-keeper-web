import { test, expect } from '@playwright/test';
test('legacy privacy route and footer point to the existing current policy', async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', route => route.abort());
  await page.goto('/privacy');
  await expect(page.getByRole('link', { name: 'Read the current Bear Trail privacy policy' })).toHaveAttribute('href', 'https://beartrailworks.com/privacy/');
  await expect(page.getByText('plain-English draft')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByRole('link', {name: 'Privacy', exact:true})).toHaveAttribute('href', 'https://beartrailworks.com/privacy/');
});
