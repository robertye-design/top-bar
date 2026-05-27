import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function check404() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const failed = [];
  page.on('requestfailed', request => {
    failed.push({
      url: request.url(),
      failure: request.failure().errorText
    });
  });

  page.on('response', response => {
    if (response.status() === 404) {
      failed.push({
        url: response.url(),
        status: 404
      });
    }
  });

  await page.goto('http://localhost:8081/examples/vanilla-html/index.html', {
    waitUntil: 'networkidle0'
  });
  await sleep(2000);

  console.log('404 errors:');
  failed.forEach(f => {
    console.log(`  - ${f.url}`);
    if (f.failure) console.log(`    Error: ${f.failure}`);
  });

  await browser.close();
}

check404().catch(console.error);
