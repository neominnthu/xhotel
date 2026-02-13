import { test, expect } from '@playwright/test';
import { login, E2E_USERS } from './helpers/auth';

test('Front desk cannot access settings pages', async ({ page }) => {
  await login(page, E2E_USERS.frontDesk);

  const roomTypesResponse = await page.goto('/settings/room-types');
  expect(roomTypesResponse?.status()).toBe(403);

  const ratesResponse = await page.goto('/settings/rates');
  expect(ratesResponse?.status()).toBe(403);

  const policiesResponse = await page.goto('/settings/cancellation-policies');
  expect(policiesResponse?.status()).toBe(403);
});
