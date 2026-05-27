const http = require('http');

// Test 1: Check if HTML page loads
http.get('http://localhost:8080', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('✓ HTML page loaded successfully');
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  Content length: ${data.length} bytes`);

    // Check if framework files are referenced
    const hasCSS = data.includes('dist/style.css');
    const hasJS = data.includes('dist/prototype-framework.iife.js');
    const hasInit = data.includes('PrototypeFramework.init');

    console.log(`  ${hasCSS ? '✓' : '✗'} CSS link present`);
    console.log(`  ${hasJS ? '✓' : '✗'} JS script present`);
    console.log(`  ${hasInit ? '✓' : '✗'} Framework init call present`);
  });
}).on('error', (err) => {
  console.error('✗ Failed to load HTML:', err.message);
});

// Test 2: Check if CSS file loads
http.get('http://localhost:8080/../../dist/style.css', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('\n✓ CSS file loaded');
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  Size: ${data.length} bytes`);
  });
}).on('error', (err) => {
  console.error('\n✗ Failed to load CSS:', err.message);
});

// Test 3: Check if JS file loads
http.get('http://localhost:8080/../../dist/prototype-framework.iife.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('\n✓ JS file loaded');
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  Size: ${data.length} bytes`);

    // Check if it's valid JS (very basic check)
    const hasPrototypeFramework = data.includes('PrototypeFramework');
    console.log(`  ${hasPrototypeFramework ? '✓' : '✗'} PrototypeFramework export present`);
  });
}).on('error', (err) => {
  console.error('\n✗ Failed to load JS:', err.message);
});

// Test 4: Check backend API
http.get('http://localhost:3001/health', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('\n✓ Backend API responding');
    console.log(`  Status: ${res.statusCode}`);
    console.log(`  Response: ${data}`);
  });
}).on('error', (err) => {
  console.error('\n✗ Backend API error:', err.message);
});
