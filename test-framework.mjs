import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function test() {
  console.log('🚀 Starting framework tests...\n');

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('📖 Loading page...');
  await page.goto('http://localhost:8081/examples/vanilla-html/index.html', {
    waitUntil: 'networkidle0'
  });
  await sleep(1000);

  console.log('\n✅ Test 1: Framework loaded');
  const loaded = await page.evaluate(() => typeof window.PrototypeFramework !== 'undefined');
  console.log(`  Result: ${loaded ? '✓ PASS' : '✗ FAIL'}`);

  console.log('\n✅ Test 2: Top bar exists');
  const topBar = await page.$('[data-topbar]');
  console.log(`  Result: ${topBar ? '✓ PASS' : '✗ FAIL'}`);

  console.log('\n✅ Test 3: Add Comment button exists');
  const btn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Add Comment'));
  });
  const btnExists = await btn.evaluate(el => el !== null && el !== undefined);
  console.log(`  Result: ${btnExists ? '✓ PASS' : '✗ FAIL'}`);

  if (btnExists) {
    console.log('\n✅ Test 4: Click Add Comment');
    await btn.asElement().click();
    await sleep(500);
    console.log('  Result: ✓ Clicked');

    console.log('\n✅ Test 5: Place comment pin');
    await page.mouse.click(400, 300);
    await sleep(1000);

    const pin = await page.$('.pf-pin');
    console.log(`  Pin created: ${pin ? '✓ PASS' : '✗ FAIL'}`);

    const sidebar = await page.$('.pf-sidebar');
    console.log(`  Sidebar opened: ${sidebar ? '✓ PASS' : '✗ FAIL'}`);

    if (sidebar) {
      const visible = await sidebar.isVisible();
      console.log(`  Sidebar visible: ${visible ? '✓ PASS' : '✗ FAIL'}`);

      console.log('\n✅ Test 6: Fill and submit comment form');
      await page.type('input[type="text"]', 'Test User');
      await page.type('textarea', 'Test comment from automation');
      await sleep(300);

      await page.click('button[type="submit"]');
      await sleep(1500);

      const pins = await page.$$('.pf-pin');
      console.log(`  Pins after submit: ${pins.length}`);

      const threads = await page.$$('.pf-thread');
      console.log(`  Threads in sidebar: ${threads.length ? '✓ PASS' : '✗ FAIL'}`);
    }
  }

  await page.screenshot({ path: '/tmp/framework-final.png', fullPage: true });
  console.log('\n📸 Screenshot: /tmp/framework-final.png');

  console.log('\n📊 Errors:', errors.length);
  if (errors.length > 0) {
    console.log('❌ Error details:');
    errors.forEach(e => console.log(`  - ${e}`));
  }

  await sleep(3000);
  await browser.close();
  console.log('\n✅ Tests complete!');
}

test().catch(console.error);
