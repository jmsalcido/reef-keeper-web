import { test, expect } from '@playwright/test';
test('FAQ exposes keyboard state and illustrations clearly identify the store link', async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', route => route.abort());
  await page.goto('/');
  await expect(page.getByRole('main')).toHaveCount(1);
  const question = page.getByRole('button', { name: "What's the difference between the plans?" });
  await question.focus(); await question.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-answer-1')).toBeVisible();
  await question.press('Enter');
  await expect(page.locator('#faq-answer-1')).toBeHidden();
  await expect(page.getByRole('link', { name: 'View on the App Store', exact: true })).toHaveAttribute('href', /id6780324072/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
