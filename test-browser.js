const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🌐 Opening http://localhost:8080...');
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

  // Wait a moment for framework to initialize
  await page.waitForTimeout(1000);

  // Take initial screenshot
  await page.screenshot({ path: '/tmp/test-initial.png', fullPage: true });
  console.log('📸 Initial screenshot saved');

  // Test 1: Check if top bar exists
  console.log('\n✓ Test 1: Checking top bar...');
  const topBar = await page.$('[data-topbar]');
  if (topBar) {
    console.log('  ✓ Top bar found');
  } else {
    console.log('  ✗ Top bar NOT found');
  }

  // Test 2: Check if "Add Comment" button exists
  console.log('\n✓ Test 2: Checking "Add Comment" button...');
  const addCommentBtn = await page.$('button:has-text("Add Comment")');
  if (addCommentBtn) {
    console.log('  ✓ "Add Comment" button found');
  } else {
    console.log('  ✗ "Add Comment" button NOT found');
  }

  // Test 3: Click "Add Comment" and check if click mode activates
  if (addCommentBtn) {
    console.log('\n✓ Test 3: Activating click mode...');
    await addCommentBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/test-click-mode.png', fullPage: true });
    console.log('  📸 Click mode screenshot saved');

    // Test 4: Click on the page to place a comment
    console.log('\n✓ Test 4: Placing comment pin...');
    await page.click('.stat-card', { position: { x: 50, y: 50 } });
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/test-pin-placed.png', fullPage: true });
    console.log('  📸 Pin placed screenshot saved');

    // Test 5: Check if sidebar opened
    console.log('\n✓ Test 5: Checking sidebar...');
    const sidebar = await page.$('[data-sidebar]');
    if (sidebar) {
      const isVisible = await sidebar.isVisible();
      console.log(`  ${isVisible ? '✓' : '✗'} Sidebar ${isVisible ? 'visible' : 'NOT visible'}`);
    } else {
      console.log('  ✗ Sidebar element NOT found');
    }

    // Test 6: Fill out comment form
    console.log('\n✓ Test 6: Creating comment...');
    const authorInput = await page.$('input[placeholder*="name"], input[name="author"]');
    const textArea = await page.$('textarea');
    const submitBtn = await page.$('button:has-text("Submit"), button:has-text("Post"), button:has-text("Save")');

    if (authorInput && textArea && submitBtn) {
      await authorInput.fill('Test User');
      await textArea.fill('This is a test comment from automated testing');
      await page.screenshot({ path: '/tmp/test-form-filled.png', fullPage: true });
      console.log('  📸 Form filled screenshot saved');

      await submitBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: '/tmp/test-comment-created.png', fullPage: true });
      console.log('  📸 Comment created screenshot saved');
    } else {
      console.log('  ✗ Could not find form elements');
      console.log(`    Author input: ${!!authorInput}`);
      console.log(`    Text area: ${!!textArea}`);
      console.log(`    Submit button: ${!!submitBtn}`);
    }
  }

  // Test 7: Check console for errors
  console.log('\n✓ Test 7: Checking console logs...');
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.log(`  ✗ Console error: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`  ✗ Page error: ${error.message}`);
  });

  // Wait to observe
  console.log('\n⏳ Waiting 5 seconds to observe...');
  await page.waitForTimeout(5000);

  await browser.close();
  console.log('\n✅ Testing complete. Check screenshots in /tmp/');
})();
