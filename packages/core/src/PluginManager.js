export class PluginManager {
  constructor(config, eventBus) {
    this.config = config;
    this.eventBus = eventBus;
    this._registry = {};
    this._instances = {};
    this.overlayContainer = null;
  }

  registerPlugin(name, PluginClass) {
    this._registry[name] = PluginClass;
  }

  initializePlugin(name) {
    const PluginClass = this._registry[name];
    if (!PluginClass) {
      console.warn(`Plugin "${name}" not registered`);
      return;
    }

    const framework = {
      config: this.config,
      eventBus: this.eventBus,
      getOverlayContainer: () => this.overlayContainer,
      getPlugin: (n) => this.getPlugin(n)
    };

    const plugin = new PluginClass(framework);
    plugin.init();
    this._instances[name] = plugin;
  }

  getPlugin(name) {
    return this._instances[name];
  }

  getInitializedPlugins() {
    return Object.values(this._instances);
  }

  destroyAll() {
    Object.values(this._instances).forEach(plugin => {
      if (plugin.destroy) plugin.destroy();
    });
    this._instances = {};
  }
}
