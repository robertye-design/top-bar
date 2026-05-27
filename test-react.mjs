import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testReact() {
  console.log('⚛️  Testing React Example\n');
  console.log('=' .repeat(60) + '\n');

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(`  ❌ Console error: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(err.message);
    console.log(`  ❌ Page error: ${err.message}`);
  });

  console.log('📖 Loading React app...');
  await page.goto('http://localhost:5173/', {
    waitUntil: 'networkidle0',
    timeout: 15000
  });
  await sleep(2000);

  console.log('\n✅ Test 1: React app renders');
  const h1 = await page.$('h1');
  const title = h1 ? await h1.evaluate(el => el.textContent) : null;
  console.log(`  Result: ${title?.includes('Task Manager') ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  Title: "${title}"`);

  console.log('\n✅ Test 2: Framework loads alongside React');
  const frameworkLoaded = await page.evaluate(() => typeof window.PrototypeFramework !== 'undefined');
  console.log(`  Result: ${frameworkLoaded ? '✓ PASS' : '✗ FAIL'}`);

  console.log('\n✅ Test 3: Top bar renders');
  const topBar = await page.$('.pf-comment-topbar');
  console.log(`  Result: ${topBar ? '✓ PASS' : '✗ FAIL'}`);

  console.log('\n✅ Test 4: Add Comment button exists');
  const btn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent.includes('Add Comment'));
  });
  const btnExists = await btn.evaluate(el => el !== null && el !== undefined);
  console.log(`  Result: ${btnExists ? '✓ PASS' : '✗ FAIL'}`);

  console.log('\n✅ Test 5: React interactivity still works');
  // Find the "Add Task" button in the React app
  const reactBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent === 'Add Task');
  });
  const reactBtnExists = await reactBtn.evaluate(el => el !== null && el !== undefined);
  console.log(`  Result: ${reactBtnExists ? '✓ PASS' : '✗ FAIL'}`);

  if (reactBtnExists) {
    // Test React functionality
    await page.type('input[type="text"]', 'Test task from automation');
    await reactBtn.asElement().click();
    await sleep(500);

    const taskItems = await page.$$('.task-item');
    console.log(`  Tasks after add: ${taskItems.length} (should be 5)`);
  }

  console.log('\n✅ Test 6: No style conflicts');
  // Check if React styles are intact
  const containerExists = await page.$('.container');
  console.log(`  Container styled: ${containerExists ? '✓ PASS' : '✗ FAIL'}`);

  if (btnExists) {
    console.log('\n✅ Test 7: Can create comment');
    await btn.asElement().click();
    await sleep(500);
    await page.mouse.click(500, 400);
    await sleep(1000);

    const sidebar = await page.$('.pf-sidebar');
    const sidebarVisible = sidebar && await sidebar.isVisible();
    console.log(`  Sidebar opens: ${sidebarVisible ? '✓ PASS' : '✗ FAIL'}`);

    if (sidebarVisible) {
      // Find the comment form inputs (not the React task input)
      const inputs = await page.$$('input[type="text"]');
      const textareas = await page.$$('textarea');

      if (inputs.length > 1 && textareas.length > 0) {
        // Use the second input (first is React's, second is comment form)
        await inputs[1].type('React Tester');
        await textareas[0].type('Testing comment in React app');
        await page.click('button[type="submit"]');
        await sleep(1500);

        const pins = await page.$$('.pf-pin');
        console.log(`  Comment created: ${pins.length > 0 ? '✓ PASS' : '✗ FAIL'}`);
        console.log(`  Total pins: ${pins.length}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Console errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Errors:');
    errors.forEach(e => console.log(`  - ${e}`));
  }

  await page.screenshot({ path: '/tmp/react-test.png', fullPage: true });
  console.log('\n📸 Screenshot: /tmp/react-test.png');

  await sleep(2000);
  await browser.close();
  console.log('\n✅ React test complete!\n');
}

testReact().catch(console.error);
