import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  scenarios: {
    browser_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10 },  // Warm up
        { duration: '2m', target: 50 },  // Stress test
        { duration: '2m', target: 100 }, // Peak load
        { duration: '1m', target: 0 },   // Cool down
      ],
      options: {
        browser: { type: 'chromium' },
      },
    },
  },
  thresholds: {
    'browser_web_vital_lcp': ['p(95) < 3000'], // 95% of users must see content within 3s
    'http_req_failed': ['rate<0.01'],          // Less than 1% request failure
  },
};

export default async function () {
  const context = browser.newContext();
  const page = context.newPage();

  try {
    // Replace with your EC2/Production URL
    await page.goto('https://your-tripy-app.com/login');

    // Fill login form
    await page.locator('input[name="email"]').type('test_traveler@example.com');
    await page.locator('input[name="password"]').type('password123');
    
    await Promise.all([
      page.waitForNavigation(),
      page.locator('button[type="submit"]').click(),
    ]);

    // Verify dashboard load
    check(page, {
      'is_logged_in': p => p.locator('nav').isVisible(),
    });

    sleep(2); // Mimic human thinking time

    // Navigate to a Tour Package page
    await page.goto('https://your-tripy-app.com/tours');
    sleep(3);

  } finally {
    page.close();
  }
}

// Generates the visual HTML report
export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
