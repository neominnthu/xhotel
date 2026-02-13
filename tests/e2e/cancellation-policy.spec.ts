import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Settings — Cancellation policies (E2E)', () => {
  test('create → update (boundary) → delete', async ({ page }) => {
    await login(page);

    // navigate to cancellation policies
    await page.goto('/settings/cancellation-policies');
    await expect(page.locator('h1')).toHaveText(/Cancellation Policies/i);


    // fill boundary values
    const name = `e2e-policy-${Date.now()}`;
    await page.fill('input[name="name"]', name);


    await page.fill('input[name="deadline_hours"]', '720');
    await page.fill('input[name="penalty_amount"]', '10000');

    await page.locator('[data-test="policy-submit"]').click();
    await expect(page.locator('table')).toContainText(name, { timeout: 10000 });

    // created — row appears in list
    await expect(page.locator('table')).toContainText(name);

    // click edit for the created policy
    const row = page.locator('table tr', { hasText: name }).first();
    await row.locator('button:has-text("Edit")').click();
    await page.fill('input[name="name"]', `${name}-updated`);
    await page.locator('[data-test="policy-submit"]').click();

    await expect(page.locator('table')).toContainText(`${name}-updated`, { timeout: 10000 });

    // delete the policy
    const updatedRow = page.locator('table tr', { hasText: `${name}-updated` }).first();
    page.once('dialog', (dialog) => dialog.accept());
    await updatedRow.locator('button:has-text("Delete")').click();
    await page.waitForResponse(resp => resp.url().includes('/settings/cancellation-policies') && resp.status() === 200);

    await expect(page.locator('table')).not.toContainText(`${name}-updated`);
  });

  test('shows validation errors for invalid values', async ({ page }) => {
    await login(page);
    await page.goto('/settings/cancellation-policies');
    await page.fill('input[name="name"]', `invalid-${Date.now()}`);
    await page.fill('input[name="deadline_hours"]', '9999');

    const penaltyTypeField = page.locator('label:has-text("Penalty type")').locator('..');
    if (await penaltyTypeField.getByRole('combobox').count()) {
      await penaltyTypeField.getByRole('combobox').click();
      await page.getByRole('option', { name: /percent/i }).click();
    }

    await page.fill('input[name="penalty_percent"]', '150');
    await page.locator('[data-test="policy-submit"]').click();

    await expect(page.getByText(/deadline hours/i)).toBeVisible();
    await expect(page.getByText(/penalty percent/i)).toBeVisible();
  });
});
