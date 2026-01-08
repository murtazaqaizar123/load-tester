import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  scenarios: {
    ui_load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 }, 
        { duration: '1m', target: 50 },  
        { duration: '1m', target: 100 }, 
        { duration: '30s', target: 0 },   
      ],
      options: {
        browser: { type: 'chromium' },
      },
    },
  },
  thresholds: {
    'browser_web_vital_lcp': ['p(95) < 3000'],
    'http_req_failed': ['rate<0.01'],
  },
};

export default async function () {
  const context = browser.newContext();
  const page = context.newPage();

  try {
    await page.goto('https://dev.buildnest.net/auth/signin'); // Update this!
    await page.locator('input[name="email"]').type('moiz.sf@gmail.com');
    await page.locator('input[name="password"]').type('ABCabc123@');
    
    await Promise.all([
      page.waitForNavigation(),
      page.locator('button[type="Login"]').click(),
    ]);

    check(page, { 'dashboard_loaded': p => p.locator('nav').isVisible() });
    sleep(2);
  } finally {
    page.close();
  }
}

export function handleSummary(data) {
  return { "summary.html": htmlReport(data) };
}
