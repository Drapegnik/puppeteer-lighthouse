import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

import {
  extractDataFromPerformanceTiming,
  extractDataFromPerformanceMetrics,
} from './helpers.js';

dotenv.config();
const {URL, WAIT_TEXT, THROUGHPUT_KB_S} = process.env;

const DESKTOP = {
  name: 'Desktop 1920x1080',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
  viewport: {
    width: 1920,
    height: 1080
  }
};

const METRICS = [
  'responseEnd',
  'domInteractive',
  'domContentLoadedEventEnd',
  'loadEventEnd',
];

const run = async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 250,
  });
  const page = await browser.newPage();
  await page.emulate(DESKTOP);
  const client = await page.target().createCDPSession();
  // await client.send('Performance.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 200,
    downloadThroughput: THROUGHPUT_KB_S * 1024,
    uploadThroughput: THROUGHPUT_KB_S * 1024
  });

  const start = (new Date()).getTime();
  // await page.goto(URL);
  await client.send('Page.navigate', {'url': URL});
  await page.waitForNavigation({
    timeout: 240000,
    waitUntil: 'load'
  });
  await page.waitForFunction(
    `document.querySelector('body').innerText.includes('${WAIT_TEXT}')`
  );

  // const performanceTiming = JSON.parse(
  //   await page.evaluate(() => JSON.stringify(window.performance.timing))
  // );
  const end = (new Date()).getTime();
  const totalTimeSeconds = (end - start) / 1000;
  console.log(`> Page loaded for ${totalTimeSeconds}s when connection is ${THROUGHPUT_KB_S}kbit/s`);

  await page.screenshot({path: './out/page.png', fullPage:true});
  // await page.waitFor(1000);
  // const performanceMetrics = await client.send('Performance.getMetrics');
  //
  // const times = extractDataFromPerformanceTiming(performanceTiming, METRICS);
  // const metrics = extractDataFromPerformanceMetrics(
  //   performanceMetrics,
  //   ['FirstMeaningfulPaint', 'DomContentLoaded']
  // );
  //
  // console.log(`\n\n> timings for ${URL} in [ms]:`);
  // console.log(times, '\n');

  await browser.close();
};

run();
