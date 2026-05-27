# Integration Guide

This guide shows you how to add the Prototype Framework to any HTML prototype in just 2 lines of code.

## Quick Start

Add these two lines at the end of your HTML file, right before the closing `</body>` tag:

```html
<script src="https://your-cdn.com/prototype-framework.iife.js"></script>
<script>
  PrototypeFramework.init({
    prototypeId: 'my-prototype',
    apiUrl: 'https://api-ebon-two-17.vercel.app'
  });
</script>
```

That's it! Your prototype now has a top bar with an "Add Comment" button that lets users leave feedback.

## Configuration Options

The `init()` function accepts these options:

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `prototypeId` | string | Yes | A unique ID for your prototype (e.g., `'dashboard-v2'`). Comments are stored under this ID. |
| `apiUrl` | string | Yes | The URL of your API server (e.g., `'http://localhost:3001'` for local development). |
| `topBarTitle` | string | No | Text to display in the top bar (e.g., `'Dashboard Redesign — May 2026'`). Defaults to your prototype ID. |
| `plugins` | array | No | Additional plugins to load. Currently supports the comments plugin (loaded by default). |
| `theme` | object | No | Custom theme colors. Example: `{ primary: '#4353FF' }` |

### Example with All Options

```html
<script>
  PrototypeFramework.init({
    prototypeId: 'checkout-flow-v3',
    apiUrl: 'https://api-ebon-two-17.vercel.app',
    topBarTitle: 'New Checkout Flow — Spring 2026',
    theme: {
      primary: '#4353FF'
    }
  });
</script>
```

## CDN Usage

For production prototypes, use the CDN-hosted version of the framework:

```html
<!-- Replace with your actual CDN URL -->
<script src="https://your-cdn.com/prototype-framework.iife.js"></script>
```

For local development, reference the built file from your project:

```html
<script src="../../dist/prototype-framework.iife.js"></script>
```

## Examples

We've created example prototypes to show how the framework works with different technologies:

### Vanilla HTML
[examples/vanilla-html/](../examples/vanilla-html/) - A simple dashboard prototype using plain HTML/CSS/JavaScript.

### React
[examples/react-prototype/](../examples/react-prototype/) - A task manager built with React + Vite. Shows how the framework works alongside a modern React app.

**To run:**
```bash
cd examples/react-prototype
npm install
npm run dev
```

### Vue
[examples/vue-prototype/](../examples/vue-prototype/) - A product catalog built with Vue 3 + Vite. Demonstrates Vue integration.

**To run:**
```bash
cd examples/vue-prototype
npm install
npm run dev
```

## Troubleshooting

### Comments aren't saving

**Check that your API server is running:**
```bash
cd packages/api
npm start
```

The API should be running at `http://localhost:3001` (or whatever URL you specified in `apiUrl`).

**Verify the API URL in your config:**
Make sure the `apiUrl` matches where your API server is running. Check the browser console for network errors.

### Top bar isn't showing

**Make sure the script loaded:**
Open the browser console and check for errors. The framework script should load before you call `init()`.

**Check the script path:**
If you're using a relative path like `../../dist/prototype-framework.iife.js`, make sure it's correct relative to your HTML file.

### Comments from different prototypes are mixed together

**Use unique prototype IDs:**
Each prototype should have a different `prototypeId`. The ID determines which comments are loaded for that prototype.

### CORS errors in the console

**Your API needs CORS headers:**
The API server should allow requests from your prototype's origin. The included API server already has CORS enabled for all origins (`'*'`), but if you're using a custom API, make sure it returns the appropriate CORS headers.

### Framework conflicts with my existing code

**Check for global variable conflicts:**
The framework exposes a global `PrototypeFramework` object. If your code also uses this name, you'll need to rename one of them.

**CSS conflicts:**
The framework includes minimal CSS that shouldn't conflict with your styles. If you see styling issues, check for overly broad CSS selectors in your code.

## Next Steps

- Customize the top bar title for your prototype
- Deploy your API to Vercel using the included `vercel.json`
- Share your prototype with stakeholders and collect feedback
- Export comments as JSON using the API endpoints

Need help? Check the [API documentation](./api-reference.md) or open an issue on GitHub.
