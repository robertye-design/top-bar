import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testPersistence() {
  console.log('🔄 Testing comment persistence...\n');

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  await page.goto('http://localhost:8081/examples/vanilla-html/index.html', {
    waitUntil: 'networkidle0'
  });
  await sleep(1000);

  // Count initial pins
  let pins = await page.$$('.pf-pin');
  console.log(`Initial pins: ${pins.length}`);

  // Reload page
  console.log('Reloading page...');
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);

  // Count pins after reload
  pins = await page.$$('.pf-pin');
  console.log(`Pins after reload: ${pins.length}`);

  if (pins.length > 0) {
    console.log('✓ PASS: Comments persisted across reload');

    // Test clicking a pin
    console.log('\nTesting pin interaction...');
    await pins[0].click();
    await sleep(500);

    const sidebar = await page.$('.pf-sidebar');
    const visible = await sidebar.isVisible();
    console.log(`Sidebar opens on pin click: ${visible ? '✓ PASS' : '✗ FAIL'}`);

    // Test threading - add a reply
    console.log('\nTesting threading (replies)...');
    const replyInput = await page.$('.pf-thread input[type="text"]');
    if (replyInput) {
      await replyInput.type('Test Reply User');
      const replyText = await page.$('.pf-thread textarea');
      if (replyText) {
        await replyText.type('This is a reply to test threading');
        const replyBtn = await page.$('.pf-thread button[type="submit"]');
        if (replyBtn) {
          await replyBtn.click();
          await sleep(1500);

          // Check if reply appears
          const replies = await page.$$('.pf-thread > div:nth-last-child(2) > div');
          console.log(`Replies visible: ${replies.length > 0 ? '✓ PASS' : '✗ FAIL'}`);
          console.log(`Reply count: ${replies.length}`);
        }
      }
    }
  } else {
    console.log('✗ FAIL: No comments found after reload');
  }

  await page.screenshot({ path: '/tmp/persistence-test.png', fullPage: true });
  console.log('\n📸 Screenshot: /tmp/persistence-test.png');

  await sleep(2000);
  await browser.close();
  console.log('\n✅ Persistence test complete!');
}

testPersistence().catch(console.error);
