import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export function TopBar({ title, pluginManager }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick(t => t + 1);
    pluginManager.eventBus.on('topbar:update', handler);
    return () => pluginManager.eventBus.off('topbar:update', handler);
  }, [pluginManager]);

  const plugins = pluginManager.getInitializedPlugins();

  return (
    <div className="pf-topbar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: '#ffffff',
      borderBottom: '1px solid #ebebeb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 99999,
      fontFamily: 'Geist, Inter, system-ui, -apple-system, sans-serif',
      fontSize: '14px',
      letterSpacing: '-0.28px',
      boxSizing: 'border-box'
    }}>
      <div className="pf-topbar-left" style={{ fontWeight: 500, fontSize: '14px', color: '#171717', letterSpacing: '-0.28px' }}>
        {title}
      </div>
      <div className="pf-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {plugins.map(plugin => {
          if (plugin.getTopBarControls) {
            return plugin.getTopBarControls();
          }
          return null;
        })}
      </div>
    </div>
  );
}
