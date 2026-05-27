# Prototype Framework

> A framework-agnostic commenting tool for design prototypes. Add collaborative feedback to any HTML prototype with just 3 lines of code.

[![Bundle Size](https://img.shields.io/badge/bundle-14.24KB%20gzipped-success)](https://github.com/robertye-design/top-bar)
[![Backend](https://img.shields.io/badge/backend-live%20on%20vercel-blue)](https://api-ebon-two-17.vercel.app)

---

## ✨ Features

- **Zero-friction integration** - Add to any prototype in under 5 minutes
- **Framework agnostic** - Works with React, Vue, vanilla HTML, AI-generated code
- **Figma-like UX** - Familiar commenting interface for designers
- **Team collaboration** - Shared backend for persistent, synchronized comments
- **Thread replies** - Nested conversations on any comment
- **Region selection** - Click & drag to highlight specific areas
- **Extensible plugins** - Architecture supports adding new features

---

## 🚀 Quick Start

Add these 3 lines to your HTML prototype:

```html
<!-- Add before closing </body> tag -->
<link rel="stylesheet" href="https://cdn.example.com/style.css">
<script src="https://cdn.example.com/prototype-framework.iife.js"></script>
<script>
  PrototypeFramework.init({
    prototypeId: 'my-prototype',
    apiUrl: 'https://api-ebon-two-17.vercel.app'
  });
</script>
```

**That's it!** Your prototype now has a top bar with an "Add Comment" button.

---

## 📦 What's Included

```
prototype-framework/
├── packages/
│   ├── core/              # Plugin infrastructure, top bar, event bus
│   ├── plugin-comments/   # Comments plugin with UI components
│   └── api/              # Backend API (Express + JSON storage)
├── examples/
│   ├── vanilla-html/     # Plain HTML example
│   ├── react-prototype/  # React + Vite example
│   └── vue-prototype/    # Vue 3 + Vite example
├── docs/
│   └── integration-guide.md
└── dist/                 # Built bundle (ready to use)
    ├── prototype-framework.iife.js  (39 KB, 12.48 KB gzipped)
    └── style.css                     (8.3 KB, 1.76 KB gzipped)
```

---

## 💻 Usage

### Basic Configuration

```javascript
PrototypeFramework.init({
  prototypeId: 'dashboard-v2',           // Unique ID for this prototype
  apiUrl: 'https://api-ebon-two-17.vercel.app',  // Backend API
  topBarTitle: 'Dashboard Redesign'      // Optional title
});
```

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `prototypeId` | string | ✅ | Unique identifier for your prototype |
| `apiUrl` | string | ✅ | Backend API URL |
| `topBarTitle` | string | ❌ | Custom top bar title |
| `plugins` | array | ❌ | Plugins to load (default: `['comments']`) |
| `theme` | object | ❌ | Custom theme colors |

---

## 🎯 Examples

### Vanilla HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Prototype</title>
</head>
<body>
  <h1>Dashboard Prototype</h1>
  <div class="stats">...</div>

  <!-- Framework Integration -->
  <link rel="stylesheet" href="../../dist/style.css">
  <script src="../../dist/prototype-framework.iife.js"></script>
  <script>
    PrototypeFramework.init({
      prototypeId: 'dashboard-v2',
      apiUrl: 'https://api-ebon-two-17.vercel.app'
    });
  </script>
</body>
</html>
```

See [`examples/vanilla-html/`](examples/vanilla-html/) for a complete example.

### React

The framework works alongside React without conflicts:

```bash
cd examples/react-prototype
npm install
npm run dev
```

### Vue

Works with Vue 3 as well:

```bash
cd examples/vue-prototype
npm install
npm run dev
```

---

## 🏗️ Architecture

### Plugin System

```javascript
// Core framework provides:
class PluginManager {
  registerPlugin(name, plugin)
  initializePlugin(name, config)
  emit(event, data)  // Event bus
}

// Plugins implement:
class Plugin {
  constructor(framework, config) {}
  init() {}
  destroy() {}
  onTopBarRender(container) {}  // Optional
}
```

### Comments Plugin

**Components:**
- `CommentPin` - Visual pins on the page
- `CommentSidebar` - Slide-out panel with all comments
- `CommentThread` - Nested reply threads
- `RegionSelector` - Click & drag area selection
- `TopBarUI` - "Add Comment" button

**Features:**
- ✅ Point comments (click to place)
- ✅ Region comments (click & drag)
- ✅ Reply threading
- ✅ Edit/delete
- ✅ Persistent storage
- ✅ Real-time sync across users

---

## 🔧 Tech Stack

**Frontend:**
- Preact (React alternative, smaller bundle)
- Vite (build tool)
- CSS with `.pf-*` scoping (no conflicts)

**Backend:**
- Node.js 18+
- Express.js
- JSON file storage (upgradeable to DB)
- Deployed on Vercel

**Bundle Size:**
- JavaScript: 12.48 KB gzipped
- CSS: 1.76 KB gzipped
- **Total: 14.24 KB gzipped** ✨

---

## 🌐 Backend API

**Live URL:** `https://api-ebon-two-17.vercel.app`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/prototypes/:id/comments` | Get all comments |
| `POST` | `/api/prototypes/:id/comments` | Create comment |
| `PUT` | `/api/comments/:id` | Update comment |
| `DELETE` | `/api/comments/:id` | Delete comment |
| `POST` | `/api/comments/:id/replies` | Add reply |
| `DELETE` | `/api/comments/:id/replies/:replyId` | Delete reply |

### Run Backend Locally

```bash
cd packages/api
npm install
npm start
# Server runs on http://localhost:3001
```

### Deploy Your Own Backend

```bash
cd packages/api
npx vercel deploy --prod
```

---

## 🛠️ Development

### Build the Framework

```bash
# Install dependencies
npm install

# Build bundle
npm run build
# Output: dist/prototype-framework.iife.js + dist/style.css
```

### Project Structure

- **`packages/core/`** - Core framework (PluginManager, EventBus, TopBar)
- **`packages/plugin-comments/`** - Comments plugin (UI components, API client)
- **`packages/api/`** - Backend API (Express server, storage)

### Create a Custom Plugin

See [`docs/integration-guide.md`](docs/integration-guide.md) for plugin development guide.

---

## 📚 Documentation

- [Integration Guide](docs/integration-guide.md) - Complete setup instructions
- [Examples](examples/) - Working prototypes (HTML, React, Vue)

---

## 🎨 Design Philosophy

**For Designers:**
- No build tools required
- Copy-paste integration
- Familiar Figma-like UI
- Works with any prototype code

**For Developers:**
- Clean plugin architecture
- Minimal bundle size (<15KB)
- No framework dependencies
- Easy to extend

---

## 🚧 Roadmap

### V2 Features
- [ ] Keyboard shortcuts (C, Shift+C, Esc)
- [ ] Resolve/unresolve comments
- [ ] Sort & filter in sidebar
- [ ] Canvas mode plugin (frame navigator)

### V3 Features
- [ ] User authentication (Google SSO)
- [ ] @Mentions with notifications
- [ ] Rich text formatting
- [ ] Real-time updates (WebSocket)

### Future
- [ ] Database migration (PostgreSQL)
- [ ] Image attachments
- [ ] Comment analytics
- [ ] Public API

---

## ⚠️ Known Limitations

**Storage:** Backend uses `/tmp` directory on Vercel (ephemeral). For production use with long-term persistence, upgrade to a database.

**Browser Support:** Modern browsers only (Chrome, Firefox, Safari). No IE11.

**Real-time:** Comments load on page load. No WebSocket sync (coming in V3).

---

## 📄 License

MIT License - feel free to use in your projects!

---

## 🙏 Acknowledgements

Built with Claude Code using agent teams.

- Framework built by **css-styling**, **polish**, and **browser-testing** agents
- Coordinated by **team-lead** agent
- Deployed to Vercel: `https://api-ebon-two-17.vercel.app`

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Submit a pull request

For bugs or feature requests, [open an issue](https://github.com/robertye-design/top-bar/issues).

---

**Made for design teams 💜**
