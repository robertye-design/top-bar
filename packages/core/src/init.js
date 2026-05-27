import { h, render } from 'preact';
import { EventBus } from './EventBus.js';
import { PluginManager } from './PluginManager.js';
import { TopBar } from './TopBar.jsx';
import { CommentsPlugin } from '../../plugin-comments/src/index.js';

window.PrototypeFramework = {
  _instance: null,

  init(config) {
    if (!config.prototypeId) throw new Error('prototypeId is required');
    if (!config.apiUrl) throw new Error('apiUrl is required');

    const fullConfig = {
      plugins: ['comments'],
      topBarTitle: 'Prototype Review',
      theme: 'light',
      ...config
    };

    const overlay = document.createElement('div');
    overlay.className = 'pf-overlay';
    Object.assign(overlay.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      minHeight: '100%',
      pointerEvents: 'none',
      zIndex: '99997'
    });
    document.body.appendChild(overlay);

    const topBarContainer = document.createElement('div');
    topBarContainer.className = 'pf-topbar-root';
    document.body.prepend(topBarContainer);
    document.body.style.paddingTop = '64px';

    const eventBus = new EventBus();
    const pluginManager = new PluginManager(fullConfig, eventBus);
    pluginManager.overlayContainer = overlay;

    pluginManager.registerPlugin('comments', CommentsPlugin);

    fullConfig.plugins.forEach(name => pluginManager.initializePlugin(name));

    render(
      h(TopBar, { title: fullConfig.topBarTitle, pluginManager }),
      topBarContainer
    );

    this._instance = { pluginManager, config: fullConfig, eventBus, overlay, topBarContainer };
  },

  destroy() {
    if (this._instance) {
      this._instance.pluginManager.destroyAll();
      render(null, this._instance.topBarContainer);
      this._instance.overlay.remove();
      this._instance.topBarContainer.remove();
      document.body.style.paddingTop = '';
      this._instance = null;
    }
  }
};
