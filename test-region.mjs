import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testRegion() {
  console.log('🎯 Testing region selection...\n');

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  await page.goto('http://localhost:8081/examples/vanilla-html/index.html', {
    waitUntil: 'networkidle0'
  });
  await sleep(1000);

  // Find and click Add Comment button
  const btn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Add Comment'));
  });
  await btn.asElement().click();
  await sleep(500);

  console.log('Drawing region selection...');
  // Perform drag to select region
  await page.mouse.move(300, 300);
  await page.mouse.down();
  await page.mouse.move(600, 500, { steps: 10 });
  await page.mouse.up();
  await sleep(1000);

  // Check if region was created
  const pins = await page.$$('.pf-pin');
  console.log(`Pins created: ${pins.length}`);

  // Check if pin has region overlay
  const hasRegion = await page.evaluate(() => {
    const pin = document.querySelector('.pf-pin');
    if (!pin) return false;
    const overlay = pin.querySelector('div:last-child');
    return overlay && overlay.style.width && overlay.style.height;
  });
  console.log(`Pin has region overlay: ${hasRegion ? '✓ PASS' : '✗ FAIL'}`);

  await page.screenshot({ path: '/tmp/region-test.png', fullPage: true });
  console.log('\n📸 Screenshot: /tmp/region-test.png');

  await sleep(2000);
  await browser.close();
  console.log('\n✅ Region test complete!');
}

testRegion().catch(console.error);
