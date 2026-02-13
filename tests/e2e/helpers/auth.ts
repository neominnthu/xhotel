import type { Page } from '@playwright/test';

export const E2E_USERS = {
  manager: process.env.PLAYWRIGHT_TEST_USER || 'e2e@example.com',
  frontDesk: process.env.PLAYWRIGHT_FRONT_DESK_USER || 'e2e-frontdesk@example.com',
};

export const E2E_PASSWORD = process.env.PLAYWRIGHT_TEST_PASSWORD || 'password';

export async function waitForHealth(page: Page): Promise<void> {
  const response = await page.request.get('/health');
  if (!response.ok()) {
    throw new Error(`Health check failed: ${response.status()}`);
  }
}

export async function login(page: Page, email = E2E_USERS.manager): Promise<void> {
  await waitForHealth(page);
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  if (!page.url().includes('/login')) {
    return;
  }

  await page.waitForSelector('input[name="email"]', { state: 'visible' });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', E2E_PASSWORD);
  await page.click('[data-test="login-button"]');
  await page.waitForURL((url) => !url.toString().includes('/login'), {
    timeout: 30000,
    waitUntil: 'domcontentloaded',
  });
}
