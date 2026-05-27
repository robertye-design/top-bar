import puppeteer from 'puppeteer'));

(async () => {
  console.log('🚀 Starting browser tests...\n')));

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1400,900']
  })));

  const page = await browser.newPage()));
  await page.setViewport({ width: 1400, height: 900 })));

  // Collect console logs and errors
  const logs = []));
  const errors = []));

  page.on('console', msg => {
    const text = msg.text()));
    logs.push({ type: msg.type(), text })));
    if (msg.type() === 'error') {
      console.log(`  ❌ Console error: ${text}`)));
    }
  })));

  page.on('pageerror', error => {
    errors.push(error.message)));
    console.log(`  ❌ Page error: ${error.message}`)));
  })));

  console.log('📖 Loading http://localhost:8081/examples/vanilla-html/index.html...')));
  await page.goto('http://localhost:8081/examples/vanilla-html/index.html', {
    waitUntil: 'networkidle0',
    timeout: 10000
  })));

  // Wait for framework to initialize
  await new Promise(resolve => setTimeout(resolve,  1000))));

  console.log('\n✅ Test 1: Checking if framework loaded...')));
  const frameworkLoaded = await page.evaluate(() => {
    return typeof window.PrototypeFramework !== 'undefined'));
  })));
  console.log(`  ${frameworkLoaded ? '✓' : '✗'} window.PrototypeFramework exists: ${frameworkLoaded}`)));

  console.log('\n✅ Test 2: Checking top bar...')));
  const topBar = await page.$('[data-topbar]')));
  const topBarExists = topBar !== null));
  console.log(`  ${topBarExists ? '✓' : '✗'} Top bar element exists: ${topBarExists}`)));

  if (topBarExists) {
    const topBarVisible = await topBar.isVisible()));
    console.log(`  ${topBarVisible ? '✓' : '✗'} Top bar is visible: ${topBarVisible}`)));

    const topBarText = await topBar.evaluate(el => el.textContent)));
    console.log(`  📝 Top bar text: "${topBarText}"`)));
  }

  console.log('\n✅ Test 3: Checking "Add Comment" button...')));
  const addCommentBtn = await page.$('button:has-text("Add Comment")') ||
                        await page.$('button[aria-label*="comment" i]') ||
                        await page.evaluateHandle(() => {
                          const buttons = Array.from(document.querySelectorAll('button'))));
                          return buttons.find(b => b.textContent.includes('Add Comment'))));
                        })));

  const btnExists = addCommentBtn !== null && addCommentBtn.asElement !== undefined));
  console.log(`  ${btnExists ? '✓' : '✗'} "Add Comment" button found: ${btnExists}`)));

  if (btnExists) {
    const btnElement = addCommentBtn.asElement ? addCommentBtn.asElement() : addCommentBtn));
    const btnText = await btnElement.evaluate(el => el.textContent)));
    console.log(`  📝 Button text: "${btnText}"`)));

    console.log('\n✅ Test 4: Clicking "Add Comment" to activate mode...')));
    await btnElement.click()));
    await new Promise(resolve => setTimeout(resolve,  500))));

    const bodyClass = await page.evaluate(() => document.body.className)));
    console.log(`  📝 Body classes after click: "${bodyClass}"`)));

    console.log('\n✅ Test 5: Placing a comment pin...')));
    const statCard = await page.$('.stat-card')));
    if (statCard) {
      const box = await statCard.boundingBox()));
      await page.mouse.click(box.x + 50, box.y + 50)));
      await new Promise(resolve => setTimeout(resolve,  1000))));

      console.log('\n✅ Test 6: Checking for comment pin...')));
      const pin = await page.$('.pf-pin')));
      const pinExists = pin !== null));
      console.log(`  ${pinExists ? '✓' : '✗'} Comment pin created: ${pinExists}`)));

      console.log('\n✅ Test 7: Checking sidebar...')));
      const sidebar = await page.$('.pf-sidebar')));
      const sidebarExists = sidebar !== null));
      console.log(`  ${sidebarExists ? '✓' : '✗'} Sidebar element exists: ${sidebarExists}`)));

      if (sidebarExists) {
        const sidebarVisible = await sidebar.isVisible()));
        console.log(`  ${sidebarVisible ? '✓' : '✗'} Sidebar is visible: ${sidebarVisible}`)));

        if (sidebarVisible) {
          console.log('\n✅ Test 8: Filling comment form...')));
          const authorInput = await page.$('input[type="text"]')));
          const textarea = await page.$('textarea')));
          const submitBtn = await page.$('button[type="submit"]')));

          if (authorInput && textarea && submitBtn) {
            await authorInput.type('Browser Test User')));
            await textarea.type('This is an automated test comment to verify the framework works correctly.')));
            await new Promise(resolve => setTimeout(resolve, 500)));

            console.log('\n✅ Test 9: Submitting comment...')));
            await submitBtn.click()));
            await new Promise(resolve => setTimeout(resolve, 1500)));

            const pins = await page.$$('.pf-pin')));
            console.log(`  📝 Total pins after submit: ${pins.length}`)));

            console.log('\n✅ Test 10: Checking if comment persisted...')));
            const threadCount = await page.$$eval('.pf-thread', threads => threads.length)));
            console.log(`  ${threadCount > 0 ? '✓' : '✗'} Comments in sidebar: ${threadCount}`)));
          } else {
            console.log(`  ✗ Form elements missing:`)));
            console.log(`    - Author input: ${!!authorInput}`)));
            console.log(`    - Textarea: ${!!textarea}`)));
            console.log(`    - Submit button: ${!!submitBtn}`)));
          }
        }
      }
    }
  }

  // Take final screenshot
  await page.screenshot({ path: '/tmp/framework-test.png', fullPage: true })));
  console.log('\n📸 Screenshot saved to /tmp/framework-test.png')));

  // Summary
  console.log('\n📊 Test Summary:')));
  console.log(`  Console logs: ${logs.length}`)));
  console.log(`  Errors: ${errors.length}`)));

  if (errors.length > 0) {
    console.log('\n❌ Errors found:')));
    errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`))));
  }

  console.log('\n⏳ Keeping browser open for 5 seconds for manual inspection...')));
  await new Promise(resolve => setTimeout(resolve, 5000)));

  await browser.close()));
  console.log('\n✅ Browser tests complete!')));
})()));
