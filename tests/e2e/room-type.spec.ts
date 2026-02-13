import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test('RoomType create → update → delete', async ({ page }) => {
  await login(page);
  await page.goto('/settings/room-types');
  await expect(page.locator('h1')).toHaveText(/Room Types/i);

  const name = `e2e-room-${Date.now()}`;
  await page.fill('input[name="name_en"]', name);
  await page.fill('input[name="name_my"]', `${name}-my`);
  await page.fill('input[name="capacity"]', '2');
  await page.fill('input[name="overbooking_limit"]', '0');
  await page.fill('input[name="base_rate"]', '100000');
  await page.fill('input[name="sort_order"]', '0');
  const createResponse = page.waitForResponse(
    (resp) => resp.url().includes('/settings/room-types') && resp.status() === 200,
  );
  await page.locator('[data-test="room-type-submit"]').click();
  await createResponse;
  await expect(page.getByText('အောင်မြင်ပါသည်')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('table')).toContainText(`${name}-my`, { timeout: 15000 });

  // edit
  const row = page.locator('table tr', { hasText: name }).first();
  await row.locator('button:has-text("Edit")').click();
  await page.fill('input[name="name_en"]', `${name}-updated`);
  await page.fill('input[name="name_my"]', `${name}-updated-my`);
  const updateResponse = page.waitForResponse(
    (resp) => resp.url().includes('/settings/room-types') && resp.status() === 200,
  );
  await page.locator('[data-test="room-type-submit"]').click();
  await updateResponse;
  await expect(page.locator('table')).toContainText(`${name}-updated-my`, { timeout: 15000 });

  // delete
  const updatedRow = page.locator('table tr', { hasText: `${name}-updated` }).first();
  page.once('dialog', (dialog) => dialog.accept());
  await updatedRow.locator('button:has-text("Delete")').click();
  await expect(page.locator('table')).not.toContainText(`${name}-updated`);
});
