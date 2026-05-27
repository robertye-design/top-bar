import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testAdvancedFeatures() {
  console.log('🧪 Testing Advanced Features (Threading, Edit, Delete)\n');
  console.log('=' .repeat(60) + '\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100 // Slow down to observe
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://localhost:8081/examples/vanilla-html/index.html', {
    waitUntil: 'networkidle0'
  });
  await sleep(1500);

  console.log('THREADING TEST');
  console.log('-'.repeat(60));

  // Get initial comment count
  const initialPins = await page.$$('.pf-pin');
  console.log(`Initial comments: ${initialPins.length}`);

  if (initialPins.length === 0) {
    console.log('⚠️  No existing comments - creating one first...');

    // Click Add Comment
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Add Comment'));
      btn?.click();
    });
    await sleep(500);

    // Place a comment
    await page.mouse.click(400, 300);
    await sleep(1000);

    // Fill form
    await page.type('input[type="text"]', 'Parent Comment Author');
    await page.type('textarea', 'This is the parent comment for testing threading');
    await page.click('button[type="submit"]');
    await sleep(2000);

    console.log('✓ Parent comment created');
  }

  console.log('\n1. Clicking existing comment pin...');
  await page.evaluate(() => {
    const pin = document.querySelector('.pf-pin');
    pin?.click();
  });
  await sleep(1000);

  const sidebar = await page.$('.pf-sidebar');
  const sidebarVisible = sidebar && await sidebar.isVisible();
  console.log(`   Sidebar opened: ${sidebarVisible ? '✓' : '✗'}`);

  if (sidebarVisible) {
    console.log('\n2. Looking for Reply button/form...');

    // Check if there's a reply form already visible in the thread
    const replyFormVisible = await page.evaluate(() => {
      const thread = document.querySelector('.pf-thread');
      if (!thread) return false;

      // Look for reply input/textarea in the thread
      const inputs = thread.querySelectorAll('input[type="text"]');
      const textareas = thread.querySelectorAll('textarea');

      return inputs.length > 0 && textareas.length > 0;
    });

    console.log(`   Reply form visible: ${replyFormVisible ? '✓' : '✗'}`);

    if (replyFormVisible) {
      console.log('\n3. Filling reply form...');

      // Get all inputs and textareas in the thread
      const threadInputs = await page.$$('.pf-thread input[type="text"]');
      const threadTextareas = await page.$$('.pf-thread textarea');

      if (threadInputs.length > 0 && threadTextareas.length > 0) {
        // Use the last input (should be reply form)
        await threadInputs[threadInputs.length - 1].type('Reply Author');
        await threadTextareas[threadTextareas.length - 1].type('This is a test reply to verify threading works');

        console.log('\n4. Submitting reply...');

        // Find submit button in thread
        const submitBtn = await page.$('.pf-thread button[type="submit"]');
        if (submitBtn) {
          await submitBtn.click();
          await sleep(2000);

          console.log('\n5. Verifying reply appears...');
          const replyCount = await page.evaluate(() => {
            const thread = document.querySelector('.pf-thread');
            // Count reply divs (nested under thread)
            const replies = thread?.querySelectorAll('.pf-thread > div:nth-last-child(2) > div');
            return replies?.length || 0;
          });

          console.log(`   Replies visible: ${replyCount > 0 ? '✓ PASS' : '✗ FAIL'}`);
          console.log(`   Reply count: ${replyCount}`);

          await page.screenshot({ path: '/tmp/threading-test.png', fullPage: true });
          console.log('   📸 Screenshot: /tmp/threading-test.png');
        } else {
          console.log('   ✗ FAIL: Submit button not found');
        }
      } else {
        console.log('   ✗ FAIL: Reply form fields not found');
      }
    } else {
      console.log('   ℹ️  Reply form not immediately visible - checking for Reply button...');

      const replyBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('.pf-thread button'));
        return buttons.find(b => b.textContent.toLowerCase().includes('reply'));
      });

      const replyBtnExists = await replyBtn.evaluate(el => el !== null && el !== undefined);

      if (replyBtnExists) {
        console.log('   ✓ Reply button found - clicking it...');
        await replyBtn.asElement().click();
        await sleep(500);

        // Now check for form again
        const formNowVisible = await page.evaluate(() => {
          const thread = document.querySelector('.pf-thread');
          const inputs = thread?.querySelectorAll('input[type="text"]');
          const textareas = thread?.querySelectorAll('textarea');
          return inputs && inputs.length > 0 && textareas && textareas.length > 0;
        });

        console.log(`   Reply form now visible: ${formNowVisible ? '✓' : '✗'}`);
      } else {
        console.log('   ℹ️  No Reply button found - form may already be open');
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('EDIT TEST');
  console.log('-'.repeat(60));

  console.log('\n1. Looking for Edit button...');
  const editBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('.pf-thread button'));
    return buttons.find(b => b.textContent.toLowerCase().includes('edit'));
  });

  const editBtnExists = await editBtn.evaluate(el => el !== null && el !== undefined);
  console.log(`   Edit button found: ${editBtnExists ? '✓' : '✗'}`);

  if (editBtnExists) {
    console.log('\n2. Clicking Edit button...');
    await editBtn.asElement().click();
    await sleep(1000);

    console.log('\n3. Modifying comment text...');
    // Look for textarea with existing text
    const textarea = await page.$('.pf-thread textarea');
    if (textarea) {
      await textarea.click({ clickCount: 3 }); // Select all
      await textarea.type('EDITED: This comment has been modified');

      console.log('\n4. Saving edit...');
      const saveBtn = await page.$('.pf-thread button[type="submit"]');
      if (saveBtn) {
        await saveBtn.click();
        await sleep(1500);

        console.log('\n5. Verifying edit appeared...');
        const commentText = await page.evaluate(() => {
          const thread = document.querySelector('.pf-thread');
          const textEl = thread?.querySelector('p');
          return textEl?.textContent || '';
        });

        const isEdited = commentText.includes('EDITED');
        console.log(`   Text updated: ${isEdited ? '✓ PASS' : '✗ FAIL'}`);
        console.log(`   Current text: "${commentText}"`);

        await page.screenshot({ path: '/tmp/edit-test.png', fullPage: true });
        console.log('   📸 Screenshot: /tmp/edit-test.png');
      } else {
        console.log('   ✗ FAIL: Save button not found');
      }
    } else {
      console.log('   ✗ FAIL: Textarea not found in edit mode');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('DELETE TEST');
  console.log('-'.repeat(60));

  const pinsBeforeDelete = await page.$$('.pf-pin');
  console.log(`\nComments before delete: ${pinsBeforeDelete.length}`);

  console.log('\n1. Looking for Delete button...');
  const deleteBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('.pf-thread button'));
    return buttons.find(b => b.textContent.toLowerCase().includes('delete'));
  });

  const deleteBtnExists = await deleteBtn.evaluate(el => el !== null && el !== undefined);
  console.log(`   Delete button found: ${deleteBtnExists ? '✓' : '✗'}`);

  if (deleteBtnExists) {
    console.log('\n2. Clicking Delete button...');
    await deleteBtn.asElement().click();
    await sleep(1500);

    console.log('\n3. Verifying comment deleted...');
    const pinsAfterDelete = await page.$$('.pf-pin');
    const wasDeleted = pinsAfterDelete.length < pinsBeforeDelete.length;

    console.log(`   Pin removed: ${wasDeleted ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`   Comments after delete: ${pinsAfterDelete.length}`);

    // Check if sidebar closed or shows empty state
    const sidebarAfterDelete = await page.$('.pf-sidebar');
    const stillVisible = sidebarAfterDelete && await sidebarAfterDelete.isVisible();
    console.log(`   Sidebar state: ${stillVisible ? 'still visible' : 'closed/hidden'}`);

    await page.screenshot({ path: '/tmp/delete-test.png', fullPage: true });
    console.log('   📸 Screenshot: /tmp/delete-test.png');
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary');
  console.log('-'.repeat(60));
  console.log(`Threading: ${replyFormVisible ? 'Structure exists ✓' : 'Needs verification'}`);
  console.log(`Edit: ${editBtnExists ? 'Button found ✓' : 'Not found ✗'}`);
  console.log(`Delete: ${deleteBtnExists ? 'Button found ✓' : 'Not found ✗'}`);
  console.log(`\nConsole errors: ${errors.length}`);

  console.log('\n⏳ Keeping browser open for 5 seconds for manual inspection...');
  await sleep(5000);

  await browser.close();
  console.log('\n✅ Advanced features test complete!\n');
}

testAdvancedFeatures().catch(console.error);
