import puppeteer from 'puppeteer';

import {
  extractDataFromPerformanceTiming,
  extractDataFromPerformanceMetrics,
} from './helpers.js';

const METRICS = [
  'responseEnd',
  'domInteractive',
  'domContentLoadedEventEnd',
  'loadEventEnd',
];
const URL = 'https://yandex.by';

const run = async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 250,
  });
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');

  await page.goto(URL);

  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );
  await page.waitFor(1000);
  const performanceMetrics = await client.send('Performance.getMetrics');

  const times = extractDataFromPerformanceTiming(performanceTiming, METRICS);
  const metrics = extractDataFromPerformanceMetrics(
    performanceMetrics,
    ['FirstMeaningfulPaint', 'DomContentLoaded']
  );

  console.log(`\n\n> timings for ${URL} in [ms]:`);
  console.log({ ...times, ...metrics }, '\n');



  await browser.close();
};

run();
