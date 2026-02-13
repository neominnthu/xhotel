import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test('Rate create → update → delete', async ({ page }) => {
  await login(page);
  await page.goto('/settings/rates');
  await expect(page.locator('h1')).toHaveText(/Rates/i);

  const name = `e2e-rate-${Date.now()}`;
  await page.fill('input[name="name"]', name);
  const roomTypeTrigger = page.locator('[data-test="rate-room-type"]');
  if (await roomTypeTrigger.count()) {
    await roomTypeTrigger.click();
    const e2eOption = page.getByRole('option', { name: /e2e standard/i });
    if (await e2eOption.count()) {
      await e2eOption.first().click();
    } else {
      const options = page.getByRole('option');
      if ((await options.count()) === 0) {
        throw new Error('No room type options available for rate creation.');
      }
      await options.first().click();
    }
  }

  const typeTrigger = page.locator('[data-test="rate-type"]');
  if (await typeTrigger.count()) {
    await typeTrigger.click();
    await page.getByRole('option', { name: /special/i }).click();
  }
  await page.fill('input[name="start_date"]', '2030-01-01');
  await page.fill('input[name="end_date"]', '2030-01-05');
  await page.fill('input[name="rate"]', '120000');
  await page.fill('input[name="min_stay"]', '1');
  await page.locator('[data-test="rate-submit"]').click();

  await expect(page.locator('table')).toContainText(name, { timeout: 10000 });

  // edit
  const row = page.locator('table tr', { hasText: name }).first();
  await row.locator('button:has-text("Edit")').click();
  await page.fill('input[name="name"]', `${name}-updated`);
  await page.locator('[data-test="rate-submit"]').click();
  await expect(page.locator('table')).toContainText(`${name}-updated`, { timeout: 10000 });

  // delete
  const updatedRow = page.locator('table tr', { hasText: `${name}-updated` }).first();
  page.once('dialog', (dialog) => dialog.accept());
  await updatedRow.locator('button:has-text("Delete")').click();
  await expect(page.locator('table')).not.toContainText(`${name}-updated`);
});
