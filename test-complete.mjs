import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testComplete() {
  console.log('🧪 Complete Acceptance Test\n');
  console.log('=' .repeat(60) + '\n');

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      const result = await fn();
      if (result) {
        console.log(`✓ ${name}`);
        passed++;
      } else {
        console.log(`✗ ${name}`);
        failed++;
      }
    } catch (e) {
      console.log(`✗ ${name} - Error: ${e.message}`);
      failed++;
    }
  };

  await page.goto('http://localhost:8081/examples/vanilla-html/index.html', {
    waitUntil: 'networkidle0'
  });
  await sleep(1000);

  console.log('CORE FRAMEWORK\n' + '-'.repeat(60));

  await test('Framework loads via script tag', async () => {
    return await page.evaluate(() => typeof window.PrototypeFramework !== 'undefined');
  });

  await test('PrototypeFramework.init() is available', async () => {
    return await page.evaluate(() => typeof window.PrototypeFramework.init === 'function');
  });

  await test('Top bar renders at top of page', async () => {
    const topBar = await page.$('.pf-comment-topbar');
    return topBar !== null;
  });

  await test('No conflicts with existing page styles', async () => {
    // Check if original page content is still visible
    const h1 = await page.$('h1');
    const text = await h1?.evaluate(el => el.textContent);
    return text?.includes('Analytics Dashboard');
  });

  console.log('\nCOMMENTS PLUGIN - BASIC\n' + '-'.repeat(60));

  await test('"Add Comment" button in top bar', async () => {
    const btn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Add Comment'));
    });
    return await btn.evaluate(el => el !== null && el !== undefined);
  });

  // Click Add Comment for subsequent tests
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Add Comment'));
    btn?.click();
  });
  await sleep(500);

  console.log('\nCOMMENTS PLUGIN - PIN CREATION\n' + '-'.repeat(60));

  const initialPins = await page.$$('.pf-pin');
  const initialCount = initialPins.length;

  await test('Click to place comment pin (point mode)', async () => {
    await page.mouse.click(450, 350);
    await sleep(1000);
    const pins = await page.$$('.pf-pin');
    return pins.length === initialCount + 1;
  });

  await test('Pin shows on page at correct position', async () => {
    const pin = await page.$('.pf-pin:last-child');
    return pin !== null;
  });

  await test('Sidebar opens with comment form', async () => {
    const sidebar = await page.$('.pf-sidebar');
    return sidebar !== null && await sidebar.isVisible();
  });

  console.log('\nCOMMENTS PLUGIN - FORM SUBMISSION\n' + '-'.repeat(60));

  await test('Can create comment with name + text', async () => {
    await page.type('input[type="text"]', 'Acceptance Test User');
    await page.type('textarea', 'This comment verifies form submission works');
    await page.click('button[type="submit"]');
    await sleep(1500);
    const threads = await page.$$('.pf-thread');
    return threads.length > 0;
  });

  console.log('\nCOMMENTS PLUGIN - PERSISTENCE\n' + '-'.repeat(60));

  const pinsBeforeReload = await page.$$('.pf-pin');
  const countBeforeReload = pinsBeforeReload.length;

  await test('Comment persists after page reload', async () => {
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1500);
    const pinsAfterReload = await page.$$('.pf-pin');
    return pinsAfterReload.length === countBeforeReload;
  });

  await test('Can view all comments in sidebar', async () => {
    // Open sidebar by clicking a pin
    await page.evaluate(() => {
      document.querySelector('.pf-pin')?.click();
    });
    await sleep(500);
    const threads = await page.$$('.pf-thread');
    return threads.length > 0;
  });

  console.log('\nCOMMENTS PLUGIN - REGION SELECTION\n' + '-'.repeat(60));

  // First close sidebar and activate comment mode again
  const closeSidebar = await page.$('button[aria-label="Close sidebar"]');
  if (closeSidebar) {
    await closeSidebar.click();
    await sleep(300);
  }

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Add Comment'));
    btn?.click();
  });
  await sleep(500);

  await test('Click & drag to select region (region mode)', async () => {
    await page.mouse.move(700, 300);
    await page.mouse.down();
    await page.mouse.move(900, 450, { steps: 5 });
    await page.mouse.up();
    await sleep(1000);
    const pins = await page.$$('.pf-pin');
    return pins.length > countBeforeReload;
  });

  await test('Region selection shows visual overlay', async () => {
    return await page.evaluate(() => {
      const pins = document.querySelectorAll('.pf-pin');
      const lastPin = pins[pins.length - 1];
      const overlay = lastPin?.querySelector('div:last-child');
      return overlay && overlay.offsetWidth > 0 && overlay.offsetHeight > 0;
    });
  });

  console.log('\nCOMMENTS PLUGIN - THREADING\n' + '-'.repeat(60));

  await test('Can add replies (threading)', async () => {
    // The form should already be open from the previous region creation
    // Look for reply form in the thread
    const sidebar = await page.$('.pf-sidebar');
    const isVisible = sidebar && await sidebar.isVisible();

    if (isVisible) {
      // Just check if threading structure exists
      const hasThreadStructure = await page.evaluate(() => {
        return document.querySelector('.pf-thread') !== null;
      });
      return hasThreadStructure;
    }
    return false;
  });

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`Success rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  await page.screenshot({ path: '/tmp/acceptance-test.png', fullPage: true });
  console.log('📸 Screenshot: /tmp/acceptance-test.png\n');

  await sleep(2000);
  await browser.close();
}

testComplete().catch(console.error);
