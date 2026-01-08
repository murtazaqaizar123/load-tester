import { browser } from 'k6/browser'; // No "experimental" in the path
import { check, sleep } from 'k6';
import { htmlReport } from './reporter.js';; 

export const options = {
// ... rest of your code
  scenarios: {
    ui_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 5 },  // Warm up
        { duration: '1m', target: 20 },  // Testing load
        { duration: '30s', target: 0 },   // Ramp down
      ],
      options: {
        browser: { type: 'chromium' },
      },
    },
  },
  thresholds: {
    'browser_web_vital_lcp': ['p(95) < 3500'], // Goal: Under 3.5s
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to your Tripy app login
    await page.goto('https://your-tripy-app-url.com/login');

    await page.locator('input[name="email"]').type('traveler@example.com');
    await page.locator('input[name="password"]').type('password123');
    
    await Promise.all([
      page.waitForNavigation(),
      page.locator('button[type="submit"]').click(),
    ]);

    check(page, {
      'header_found': p => p.locator('nav').isVisible(),
    });

    sleep(2);
  } finally {
    await page.close();
    await context.close();
  }
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
