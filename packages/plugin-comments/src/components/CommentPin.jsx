import { h } from 'preact';

export function CommentPin({ comment, number, isSelected, onClick }) {
  const hasRegion = comment.type === 'region' && comment.region;

  return (
    <div
      className={`pf-pin ${isSelected ? 'pf-pin--selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${comment.position.x}px`,
        top: `${comment.position.y}px`,
        pointerEvents: 'auto',
        zIndex: 99996,
        transform: 'translate(-12px, -12px)',
        cursor: 'pointer'
      }}
      onClick={(e) => { e.stopPropagation(); onClick(comment); }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '9999px',
        background: isSelected ? '#171717' : '#171717',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: 'Geist, Inter, system-ui, -apple-system, sans-serif',
        boxShadow: isSelected
          ? '0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a, 0 0 0 2px #ffffff, 0 0 0 4px #171717'
          : '0px 1px 1px #00000005, 0px 2px 2px #0000000a',
        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
        transform: isSelected ? 'scale(1.1)' : 'scale(1)'
      }}>
        {number}
      </div>

      {hasRegion && (
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '12px',
          width: `${comment.region.width}px`,
          height: `${comment.region.height}px`,
          border: '1.5px solid rgba(23,23,23,0.35)',
          background: 'rgba(23,23,23,0.04)',
          borderRadius: '8px',
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
}
