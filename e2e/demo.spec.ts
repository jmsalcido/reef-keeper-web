import { test, expect } from '@playwright/test';
test('fictional reading → trend → task → reset stays local', async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', route => route.abort());
  const posts: string[] = []; page.on('request', r => { if (r.method()==='POST') posts.push(r.url()); });
  await page.goto('/demo');
  await expect(page.getByRole('button', {name:'Add sample retest task'})).toBeDisabled();
  await page.getByLabel('Choose a fictional nitrate reading').selectOption('22');
  await page.getByRole('button', { name: 'Record sample reading' }).click();
  await expect(page.getByRole('img', { name: /Fictional nitrate readings: 12, 17, 22/ })).toBeVisible();
  await page.getByRole('button', { name: 'Add sample retest task' }).click();
  await page.getByLabel('Mark sample task complete').check();
  await expect(page.getByText('Sample task completed.', {exact:true})).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('button', {name:'Add sample retest task'})).toBeDisabled();
  await page.reload(); await expect(page.getByRole('button', {name:'Add sample retest task'})).toBeDisabled();
  expect(posts).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
