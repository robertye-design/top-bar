import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export function TopBarUI({ getState, eventBus, onToggleMode }) {
  const [state, setState] = useState(getState());

  useEffect(() => {
    const handler = (newState) => setState({ ...newState });
    eventBus.on('comments:statechange', handler);
    return () => eventBus.off('comments:statechange', handler);
  }, [eventBus]);

  return (
    <div className="pf-comment-topbar" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{
        fontSize: '12px',
        color: '#888888',
        fontFamily: 'Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
        lineHeight: '16px'
      }}>
        {state.commentCount} comment{state.commentCount !== 1 ? 's' : ''}
      </span>
      <button
        onClick={onToggleMode}
        aria-label={state.commentMode ? 'Cancel commenting' : 'Add comment'}
        style={{
          padding: '0 8px',
          height: '28px',
          borderRadius: '6px',
          border: state.commentMode ? '1px solid #ebebeb' : 'none',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '-0.28px',
          cursor: 'pointer',
          fontFamily: 'Geist, Inter, system-ui, -apple-system, sans-serif',
          background: state.commentMode ? '#ffffff' : '#171717',
          color: state.commentMode ? '#171717' : '#ffffff',
          transition: 'all 0.15s ease',
          lineHeight: '20px'
        }}
      >
        {state.commentMode ? 'Cancel' : 'Add Comment'}
      </button>
    </div>
  );
}
