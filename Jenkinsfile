import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';
import { htmlReport } from './reporter.js';

export const options = {
  scenarios: {
    ui_test: {
      executor: 'constant-vus',
      vus: 1, // Start with 1 to verify it works
      duration: '10s',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
};

export default async function () {
  const page = browser.newPage();

  try {
    // Navigate to your Tripy App login
    await page.goto('https://your-app-url.com/login');

    await page.locator('input[name="email"]').type('traveler@example.com');
    await page.locator('input[name="password"]').type('password123');

    const submitButton = page.locator('button[type="submit"]');
    await Promise.all([
      page.waitForNavigation(),
      submitButton.click(),
    ]);

    check(page, {
      'header_exists': p => p.locator('nav').isVisible(),
    });

    sleep(2);
  } finally {
    page.close();
  }
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
