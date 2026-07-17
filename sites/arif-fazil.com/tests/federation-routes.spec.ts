import { test, expect } from '@playwright/test';

const canonical = [
  '/',
  '/oil',
  '/gas',
  '/gold',
  '/makcikgpt',
  '/wells',
  '/discoveries',
  '/arifos',
  '/canon',
  '/essays',
];

const aliases: Array<{ from: string; expectPath: string }> = [
  { from: '/gass', expectPath: '/gas' },
  { from: '/gass/', expectPath: '/gas' },
  { from: '/makcikpgt', expectPath: '/makcikgpt' },
  { from: '/makcik-gpt', expectPath: '/makcikgpt' },
  { from: '/wealth/makcikgpt', expectPath: '/makcikgpt' },
  { from: '/oil/', expectPath: '/oil' },
];

test.describe('federation route canon', () => {
  for (const path of canonical) {
    test(`canonical ${path} has H1 and no page error`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const res = await page.goto(path);
      expect(res?.ok() || res?.status() === 304).toBeTruthy();
      await expect(page.locator('h1').first()).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  for (const { from, expectPath } of aliases) {
    test(`alias ${from} → ${expectPath}`, async ({ page }) => {
      await page.goto(from);
      await expect(page).toHaveURL(new RegExp(`${expectPath.replace('/', '\\/')}\\/?$`));
      await expect(page.locator('h1').first()).toBeVisible();
    });
  }

  test('mobile nav opens and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const menuBtn = page.getByRole('button', { name: /menu/i });
    await menuBtn.click();
    await expect(page.getByRole('dialog', { name: /mobile navigation/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: /mobile navigation/i })).toHaveCount(0);
  });

  test('search finds oil', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /search federation routes|find/i }).first().click();
    await page.getByLabel(/search routes/i).fill('oil');
    await expect(page.getByRole('button', { name: /oil/i }).first()).toBeVisible();
  });
});
